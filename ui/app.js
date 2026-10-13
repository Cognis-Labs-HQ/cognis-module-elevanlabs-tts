import { uiCtx, importReuseModule } from "./reuse/resources.js";

const [
    { apiFetch },
    { createI18n },
    { createPageComposer },
    { escapeHtml },
    { mountWhenDirect },
] = await Promise.all([
    importReuseModule("api-client.js"),
    importReuseModule("i18n.js"),
    importReuseModule("page-composer/index.js"),
    importReuseModule("escape-html.js"),
    importReuseModule("page-entry.js"),
]);
const API_PATH = "/api/v1/modules/module-template/items";
const controllers = new WeakMap();

export function unmount(root) {
    controllers.get(root)?.abort();
    controllers.delete(root);
}

export async function mount(root, { signal: mountSignal } = {}) {
    unmount(root);
    const controller = new AbortController();
    controllers.set(root, controller);
    const { signal } = controller;
    if (mountSignal?.aborted) return;
    mountSignal?.addEventListener("abort", () => controller.abort(), {
        once: true,
        signal,
    });
    const i18n = await createI18n({
        componentStringBaseUrls: ["/static/modules/module-template/languages"],
    });
    const response = await apiFetch(
        "/static/modules/module-template/templates/showcase.html",
        { signal },
    );
    if (!response.ok) throw new Error("Module template markup is unavailable.");
    const template = (await response.text()).replace(/{{([^}]+)}}/g, (_, key) =>
        escapeHtml(i18n.t(key)),
    );
    const reportError = (error) => {
        uiCtx.capabilities.get("ui:log")(
            "error",
            "Showcase operation failed.",
            {
                component: "module:module-template",
                operation: "showcase",
                error: error instanceof Error ? error.message : String(error),
            },
        );
        uiCtx.capabilities.get("ui:showToast")(i18n.t("ui.reuse.error"), {
            variant: "error",
        });
    };
    const loadItems = async () => {
        const result = await apiFetch(API_PATH, { signal });
        if (!result.ok) throw new Error("Item loading failed.");
        const payload = await result.json();
        const list = root.querySelector("[data-module-template-items]");
        if (list && !signal.aborted)
            list.innerHTML = payload.data
                .map((item) => `<li>${escapeHtml(item.title)}</li>`)
                .join("");
    };
    if (signal.aborted) return;
    root.addEventListener(
        "submit",
        async (event) => {
            if (!event.target.matches(".module-template-form")) return;
            event.preventDefault();
            try {
                const title = new FormData(event.target).get("title");
                const created = await apiFetch(API_PATH, {
                    method: "POST",
                    signal,
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ title }),
                });
                if (!created.ok) throw new Error("Item creation failed.");
                await loadItems();
                uiCtx.capabilities.get("ui:showToast")(
                    i18n.t("module.module_template.item.created"),
                    { variant: "success" },
                );
            } catch (error) {
                if (!signal.aborted) reportError(error);
            }
        },
        { signal },
    );
    const composer = createPageComposer(root, {
        i18n,
        allowCustomization: false,
        pageContext: { title: i18n.t("module.module_template.title") },
        elements: [
            {
                id: "module-template-showcase",
                label: i18n.t("module.module_template.title"),
                pinned: true,
                gridSize: { default: [12, 4] },
                render: () => template,
            },
        ],
        onRender() {
            if (signal.aborted) return;
            void loadItems().catch((error) => {
                if (!signal.aborted) reportError(error);
            });
        },
    });
    await composer.init();
}

await mountWhenDirect(mount);
