import { ShowcaseStore } from "./store.js";
import { registerItemRoutes } from "./routes/items/index.js";

export function registerApi(router, ctx) {
    const database = ctx.getCapability("db:executor");
    const requireAuth = ctx.getCapability("auth:requireAuth");
    if (!database || typeof requireAuth !== "function")
        throw new Error(
            "Module template requires db:executor and auth:requireAuth.",
        );
    const store = new ShowcaseStore(database);
    const operations = {
        list: (input) => store.list(input.ownerId),
        create: (input) => store.create(input.ownerId, input.title),
    };
    for (const [action, execute] of Object.entries(operations)) {
        const flowId = `module-template:${action}Items`;
        ctx.registerFlow({
            id: flowId,
            stages: ["validate", "execute", "present"],
        });
        ctx.flow.extend(
            flowId,
            "validate",
            { id: `${flowId}.validate` },
            ({ input }) => {
                if (!input.ownerId) throw new Error("invalid_owner");
                if (
                    action === "create" &&
                    (!input.title || input.title.length > 120)
                )
                    throw new Error("invalid_title");
            },
        );
        ctx.flow.extend(
            flowId,
            "execute",
            { id: `${flowId}.execute` },
            async (stage) => {
                await store.ensureSchema();
                stage.data.result = await execute(stage.input);
            },
        );
        ctx.flow.extend(
            flowId,
            "present",
            { id: `${flowId}.present` },
            (stage) => stage.data.result,
        );
    }
    const run = async (action, input) =>
        (await ctx.flow.run(`module-template:${action}Items`, input)).data
            .result;
    const service = {
        listItems: (ownerId) => run("list", { ownerId }),
        createItem: (ownerId, title) => run("create", { ownerId, title }),
    };
    registerItemRoutes(router, { requireAuth, service, log: ctx.log });
    return service;
}
