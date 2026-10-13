export function registerCommands({ register, apiGet, apiPost }) {
    register(
        "modules:module-template:list",
        async ({ apiBaseUrl, getApiToken }) =>
            apiGet(
                apiBaseUrl,
                "/api/v1/modules/module-template/items",
                await getApiToken(),
            ),
        {
            usage: "cognisctl modules:module-template:list",
            description: "List your module-template showcase items.",
        },
    );
    register(
        "modules:module-template:create",
        async ({ args, apiBaseUrl, getApiToken }) => {
            const title = args.join(" ").trim();
            if (!title)
                throw new Error(
                    "Usage: cognisctl modules:module-template:create <title>",
                );
            return apiPost(
                apiBaseUrl,
                "/api/v1/modules/module-template/items",
                await getApiToken(),
                { title },
            );
        },
        {
            usage: "cognisctl modules:module-template:create <title>",
            description: "Create a showcase item.",
        },
    );
}
