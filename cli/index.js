export function registerCommands({ register, apiPost }) {
    const usage = "cognisctl modules:elevenlabs-tts:voices";
    register(
        "modules:elevenlabs-tts:voices",
        async ({ args, apiBaseUrl, getApiToken }) => {
            if (args.length) throw new Error(usage);
            return apiPost(
                apiBaseUrl,
                "/api/v1/modules/elevenlabs-tts/config/voices",
                {},
                await getApiToken(),
            );
        },
        {
            usage,
            description:
                "Discover ElevenLabs voices using saved configuration.",
        },
    );
}
