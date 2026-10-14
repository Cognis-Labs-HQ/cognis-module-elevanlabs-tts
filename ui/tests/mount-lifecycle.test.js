import test from "node:test";
import assert from "node:assert/strict";

let translationWait;
let markupWait;
let composerWait;
const events = [];
const modules = {
    "api-client.js": {
        apiFetch: async () => {
            if (markupWait) await markupWait;
            return new Response("<p>{{module.module_template.title}}</p>");
        },
    },
    "i18n.js": {
        createI18n: async () => {
            if (translationWait) await translationWait;
            return { t: (key) => key };
        },
    },
    "escape-html.js": { escapeHtml: String },
    "page-entry.js": { async mountWhenDirect() {} },
    "page-composer/index.js": {
        createPageComposer: () => {
            events.push("composer");
            return {
                init: async () => {
                    if (composerWait) await composerWait;
                },
                destroy: () => events.push("destroy"),
            };
        },
    },
};
globalThis[Symbol.for("cognis.uiCtx")] = {
    capabilities: {
        get: (id) =>
            id === "ui:reuse"
                ? { importModule: async (path) => modules[path] }
                : () => assert.fail("No feedback expected"),
    },
};
const { mount } = await import("../app.js");

for (const phase of ["translations", "markup", "composer"]) {
    test(`template mount cancels pending ${phase} work without leaking resources`, async () => {
        events.length = 0;
        let release;
        const pending = new Promise((resolve) => {
            release = resolve;
        });
        translationWait = phase === "translations" ? pending : null;
        markupWait = phase === "markup" ? pending : null;
        composerWait = phase === "composer" ? pending : null;
        const controller = new AbortController();
        const operation = mount(
            { addEventListener() {} },
            { signal: controller.signal },
        );
        await new Promise((resolve) => setImmediate(resolve));
        controller.abort();
        release();
        await operation;
        assert.equal(
            events.filter((event) => event === "composer").length,
            phase === "composer" ? 1 : 0,
        );
        assert.equal(
            events.filter((event) => event === "destroy").length,
            phase === "composer" ? 1 : 0,
        );
    });
}

test("an already-cancelled template mount does not disturb an active root", async () => {
    const controller = new AbortController();
    controller.abort();
    const before = events.length;
    await mount(
        { addEventListener: () => assert.fail("Cancelled mount") },
        { signal: controller.signal },
    );
    assert.equal(events.length, before);
});
