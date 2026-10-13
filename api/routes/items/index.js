import { readJson, sendJson } from "../../reuse/http.js";

export function registerItemRoutes(router, { requireAuth, service, log }) {
    for (const method of ["get", "post"]) {
        router[method](
            "/api/v1/modules/module-template/items",
            async (request, response) => {
                const claims = await requireAuth(request, response, "user");
                if (!claims || response.writableEnded) return;
                const ownerId = String(
                    claims.accountId ?? claims.sub ?? "",
                ).trim();
                if (!ownerId) {
                    sendJson(response, 403, {
                        error: {
                            code: "invalid_owner",
                            message: "Account identity is required.",
                        },
                    });
                    return;
                }
                try {
                    if (method === "get") {
                        sendJson(response, 200, {
                            data: await service.listItems(ownerId),
                        });
                        return;
                    }
                    const body = await readJson(request);
                    if (
                        !body ||
                        typeof body !== "object" ||
                        Array.isArray(body)
                    )
                        throw new Error("invalid_body");
                    const title =
                        typeof body.title === "string" ? body.title.trim() : "";
                    const item = await service.createItem(ownerId, title);
                    log?.("info", "Showcase item created.", {
                        component: "module-template",
                        operation: "create_item",
                        itemId: item.id,
                    });
                    sendJson(response, 201, { data: item });
                } catch (error) {
                    const clientError = [
                        "invalid_json",
                        "request_too_large",
                        "invalid_title",
                        "invalid_body",
                    ].includes(error.message);
                    log?.("error", "Showcase operation failed.", {
                        component: "module-template",
                        operation: method,
                        error: error.message,
                    });
                    sendJson(response, clientError ? 400 : 500, {
                        error: {
                            code: clientError
                                ? error.message
                                : "internal_error",
                            message: clientError
                                ? "The request is invalid."
                                : "The operation could not be completed.",
                        },
                    });
                }
            },
            { access: { minRole: "user" } },
        );
    }
}
