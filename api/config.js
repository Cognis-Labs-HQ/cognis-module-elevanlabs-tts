import { randomUUID } from "node:crypto";

const TABLE = "module_elevenlabs_tts_config";
export class Configuration {
    value = {};

    constructor(database, log) {
        this.database = database;
        this.log = log;
    }

    async load() {
        await this.database.ensureTable({
            name: TABLE,
            columns: [
                { name: "id", type: "text", primaryKey: true },
                { name: "value", type: "text", notNull: true },
            ],
        });
        const result = await this.database.executeCommand({
            option: "SELECT",
            table: TABLE,
            columns: ["value"],
            where: [{ column: "id", value: "configuration" }],
        });
        const stored = result.rows?.[0] ? JSON.parse(result.rows[0].value) : {};
        const { testText: _testText, ...configuration } = stored;
        this.value = configuration;
        if (Object.hasOwn(stored, "testText")) {
            await this.persist(configuration);
            this.log?.("info", "Stored speech preview text removed.", {
                component: "elevenlabs-tts",
                operation: "sanitizeConfiguration",
            });
        }
        return this.value;
    }

    preview(input = {}) {
        if (!input || typeof input !== "object" || Array.isArray(input))
            throw new Error("invalid_configuration");
        const value = { ...this.value };
        for (const key of ["apiKey", "voiceId", "testText"]) {
            if (input[key] === undefined) continue;
            if (
                typeof input[key] !== "string" ||
                input[key].length > (key === "testText" ? 500 : 512)
            )
                throw new Error("invalid_configuration");
            if (key === "apiKey" && (!input[key] || input[key] === "****"))
                continue;
            value[key] = input[key].trim();
        }
        if (value.voiceId && !/^[a-zA-Z0-9_-]{1,128}$/.test(value.voiceId))
            throw new Error("invalid_voice_id");
        return value;
    }

    publicValue() {
        return {
            apiKeyConfigured: Boolean(this.value.apiKey),
            voiceId: this.value.voiceId ?? "",
            testText: "",
        };
    }

    async save(input) {
        const { testText: _testText, ...configuration } = this.preview(input);
        if (!configuration.apiKey || !configuration.voiceId)
            throw new Error("invalid_configuration");
        const value = { ...configuration, revision: randomUUID() };
        await this.persist(value);
        return this.publicValue();
    }

    async persist(value) {
        const encoded = JSON.stringify(value);
        await this.database.executeCommand({
            option: "INSERT",
            table: TABLE,
            values: { id: "configuration", value: encoded },
            conflict: {
                target: ["id"],
                action: "update",
                update: { value: encoded },
            },
        });
        this.value = value;
    }

    async clear() {
        await this.database.executeCommand({ option: "DELETE", table: TABLE });
        this.value = {};
    }
}
