import assert from "node:assert/strict";
import test from "node:test";
import { ElevenLabsTransport, MAX_AUDIO_BYTES } from "../transport.js";
import { Configuration } from "../config.js";
import { createService } from "../service.js";
import { bootstrapModule, uninstallModule } from "../../bootstrap.js";
import { registerDisabledApiRoutes } from "../routes/config/index.js";
import { createFlowRuntime } from "./runtime.js";
import { Readable } from "node:stream";

function fixture(request) {
    const runtime = createFlowRuntime();
    let stored;
    const database = {
        async ensureTable() {},
        async executeCommand(command) {
            if (command.option === "SELECT")
                return { rows: stored ? [{ value: stored }] : [] };
            if (command.option === "INSERT") stored = command.values.value;
            if (command.option === "DELETE") stored = undefined;
            return { rows: [] };
        },
    };
    const disposers = [];
    const routes = new Map();
    const capabilities = new Map();
    const logs = [];
    const ctx = {
        ...runtime,
        moduleRoot: process.cwd(),
        getCapability(id) {
            assert.equal(id, "db:executor");
            return database;
        },
        registerDisposer(disposer) {
            disposers.push(disposer);
        },
        registerStaticDir() {},
        contributePublicCapability(id, capability) {
            capabilities.set(id, capability);
        },
        log(...args) {
            logs.push(args);
        },
    };
    for (const method of ["Get", "Put", "Delete", "Post"])
        ctx[`registerApi${method}`] = (path, handler, options) =>
            routes.set(`${method}:${path}`, { handler, options });
    return {
        ctx,
        request,
        routes,
        capabilities,
        logs,
        disposers,
        database,
        storedValue: () => stored,
    };
}

const audioBytes = new Uint8Array([73, 68, 51, 1, 2, 3]);
const audioResponse = () =>
    new Response(audioBytes, { headers: { "content-type": "audio/mpeg" } });

test("speech uses the default voice, honors an override and preserves English IPA", async () => {
    const calls = [];
    const transport = new ElevenLabsTransport(async (url, options) => {
        calls.push({ url, options });
        return audioResponse();
    });
    const configuration = { apiKey: "secret-fixture", voiceId: "defaultVoice" };
    const signal = new AbortController().signal;
    await transport.synthesize(
        { text: "犬", language: "ja" },
        configuration,
        signal,
    );
    assert.match(calls[0].url, /defaultVoice\?/);
    assert.equal(JSON.parse(calls[0].options.body).text, "犬");
    assert.equal(
        JSON.parse(calls[0].options.body).model_id,
        "eleven_flash_v2_5",
    );
    assert.equal(JSON.parse(calls[0].options.body).language_code, "ja");
    assert.equal(calls[0].options.headers["xi-api-key"], configuration.apiKey);
    await transport.synthesize(
        {
            text: "read",
            language: "en",
            voiceId: "otherVoice",
            phonemes: "ɹiːd",
        },
        configuration,
        signal,
    );
    assert.match(calls[1].url, /otherVoice\?/);
    assert.match(
        JSON.parse(calls[1].options.body).text,
        /alphabet="ipa" ph="ɹiːd"/,
    );
    assert.equal(JSON.parse(calls[1].options.body).model_id, "eleven_turbo_v2");
    for (const input of [
        { text: "" },
        { text: "test", voiceId: "../../bad" },
        { text: "x".repeat(5001) },
        { text: "test", language: "zz" },
        { text: "test", language: "eng" },
    ])
        await assert.rejects(
            transport.synthesize(input, configuration, signal),
            /invalid_/,
        );
    assert.equal(calls.length, 2);
});

test("voice discovery follows provider pagination and rejects cycles", async () => {
    let calls = 0;
    const transport = new ElevenLabsTransport(
        async () =>
            new Response(
                JSON.stringify(
                    ++calls === 1
                        ? {
                              voices: [{ voice_id: "one", name: "One" }],
                              has_more: true,
                              next_page_token: "next",
                          }
                        : {
                              voices: [{ voice_id: "two", name: "Two" }],
                              has_more: false,
                          },
                ),
            ),
    );
    const signal = new AbortController().signal;
    assert.deepEqual(
        (await transport.voices({ apiKey: "fixture" }, signal)).options.map(
            ({ value }) => value,
        ),
        ["one", "two"],
    );
    const cycling = new ElevenLabsTransport(
        async () =>
            new Response(
                JSON.stringify({
                    voices: [],
                    has_more: true,
                    next_page_token: "same",
                }),
            ),
    );
    await assert.rejects(
        cycling.voices({ apiKey: "fixture" }, signal),
        /invalid_voice_response/,
    );
});

test("configuration preserves concealed keys across edits and survives restart", async () => {
    const { database } = fixture();
    const configuration = new Configuration(database);
    await configuration.load();
    await configuration.save({ apiKey: "secret-fixture", voiceId: "voiceOne" });
    const revision = configuration.value.revision;
    await configuration.save({ apiKey: "", voiceId: "voiceTwo" });
    assert.equal(configuration.value.apiKey, "secret-fixture");
    assert.notEqual(configuration.value.revision, revision);
    assert.deepEqual(configuration.publicValue(), {
        apiKeyConfigured: true,
        voiceId: "voiceTwo",
        testText: "",
    });
    const restarted = new Configuration(database);
    await restarted.load();
    assert.equal(restarted.value.apiKey, "secret-fixture");
    await restarted.clear();
    await configuration.load();
    assert.deepEqual(configuration.publicValue(), {
        apiKeyConfigured: false,
        voiceId: "",
        testText: "",
    });
});

test("configuration routes require administrators and disabled configuration publishes no synthesis capability", async () => {
    const { ctx, routes, capabilities } = fixture();
    await registerDisabledApiRoutes(ctx);
    assert.equal(routes.size, 5);
    for (const { options } of routes.values())
        assert.deepEqual(options, {
            access: { minRole: "admin" },
            allowWhenDisabled: true,
        });
    assert.equal(capabilities.size, 0);
    assert.equal(ctx.flow.exists("elevenlabs-tts:synthesize"), false);
    await assert.rejects(
        ctx.flow.run("elevenlabs-tts:synthesize", { value: { text: "test" } }),
        /unknown_flow/,
    );
    let payload;
    await routes.get("Put:/api/v1/modules/elevenlabs-tts/config").handler(
        Readable.from([
            JSON.stringify({
                apiKey: "secret-fixture",
                voiceId: "voiceOne",
            }),
        ]),
        {
            writeHead(status) {
                assert.equal(status, 200);
            },
            end(value) {
                payload = JSON.parse(value);
            },
        },
    );
    assert.equal(payload.data.apiKeyConfigured, true);
    assert.equal(JSON.stringify(payload).includes("secret-fixture"), false);
});

test("real registered ctx stages produce audio, log safe failures, and abort on teardown", async () => {
    const { ctx, disposers, logs } = fixture();
    const service = await createService(ctx, async () => audioResponse());
    await service.saveConfiguration({
        apiKey: "secret-fixture",
        voiceId: "voiceOne",
        testText: "Hello.",
    });
    const recording = await service.synthesize({ text: "test" });
    assert.deepEqual(recording.data, audioBytes);
    await assert.rejects(
        service.synthesize({ text: "" }),
        /invalid_speech_input/,
    );
    assert.ok(logs.some(([level]) => level === "error"));
    assert.equal(JSON.stringify(logs).includes("secret-fixture"), false);
    for (const dispose of disposers) dispose();
    await assert.rejects(service.synthesize({ text: "test" }), /abort/i);
});

test("bootstrap publishes only the neutral speech contract and uninstall respects retained content", async () => {
    const { ctx, capabilities, database } = fixture();
    await bootstrapModule(ctx);
    assert.equal(
        typeof capabilities.get("speech:synthesis").synthesize,
        "function",
    );
    const configuration = new Configuration(database);
    await configuration.load();
    await configuration.save({ apiKey: "secret-fixture", voiceId: "voiceOne" });
    await uninstallModule(ctx, { deleteContent: false });
    await configuration.load();
    assert.equal(configuration.value.voiceId, "voiceOne");
    await uninstallModule(ctx, { deleteContent: true });
    await configuration.load();
    assert.deepEqual(configuration.value, {});
});

test("provider responses are bounded and malformed audio never reaches callers", async () => {
    const configuration = { apiKey: "test-key", voiceId: "voice" };
    const signal = new AbortController().signal;
    const tooLarge = new ElevenLabsTransport(
        async () =>
            new Response(new Uint8Array(MAX_AUDIO_BYTES + 1), {
                headers: { "content-type": "audio/mpeg" },
            }),
    );
    await assert.rejects(
        tooLarge.synthesize({ text: "hello" }, configuration, signal),
        /provider_response_too_large/,
    );
    const malformed = new ElevenLabsTransport(
        async () =>
            new Response("not audio", {
                headers: { "content-type": "audio/mpeg" },
            }),
    );
    await assert.rejects(
        malformed.synthesize({ text: "hello" }, configuration, signal),
        /invalid_audio_response/,
    );
    const denied = new ElevenLabsTransport(
        async () => new Response("secret provider detail", { status: 401 }),
    );
    await assert.rejects(
        denied.voices(configuration, signal),
        /provider_unavailable/,
    );
});

test("test output uses unsaved settings and never changes the saved default", async () => {
    const requests = [];
    const context = fixture();
    const service = await createService(context.ctx, async (url, options) => {
        requests.push({ url, options });
        return new Response("ID3audio", {
            headers: { "content-type": "audio/mpeg" },
        });
    });
    await service.saveConfiguration({
        apiKey: "saved-key",
        voiceId: "saved-voice",
    });
    const audio = await service.testSpeech({
        apiKey: "preview-key",
        voiceId: "preview-voice",
        testText: "Hello preview",
    });
    assert.equal(audio.mediaType, "audio/mpeg");
    assert.match(requests[0].url, /preview-voice/);
    assert.equal(requests[0].options.headers["xi-api-key"], "preview-key");
    assert.equal(JSON.parse(requests[0].options.body).text, "Hello preview");
    assert.equal((await service.readConfiguration()).voiceId, "saved-voice");
    assert.equal(JSON.stringify(context.logs).includes("preview-key"), false);
});

test("configuration boundary reports malformed and oversized input safely", async () => {
    const { ctx, routes, logs } = fixture();
    await registerDisabledApiRoutes(ctx);
    const handler = routes.get(
        "Put:/api/v1/modules/elevenlabs-tts/config",
    ).handler;
    for (const [body, expected] of [
        ["{secret-fixture", 400],
        ["x".repeat(16_385), 413],
    ]) {
        let status;
        let payload;
        await handler(Readable.from([body]), {
            writeHead(value, headers) {
                status = value;
                assert.equal(headers["cache-control"], "no-store");
            },
            end(value) {
                payload = JSON.parse(value);
            },
        });
        assert.equal(status, expected);
        assert.equal(
            payload.error.code,
            expected === 413 ? "request_too_large" : "invalid_configuration",
        );
    }
    assert.equal(logs.filter(([level]) => level === "error").length, 2);
    assert.equal(JSON.stringify(logs).includes("secret-fixture"), false);
});

test("provider corruption is a gateway failure rather than invalid administrator input", async () => {
    const { ctx, routes } = fixture();
    const { registerConfigurationRoutes } =
        await import("../routes/config/index.js");
    registerConfigurationRoutes(ctx, {
        discoverVoices: async () => {
            throw new Error("invalid_voice_response");
        },
    });
    let status;
    let payload;
    await routes
        .get("Post:/api/v1/modules/elevenlabs-tts/config/voices")
        .handler(Readable.from(["{}"]), {
            writeHead(value) {
                status = value;
            },
            end(value) {
                payload = JSON.parse(value);
            },
        });
    assert.equal(status, 502);
    assert.equal(payload.error.code, "speech_unavailable");
});

test("configuration rejects incomplete merged settings without modifying persistence", async () => {
    const context = fixture();
    const configuration = new Configuration(context.database);
    await configuration.load();
    for (const input of [
        {},
        { apiKey: "", voiceId: "" },
        { apiKey: "key" },
        { voiceId: "voice" },
        { apiKey: "****", voiceId: "voice" },
    ]) {
        await assert.rejects(
            configuration.save(input),
            /invalid_configuration/,
        );
        assert.equal(context.storedValue(), undefined);
    }
    await configuration.save({ apiKey: "saved-key", voiceId: "saved-voice" });
    const before = context.storedValue();
    await assert.rejects(
        configuration.save({ voiceId: "" }),
        /invalid_configuration/,
    );
    assert.equal(context.storedValue(), before);
    await configuration.save({ apiKey: "****", voiceId: "new-voice" });
    assert.equal(configuration.value.apiKey, "saved-key");
    assert.equal(configuration.value.voiceId, "new-voice");
});

test("preview phrases remain transient and legacy stored phrases are removed on load", async () => {
    const context = fixture();
    const service = await createService(context.ctx, async () =>
        audioResponse(),
    );
    await service.saveConfiguration({
        apiKey: "key",
        voiceId: "voice",
        testText: "private saved phrase",
    });
    assert.equal(context.storedValue().includes("private saved phrase"), false);
    const before = context.storedValue();
    await service.testSpeech({ testText: "private preview phrase" });
    assert.equal(context.storedValue(), before);
    assert.equal((await service.readConfiguration()).testText, "");
    assert.equal(
        JSON.stringify(context.logs).includes("private preview phrase"),
        false,
    );
    await context.database.executeCommand({
        option: "INSERT",
        values: {
            value: JSON.stringify({
                apiKey: "key",
                voiceId: "voice",
                testText: "old private phrase",
            }),
        },
    });
    const restarted = new Configuration(context.database);
    await restarted.load();
    assert.equal(Object.hasOwn(restarted.value, "testText"), false);
    assert.equal(context.storedValue().includes("old private phrase"), false);
    assert.equal(restarted.value.apiKey, "key");
});

test("long supported input can return more than the former 5 MiB audio cap", async () => {
    const data = new Uint8Array(6 * 1024 * 1024);
    data.set(audioBytes);
    const transport = new ElevenLabsTransport(async (_url, request) => {
        assert.equal(JSON.parse(request.body).text.length, 5000);
        return new Response(data, {
            headers: { "content-type": "audio/mpeg" },
        });
    });
    const result = await transport.synthesize(
        { text: "あ".repeat(5000), language: "ja" },
        { apiKey: "key", voiceId: "voice" },
        new AbortController().signal,
    );
    assert.equal(result.data.length, data.length);
});

test("rejected provider responses cancel their body before returning a stable error", async () => {
    for (const [status, mediaType, error] of [
        [401, "text/plain", "provider_unavailable"],
        [429, "application/json", "provider_unavailable"],
        [500, "text/plain", "provider_unavailable"],
        [200, "text/html", "invalid_audio_response"],
    ]) {
        let cancellations = 0;
        const transport = new ElevenLabsTransport(
            async () =>
                new Response(
                    new ReadableStream({
                        cancel() {
                            cancellations++;
                        },
                    }),
                    { status, headers: { "content-type": mediaType } },
                ),
        );
        await assert.rejects(
            transport.synthesize(
                { text: "test" },
                { apiKey: "key", voiceId: "voice" },
                new AbortController().signal,
            ),
            new RegExp(error),
        );
        assert.equal(cancellations, 1);
    }
});

test("explicit language tags use the enforcing model and omitted language uses detection", async () => {
    const configuration = { apiKey: "key", voiceId: "voice" };
    let body;
    const transport = new ElevenLabsTransport(async (_url, options) => {
        body = JSON.parse(options.body);
        return audioResponse();
    });
    for (const language of ["en", "ja-JP", "de", "fil"]) {
        await transport.synthesize(
            { text: "example", language },
            configuration,
            new AbortController().signal,
        );
        assert.equal(body.model_id, "eleven_flash_v2_5");
        assert.equal(body.language_code, language.split("-")[0]);
    }
    await transport.synthesize(
        { text: "example" },
        configuration,
        new AbortController().signal,
    );
    assert.equal(body.model_id, "eleven_multilingual_v2");
    assert.equal(Object.hasOwn(body, "language_code"), false);
});
