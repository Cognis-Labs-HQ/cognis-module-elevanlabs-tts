export const uiCtx = globalThis[Symbol.for("cognis.uiCtx")];
const resources = uiCtx?.capabilities.get("ui:reuse");
if (!resources) throw new Error("Required UI capability unavailable: ui:reuse");
export const importReuseModule = (path) => resources.importModule(path);
