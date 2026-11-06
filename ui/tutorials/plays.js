export const definition = {
    version: 1,
    page: "/administration/modules",
    id: "introduction",
    titleKey: "module.elevenlabs-tts.tutorial.title",
    steps: [
        {
            highlightNext: true,
            id: "welcome",
            target: "card",
            titleKey: "module.elevenlabs-tts.tutorial.welcome.title",
            bodyKey: "module.elevenlabs-tts.tutorial.welcome.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            route: "/administration/modules",
        },
        {
            highlightNext: true,
            id: "configuration",
            titleKey: "module.elevenlabs-tts.tutorial.configuration.title",
            bodyKey: "module.elevenlabs-tts.tutorial.configuration.body",
            effects: {
                callout: true,
                arrow: true,
                spotlight: true,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            target: "card",
        },
    ],
};
