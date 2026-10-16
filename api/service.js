import { Configuration } from "./config.js";
import { ElevenLabsTransport } from "./transport.js";

export async function createService(ctx, request) {
    const configuration = new Configuration(ctx.getCapability("db:executor"));
    await configuration.load();
    const transport = new ElevenLabsTransport(request);
    const controller = new AbortController();
    ctx.registerDisposer(() => controller.abort());
    const operations = {
        readConfiguration: () => configuration.publicValue(),
        saveConfiguration: (input) => configuration.save(input),
        clearConfiguration: () => configuration.clear(),
        discoverVoices: (input, signal) =>
            transport.voices(configuration.preview(input), signal),
        testSpeech: (input, signal) => {
            const value = configuration.preview(input);
            return transport.synthesize(
                {
                    text: value.testText,
                    ...(value.voiceId ? { voiceId: value.voiceId } : {}),
                },
                value,
                signal,
            );
        },
        synthesize: (input, signal) =>
            transport.synthesize(input, configuration.value, signal),
    };
    const service = {
        get revision() {
            return configuration.value.revision ?? "unconfigured";
        },
    };
    for (const [action, operation] of Object.entries(operations)) {
        const id = `elevenlabs-tts:${action}`;
        ctx.registerFlow({ id, stages: ["validate", "execute"] });
        ctx.flow.extend(
            id,
            "validate",
            { id: `${id}:validate` },
            ({ input }) => {
                controller.signal.throwIfAborted();
                input.signal?.throwIfAborted();
            },
        );
        ctx.flow.extend(
            id,
            "execute",
            { id: `${id}:execute` },
            async ({ input, data }) => {
                const signal = input.signal
                    ? AbortSignal.any([controller.signal, input.signal])
                    : controller.signal;
                data.result = await operation(input.value, signal);
                if (action !== "readConfiguration")
                    ctx.log?.("info", "ElevenLabs operation completed.", {
                        component: "elevenlabs-tts",
                        operation: action,
                    });
            },
        );
        service[action] = async (value, signal) => {
            try {
                return (await ctx.flow.run(id, { value, signal })).data.result;
            } catch (error) {
                ctx.log?.("error", "ElevenLabs operation failed.", {
                    component: "elevenlabs-tts",
                    operation: action,
                    errorName: error instanceof Error ? error.name : "Error",
                });
                throw error;
            }
        };
    }
    return service;
}
