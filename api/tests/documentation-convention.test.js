import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const TEMPLATE = resolve(ROOT, ".github/documentation/TECHNICAL.en.md");
const LANGUAGES = ["de", "en", "id", "ja"];

function markdownFiles(directory) {
    return readdirSync(directory).flatMap((name) => {
        const path = resolve(directory, name);
        if (statSync(path).isDirectory()) return markdownFiles(path);
        return name.endsWith(".md") ? [path] : [];
    });
}

function headingLevels(path) {
    return readFileSync(path, "utf8")
        .split("\n")
        .filter((line) => /^#{1,6} /.test(line))
        .map((line) => line.match(/^#+/)[0].length);
}

test("agent and Copilot instructions stay synchronized", () => {
    assert.equal(
        readFileSync(resolve(ROOT, "AGENTS.md"), "utf8"),
        readFileSync(resolve(ROOT, ".github/copilot-instructions.md"), "utf8"),
    );
});

test("the template repository does not publish its own changelog", () => {
    const manifest = JSON.parse(
        readFileSync(resolve(ROOT, "manifest.json"), "utf8"),
    );
    if (manifest.template === true)
        assert.equal(existsSync(resolve(ROOT, "docs/changelog")), false);
});

test("changelog digests stay outside the module manifest", () => {
    const manifest = JSON.parse(
        readFileSync(resolve(ROOT, "manifest.json"), "utf8"),
    );
    const changelogEntries = manifest.files.filter(({ path }) =>
        path.startsWith("docs/changelog/"),
    );
    assert.deepEqual(changelogEntries, []);
});

test("release filenames match their declared branch and retain implementation provenance", () => {
    const directory = resolve(ROOT, "docs/changelog");
    for (const filename of readdirSync(directory)) {
        if (!filename.endsWith(".md")) continue;
        const markdown = readFileSync(resolve(directory, filename), "utf8");
        const branch = markdown.match(
            /^\*\*(?:Feature Branch|Feature-Zweig|Cabang Fitur|機能ブランチ):\*\*\s+(.+)$/m,
        )?.[1];
        assert.ok(branch, filename);
        const locale = filename.match(/\.(de|en|id|ja)\.md$/)?.[1];
        assert.equal(
            filename,
            `${branch.replace(/^copilot\//, "").replaceAll("/", "-")}.${locale}.md`,
        );
        assert.match(
            markdown,
            /https:\/\/github\.com\/Cognis-Labs-HQ\/cognis-module-elevanlabs-tts\/commit\/[a-f0-9]{40}/,
        );
    }
});
