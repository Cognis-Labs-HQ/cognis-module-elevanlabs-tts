import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("configuration and marketplace labels are translated in every supported locale", async () => {
    const manifest = JSON.parse(await readFile("manifest.json", "utf8"));
    const keys = [
        manifest.name,
        manifest.summary,
        manifest.description,
        ...manifest.tags,
        ...manifest.categories,
        ...manifest.ui.preferences.map((field) => field.labelKey),
        ...manifest.ui.configActions.map((action) => action.labelKey),
    ];
    let englishKeys;
    for (const language of ["en", "de", "id", "ja"]) {
        const xml = await readFile(
            `ui/languages/${language}/strings.xml`,
            "utf8",
        );
        const translations = new Map(
            [...xml.matchAll(/<string name="([^"]+)">([^<]+)<\/string>/g)].map(
                (match) => [match[1], match[2]],
            ),
        );
        for (const key of keys)
            assert.ok(translations.get(key)?.trim(), `${language}: ${key}`);
        const names = [...translations.keys()].sort();
        if (language === "en") englishKeys = names;
        else assert.deepEqual(names, englishKeys);
    }
});
