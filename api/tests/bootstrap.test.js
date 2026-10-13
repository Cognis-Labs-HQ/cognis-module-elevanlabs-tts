import assert from "node:assert/strict";
import test from "node:test";
import { bootstrapModule, uninstallModule } from "../../bootstrap.js";

function createContext(registrations) {
    return {
        moduleRoot: process.cwd(),
        router: {
            get(path) {
                registrations.routes.push(path);
            },
            post(path) {
                registrations.routes.push(path);
            },
        },
        getCapability(name) {
            if (name === "auth:requireAuth") return () => ({ role: "user" });
            if (name === "db:executor") {
                return {
                    ensureTable() {},
                    executeCommand() {
                        return { rows: [] };
                    },
                };
            }
            assert.fail(`Unexpected capability: ${name}`);
        },
        registerStaticDir() {},
        registerSpaRoute(route) {
            registrations.routes.push(route.base);
        },
        registerNavbarPlugin() {},
        contributePublicCapability(name, value) {
            registrations.capabilities.push([name, value]);
        },
        registerFlow(flow) {
            registrations.flows.push(flow);
        },
        flow: {
            exists() {
                return false;
            },
            extend(...args) {
                registrations.extensions.push(args);
            },
        },
        log() {},
    };
}

test("registers template surfaces through ctx", () => {
    const registrations = {
        routes: [],
        capabilities: [],
        extensions: [],
        flows: [],
    };
    bootstrapModule(createContext(registrations));

    assert.ok(registrations.routes.includes("/showcase"));
    assert.equal(registrations.capabilities[0][0], "module-template:listItems");
    assert.equal(registrations.flows[0].id, "module-template:listItems");
    assert.equal(registrations.extensions[0][0], "module-template:listItems");
});

test("uninstall deletes saved content only when requested", async () => {
    const commands = [];
    const logs = [];
    const ctx = {
        getCapability(name) {
            assert.equal(name, "db:executor");
            return {
                async ensureTable(definition) {
                    commands.push({ option: "ENSURE", table: definition.name });
                },
                async executeCommand(command) {
                    commands.push(command);
                    return { rows: [] };
                },
            };
        },
        log(level, message, metadata) {
            logs.push({ level, message, metadata });
        },
    };

    await uninstallModule(ctx, { deleteContent: false });
    assert.deepEqual(commands, []);

    await uninstallModule(ctx, { deleteContent: true });
    assert.deepEqual(commands, [
        { option: "ENSURE", table: "module_template_items" },
        { option: "DELETE", table: "module_template_items" },
    ]);
    assert.equal(logs[0].level, "info");
    assert.equal(logs[0].metadata.operation, "uninstall_cleanup");
});
