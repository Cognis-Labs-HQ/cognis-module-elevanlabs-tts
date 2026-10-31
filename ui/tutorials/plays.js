export const definition = {
    version: 1,
    id: "introduction",
    titleKey: "module.elevenlabs-tts.tutorial.title",
    steps: [
        {
            id: "welcome",
            titleKey: "module.elevenlabs-tts.tutorial.welcome.title",
            bodyKey: "module.elevenlabs-tts.tutorial.welcome.body",
            effects: {
                callout: true,
                arrow: false,
                spotlight: false,
            },
            missing: {
                timeoutMs: 5000,
                action: "retry",
            },
            route: "/administration/modules",
        },
        {
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
