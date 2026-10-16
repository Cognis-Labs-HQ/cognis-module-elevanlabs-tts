import assert from "node:assert/strict";
import test from "node:test";
import { registerCommands } from "../index.js";

test("voice discovery command calls the authenticated public configuration route", async () => {
    let command;
    let request;
    registerCommands({
        register: (name, handler, options) => {
            command = { name, handler, options };
        },
        apiPost: async (...args) => {
            request = args;
            return { data: { options: [{ value: "voice", label: "Voice" }] } };
        },
    });
    assert.equal(command.name, "modules:elevenlabs-tts:voices");
    assert.equal(command.options.usage, `cognisctl ${command.name}`);
    const result = await command.handler({
        args: [],
        apiBaseUrl: "http://localhost",
        getApiToken: async () => "admin-token",
    });
    assert.deepEqual(request, [
        "http://localhost",
        "/api/v1/modules/elevenlabs-tts/config/voices",
        {},
        "admin-token",
    ]);
    assert.equal(result.data.options[0].value, "voice");
    request = undefined;
    await assert.rejects(
        command.handler({
            args: ["unexpected"],
            getApiToken: async () => {
                throw new Error("must not authenticate");
            },
        }),
        /cognisctl modules:elevenlabs-tts:voices/,
    );
    assert.equal(request, undefined);
});
