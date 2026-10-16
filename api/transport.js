export const MAX_AUDIO_BYTES = 64 * 1024 * 1024;
const FLASH_LANGUAGES = new Set([
    "en",
    "ja",
    "zh",
    "de",
    "hi",
    "fr",
    "ko",
    "pt",
    "it",
    "es",
    "ru",
    "id",
    "nl",
    "tr",
    "fil",
    "pl",
    "sv",
    "bg",
    "ro",
    "ar",
    "cs",
    "el",
    "fi",
    "hr",
    "ms",
    "sk",
    "da",
    "ta",
    "uk",
    "hu",
    "no",
    "vi",
]);

async function bytes(response, maximum, signal) {
    if (!response.body) throw new Error("provider_unavailable");
    const reader = response.body.getReader();
    const chunks = [];
    let size = 0;
    try {
        while (true) {
            signal.throwIfAborted();
            const next = await reader.read();
            if (next.done) break;
            size += next.value.byteLength;
            if (size > maximum) throw new Error("provider_response_too_large");
            chunks.push(next.value);
        }
        return Buffer.concat(chunks);
    } finally {
        await reader.cancel();
    }
}

export class ElevenLabsTransport {
    constructor(request = fetch) {
        this.request = request;
    }

    async call(path, configuration, signal, body) {
        if (!configuration.apiKey) throw new Error("speech_not_configured");
        const deadline = AbortSignal.any([signal, AbortSignal.timeout(60_000)]);
        const response = await this.request(
            `https://api.elevenlabs.io/${path}`,
            {
                method: body ? "POST" : "GET",
                redirect: "error",
                headers: {
                    "xi-api-key": configuration.apiKey,
                    ...(body
                        ? {
                              "content-type": "application/json",
                              accept: "audio/mpeg",
                          }
                        : {}),
                },
                ...(body ? { body: JSON.stringify(body) } : {}),
                signal: deadline,
            },
        );
        const failure = !response.ok
            ? "provider_unavailable"
            : body &&
                !(response.headers.get("content-type") ?? "").startsWith(
                    "audio/mpeg",
                )
              ? "invalid_audio_response"
              : undefined;
        if (failure) {
            await response.body?.cancel().catch((cause) => {
                throw new Error(failure, { cause });
            });
            throw new Error(failure);
        }
        return bytes(
            response,
            body ? MAX_AUDIO_BYTES : 8 * 1024 * 1024,
            deadline,
        );
    }

    async voices(configuration, signal) {
        const options = [];
        let token;
        const seen = new Set();
        do {
            const query = new URLSearchParams({
                page_size: "100",
                ...(token ? { next_page_token: token } : {}),
            });
            const response = JSON.parse(
                (
                    await this.call(`v2/voices?${query}`, configuration, signal)
                ).toString("utf8"),
            );
            if (!Array.isArray(response.voices))
                throw new Error("invalid_voice_response");
            for (const voice of response.voices) {
                if (
                    !/^[a-zA-Z0-9_-]{1,128}$/.test(voice.voice_id) ||
                    typeof voice.name !== "string"
                )
                    throw new Error("invalid_voice_response");
                options.push({ value: voice.voice_id, label: voice.name });
            }
            token = response.has_more ? response.next_page_token : undefined;
            if (
                response.has_more &&
                (typeof token !== "string" || !token || seen.has(token))
            )
                throw new Error("invalid_voice_response");
            seen.add(token);
        } while (token);
        return { options };
    }

    async synthesize(input, configuration, signal) {
        if (
            !input ||
            typeof input.text !== "string" ||
            !input.text.trim() ||
            [...input.text].length > 5000
        )
            throw new Error("invalid_speech_input");
        if (
            input.language !== undefined &&
            (typeof input.language !== "string" ||
                !/^[a-z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(input.language) ||
                !FLASH_LANGUAGES.has(input.language.split("-")[0]))
        )
            throw new Error("invalid_speech_input");
        const voiceId = input.voiceId ?? configuration.voiceId;
        if (
            typeof voiceId !== "string" ||
            !/^[a-zA-Z0-9_-]{1,128}$/.test(voiceId)
        )
            throw new Error("invalid_voice_id");
        let text = input.text;
        if (input.phonemes !== undefined) {
            if (
                input.language !== "en" ||
                typeof input.phonemes !== "string" ||
                input.phonemes.length > 1000
            )
                throw new Error("invalid_speech_input");
            const escape = (value) =>
                value
                    .replaceAll("&", "&amp;")
                    .replaceAll('"', "&quot;")
                    .replaceAll("<", "&lt;")
                    .replaceAll(">", "&gt;");
            text = `<phoneme alphabet="ipa" ph="${escape(input.phonemes)}">${escape(text)}</phoneme>`;
        }
        const data = await this.call(
            `v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`,
            configuration,
            signal,
            {
                text,
                model_id: input.phonemes
                    ? "eleven_turbo_v2"
                    : input.language
                      ? "eleven_flash_v2_5"
                      : "eleven_multilingual_v2",
                ...(input.language && !input.phonemes
                    ? { language_code: input.language.split("-")[0] }
                    : {}),
                voice_settings: {
                    stability: 0.65,
                    similarity_boost: 0.75,
                    speed: 0.9,
                },
            },
        );
        if (
            data.length < 3 ||
            !(
                data.subarray(0, 3).toString() === "ID3" ||
                (data[0] === 0xff && (data[1] & 0xe0) === 0xe0)
            )
        )
            throw new Error("invalid_audio_response");
        return { mediaType: "audio/mpeg", data: new Uint8Array(data) };
    }
}
