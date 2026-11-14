export const definition = {
    version: 1,
    page: ({ pathname }) =>
        pathname ===
        "/administration/modules/2b71bcdf-e29c-408b-8d12-ead6e377c82e",
    id: "introduction",
    titleKey: "module.elevenlabs.tts.tutorial.title",
    steps: [
        {
            highlightNext: false,
            id: "configuration",
            target: "settings",
            interaction: "target",
            advance: { event: "click", accept: () => true },
            titleKey: "module.elevenlabs.tts.tutorial.configuration.title",
            bodyKey: "module.elevenlabs.tts.tutorial.configuration.body",
        },
        ...[
            ["api-key", "apiKey"],
            ["default-voice", "voiceId"],
            ["test-text", "testText"],
            ["discover-voices", "voices"],
            ["test-audio", "test"],
            ["listen", "preview"],
        ].map(([id, target]) => ({
            id,
            target,
            highlightNext: true,
            interaction: "target",
            dependsOn: ["configuration"],
            layer: "overlay",
            ...(id === "api-key"
                ? { missing: { timeoutMs: 10000, action: "retry" } }
                : { when: ({ targetAvailable }) => targetAvailable }),
            titleKey: `module.elevenlabs.tts.tutorial.${id.replaceAll("-", ".")}.title`,
            bodyKey: `module.elevenlabs.tts.tutorial.${id.replaceAll("-", ".")}.body`,
        })),
    ].map((step) => ({
        missing: { timeoutMs: 5000, action: "skip" },
        ...step,
        group: "settings",
        effects: { callout: true, arrow: true, spotlight: true },
    })),
};
