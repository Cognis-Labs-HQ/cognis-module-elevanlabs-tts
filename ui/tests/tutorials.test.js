import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mountProvider } from "../tutorials/provider.js";

const manifest = JSON.parse(
    readFileSync(new URL("../../manifest.json", import.meta.url), "utf8"),
);

function fixture({ fail = false } = {}) {
    const controller = new AbortController();
    let disposed = false,
        registered,
        administrative = true,
        authenticated = true,
        offline = false;
    const targets = [],
        routes = [],
        published = new Map();
    const owner = {
        signal: controller.signal,
        dispose: () => {
            disposed = true;
        },
        target: async (id, options) => {
            assert.equal(typeof options.resolve, "function");
            targets.push(id);
            return { id: `module.${manifest.id}:${id}` };
        },
        register: async (play) => {
            registered = play;
            if (fail) throw new Error("registration_failed");
            return { id: `module.${manifest.id}:${play.id}` };
        },
    };
    const capabilities = new Map([
        [
            "ui:tutorials",
            {
                version: 1,
                owner: (id, options) => {
                    assert.equal(id, `module.${manifest.id}`);
                    assert.equal(options.signal, controller.signal);
                    assert.deepEqual(options.stringsBaseUrls, [
                        `/static/modules/${manifest.id}/languages`,
                    ]);
                    return owner;
                },
            },
        ],
        [
            "ui:reuse",
            {
                importModule: async (name) => {
                    assert.equal(name, "access-role.js");
                    return { isAdminScope: () => administrative };
                },
            },
        ],
        ["session:isAuthenticated", () => authenticated],
        ["offline:state", { isOffline: () => offline }],
        [
            "ui:moduleTutorialTargets",
            {
                settings: async (id, { signal }) => {
                    assert.equal(id, manifest.id);
                    assert.equal(signal, owner.signal);
                    return {
                        id: "ui.modules:settings",
                        popup: "published-settings-surface",
                    };
                },
                field: async (_id, key) => ({
                    id: `ui.modules:field.${key}`,
                    popup: "published-settings-surface",
                }),
                action: async (_id, key) => ({
                    id: `ui.modules:action.${key}`,
                    popup: "published-settings-surface",
                }),
                preview: async () => ({
                    id: "ui.modules:preview",
                    popup: "published-settings-surface",
                }),
                bindSettings: (_id, options) => {
                    targets.push(options.signal);
                    return () => {};
                },
            },
        ],
        [
            "study:tutorialTargets",
            {
                navigation: "study:navigation",
                route: async (input) => {
                    routes.push(input);
                    return `/resolved/${input.language}/${input.area}`;
                },
            },
        ],
    ]);
    const ctx = {
        signal: controller.signal,
        capabilities: {
            get: (id) => capabilities.get(id),
            contribute: (id, value) => published.set(id, value),
        },
    };
    return {
        ctx,
        targets,
        routes,
        published,
        capabilities,
        get play() {
            return registered;
        },
        get disposed() {
            return disposed;
        },
        authenticate(value) {
            authenticated = value;
        },
        admin(value) {
            administrative = value;
        },
        disconnect(value) {
            offline = value;
        },
    };
}

test("the module contributes a localized, permission-aware play through the public host contract", async () => {
    const state = fixture();
    const dispose = await mountProvider(state.ctx);
    assert.equal(typeof dispose, "function");
    assert.ok(state.published.has(`${manifest.id}:tutorials`));
    assert.equal(state.play.version, 1);
    assert.equal(
        state.play.page({
            pathname: `/administration/modules/${manifest.uuid}`,
        }),
        true,
    );
    assert.equal(
        state.play.page({ pathname: "/administration/modules" }),
        false,
    );
    assert.ok(state.play.steps.length >= 1);
    assert.equal(
        new Set(state.play.steps.map((step) => step.target)).size,
        state.play.steps.length,
    );
    assert.equal(state.play.available(), true);
    for (const step of state.play.steps) {
        assert.ok(step.effects.arrow && step.effects.spotlight, step.id);
        assert.equal(
            step.highlightNext,
            !Boolean(step.advance || step.waitFor),
            step.id,
        );
        if (step.effects.arrow || step.effects.spotlight)
            assert.ok(step.target);
    }
    const keys = [
        state.play.titleKey,
        ...state.play.steps.flatMap((step) =>
            [step.titleKey, step.bodyKey].filter(Boolean),
        ),
    ];
    for (const locale of ["en", "de", "id", "ja"]) {
        const xml = readFileSync(
            new URL(`../languages/${locale}/strings.xml`, import.meta.url),
            "utf8",
        );
        for (const key of keys) {
            const entry = xml.match(
                new RegExp(
                    'name="' +
                        key.replaceAll(".", "\\.") +
                        '">([^<]+)</string>',
                ),
            );
            assert.ok(entry?.[1].trim(), `${locale}:${key}`);
        }
    }
    state.admin(false);
    assert.equal(state.play.available(), false);
    state.admin(true);
    state.authenticate(false);
    assert.equal(state.play.available(), false);
    state.authenticate(true);
    if (manifest.id.startsWith("study-language-")) {
        for (const step of state.play.steps) await step.route();
        assert.deepEqual(
            state.routes.map((route) => route.area),
            ["overview", "explore", "flashcards"],
        );
        assert.ok(
            state.routes.every(
                (route) => route.language === manifest.id.slice(-2),
            ),
        );
    } else {
        state.disconnect(true);
        assert.equal(state.play.available(), false);
    }
    dispose();
    assert.equal(state.disposed, true);
});

test("registration failure rolls back the owner before publishing a capability", async () => {
    const state = fixture({ fail: true });
    await assert.rejects(mountProvider(state.ctx), /registration_failed/);
    assert.equal(state.disposed, true);
    assert.equal(state.published.size, 0);
});

test("an unsupported host contract is rejected before allocating an owner", async () => {
    const state = fixture();
    state.capabilities.set("ui:tutorials", { version: 2 });
    await assert.rejects(
        mountProvider(state.ctx),
        /tutorial_contract_unavailable/,
    );
});

test("Settings is an interaction-gated branch using only published module targets", async () => {
    const state = fixture();
    const dispose = await mountProvider(state.ctx);
    const [trigger, ...steps] = state.play.steps;
    const branch = new AbortController();
    const release = trigger.enter({ groupSignal: branch.signal });
    assert.equal(state.targets.at(-1), branch.signal);
    assert.equal(trigger.advance.event, "click");
    assert.equal(trigger.highlightNext, false);
    assert.deepEqual(
        steps.map((step) => step.target),
        [
            "ui.modules:field.apiKey",
            "ui.modules:field.voiceId",
            "ui.modules:field.testText",
            "ui.modules:action.voices",
            "ui.modules:action.test",
            "ui.modules:preview",
        ],
    );
    for (const step of steps) {
        assert.deepEqual(step.dependsOn, ["configuration"]);
        assert.equal(step.popup, "published-settings-surface");
        assert.equal(step.layer, "overlay");
    }
    assert.equal(steps[0].missing.action, "retry");
    for (const step of steps.slice(1))
        assert.equal(step.when({ targetAvailable: false }), false);
    assert.equal(release, undefined);
    branch.abort();
    dispose();
});
