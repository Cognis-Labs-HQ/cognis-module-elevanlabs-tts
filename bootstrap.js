import { registerApi } from "./api/index.js";
import { ShowcaseStore } from "./api/store.js";
import { registerUi } from "./api/ui.js";

export async function uninstallModule(ctx, { deleteContent }) {
    if (!deleteContent) return;

    const store = new ShowcaseStore(ctx.getCapability("db:executor"));
    await store.ensureSchema();
    await store.deleteAllData();
    ctx.log?.("info", "Module template saved data deleted.", {
        component: "module-template",
        operation: "uninstall_cleanup",
        deleteContent,
    });
}

export function bootstrapModule(ctx) {
    registerUi(ctx);
    const service = registerApi(ctx.router, ctx);

    ctx.contributePublicCapability(
        "module-template:listItems",
        service.listItems,
    );

    ctx.log?.("info", "Module template enabled.", {
        component: "module-template",
        operation: "bootstrap",
    });
}
