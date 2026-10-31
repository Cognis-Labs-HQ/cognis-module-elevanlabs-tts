import { definition } from "./plays.js";

/** Register only through the host's public tutorial and resource contracts. */
export async function mountProvider(ctx) {
    const api = ctx.capabilities.get("ui:tutorials");
    if (api?.version !== 1) throw new Error("tutorial_contract_unavailable");
    const reuse = ctx.capabilities.get("ui:reuse");
    const owner = api.owner("module.elevenlabs-tts", {
        signal: ctx.signal,
        stringsBaseUrls: ["/static/modules/elevenlabs-tts/languages"],
    });
    try {
        const targets = {};
        const cards = ctx.capabilities.get("ui:moduleTutorialTargets");
        if (!cards) throw new Error("module_tutorial_targets_unavailable");
        const card = await cards.card("elevenlabs-tts", {
            signal: owner.signal,
        });
        targets.card = card.id;
        const { isAdminScope } = await reuse.importModule("access-role.js");
        const play = await owner.register({
            ...definition,
            available: () =>
                isAdminScope() &&
                ctx.capabilities.get("session:isAuthenticated")?.() === true &&
                ctx.capabilities.get("offline:state")?.isOffline() !== true,
            requires: ["ui:navigate", "ui:moduleTutorialTargets"],
            steps: definition.steps.map((step) => ({
                ...step,
                ...(step.target ? { target: targets[step.target] } : {}),
            })),
        });
        ctx.capabilities.contribute("elevenlabs-tts:tutorials", play);
        return owner.dispose;
    } catch (error) {
        owner.dispose();
        throw error;
    }
}
