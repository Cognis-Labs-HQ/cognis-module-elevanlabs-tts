import { createService } from "./api/service.js";
import { Configuration } from "./api/config.js";
import { registerConfigurationRoutes } from "./api/routes/config/index.js";
import path from "node:path";

export async function bootstrapModule(ctx) {
    const service = await createService(ctx);
    registerConfigurationRoutes(ctx, service);
    ctx.registerStaticDir("", path.join(ctx.moduleRoot, "ui"));
    ctx.contributePublicCapability("speech:synthesis", {
        get revision() {
            return service.revision;
        },
        synthesize: service.synthesize,
    });
    ctx.log?.("info", "ElevenLabs speech synthesis enabled.", {
        component: "elevenlabs-tts",
        operation: "bootstrap",
    });
}

export async function uninstallModule(ctx, { deleteContent }) {
    if (!deleteContent) return;
    const configuration = new Configuration(
        ctx.getCapability("db:executor"),
        ctx.log,
    );
    await configuration.load();
    await configuration.clear();
    ctx.log?.("info", "ElevenLabs configuration deleted.", {
        component: "elevenlabs-tts",
        operation: "uninstall",
    });
}
