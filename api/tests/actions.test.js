import assert from "node:assert/strict";
import test from "node:test";
import { Readable } from "node:stream";
import { registerApi } from "../index.js";
import { createFlowRuntime } from "./flow-runtime-fake.js";

test("authenticated API actions execute the registered stages and preserve account ownership", async () => {
    const runtime = createFlowRuntime();
    const handlers = new Map();
    const commands = [];
    const ctx = {
        ...runtime,
        getCapability(name) {
            if (name === "auth:requireAuth")
                return () => ({ sub: "account-1" });
            if (name === "db:executor")
                return {
                    async ensureTable() {},
                    async executeCommand(command) {
                        commands.push(command);
                        return { rows: [] };
                    },
                };
        },
    };
    const service = registerApi(
        {
            get(path, handler) {
                handlers.set("get", handler);
            },
            post(path, handler) {
                handlers.set("post", handler);
            },
        },
        ctx,
    );
    const response = () => ({
        writeHead(status) {
            this.status = status;
        },
        end(body) {
            this.body = JSON.parse(body);
        },
    });
    const created = response();
    await handlers.get("post")(Readable.from(['{"title":"Example"}']), created);
    assert.equal(created.status, 201);
    assert.equal(commands[0].values.owner_id, "account-1");
    await service.listItems("account-1");
    assert.deepEqual(runtime.executions, [
        "module-template:createItems:validate",
        "module-template:createItems:execute",
        "module-template:createItems:present",
        "module-template:listItems:validate",
        "module-template:listItems:execute",
        "module-template:listItems:present",
    ]);
    const rejected = response();
    await handlers.get("post")(Readable.from(['{"title":""}']), rejected);
    assert.equal(rejected.status, 400);
    assert.equal(commands.length, 2);
    const invalidBody = response();
    await handlers.get("post")(Readable.from(["null"]), invalidBody);
    assert.equal(invalidBody.status, 400);
    assert.equal(commands.length, 2);
});
