import { createService } from "../../service.js";
import { readJson, sendJson } from "../../reuse/http.js";

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
                    const invalid = /^(invalid_|request_too_large)/.test(
                        error.message,
                    );
                    sendJson(response, invalid ? 400 : 502, {
                        error: {
                            code: invalid
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
