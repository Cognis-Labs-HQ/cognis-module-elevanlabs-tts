import { createService } from "../../service.js";
import { readJson, sendJson } from "./http.js";

export function registerConfigurationRoutes(ctx, service) {
    const base = "/api/v1/modules/elevenlabs-tts/config";
    const options = { access: { minRole: "admin" }, allowWhenDisabled: true };
    for (const [method, action] of [
        ["Get", "readConfiguration"],
        ["Put", "saveConfiguration"],
        ["Delete", "clearConfiguration"],
        ["Post", "discoverVoices"],
        ["Post", "testSpeech"],
    ]) {
        const path =
            action === "discoverVoices"
                ? `${base}/voices`
                : action === "testSpeech"
                  ? `${base}/test`
                  : base;
        ctx[`registerApi${method}`](
            path,
            async (request, response) => {
                try {
                    const input = ["Put", "Post"].includes(method)
                        ? await readJson(request)
                        : undefined;
                    const result = await service[action](input);
                    if (action === "testSpeech") {
                        response.writeHead(200, {
                            "content-type": result.mediaType,
                            "cache-control": "no-store",
                            "x-content-type-options": "nosniff",
                        });
                        response.end(Buffer.from(result.data));
                    } else sendJson(response, 200, { data: result ?? null });
                } catch (error) {
                    const code = error instanceof Error ? error.message : "";
                    const invalid = [
                        "invalid_configuration",
                        "invalid_voice_id",
                        "invalid_speech_input",
                        "invalid_json",
                    ].includes(code);
                    const tooLarge = code === "request_too_large";
                    ctx.log?.(
                        "error",
                        "ElevenLabs configuration request failed.",
                        {
                            component: "elevenlabs-tts",
                            operation: action,
                            errorName:
                                error instanceof Error ? error.name : "Error",
                        },
                    );
                    sendJson(response, tooLarge ? 413 : invalid ? 400 : 502, {
                        error: {
                            code: tooLarge
                                ? "request_too_large"
                                : invalid
                                  ? "invalid_configuration"
                                  : "speech_unavailable",
                        },
                    });
                }
            },
            options,
        );
    }
}

export async function registerDisabledApiRoutes(ctx) {
    const service = await createService(ctx);
    registerConfigurationRoutes(ctx, service);
}
