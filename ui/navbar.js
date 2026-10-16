import { importReuseModule } from "./reuse/resources.js";

export async function mountProvider(ctx) {
    const { createI18n } = await importReuseModule("i18n.js");
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/module-template/languages"],
    });
    const navbar = ctx.capabilities.get("ui:navbarLinks");
    if (!navbar)
        throw new Error("Required UI capability unavailable: ui:navbarLinks");
    return navbar.contribute("module-template:showcase", {
        label: i18n.t("module.module_template.nav"),
        href: "/showcase",
    });
}
