export function createFlowRuntime() {
    const flows = new Map();
    const hooks = new Map();
    const executions = [];
    return {
        executions,
        registerFlow(flow) {
            if (flows.has(flow.id)) throw new Error("flow_conflict");
            flows.set(flow.id, flow.stages);
        },
        flow: {
            exists: (id) => flows.has(id),
            extend(flowId, stageId, hook, handler) {
                if (!flows.get(flowId)?.includes(stageId))
                    throw new Error("unknown_stage");
                const key = `${flowId}:${stageId}`;
                hooks.set(key, [...(hooks.get(key) ?? []), handler]);
                return true;
            },
            async run(flowId, input) {
                const stages = flows.get(flowId);
                if (!stages) throw new Error("unknown_flow");
                const data = {};
                const stageResults = {};
                for (const stageId of stages) {
                    const key = `${flowId}:${stageId}`;
                    executions.push(key);
                    stageResults[stageId] = [];
                    for (const handler of hooks.get(key) ?? [])
                        stageResults[stageId].push(
                            await handler({
                                flowId,
                                stageId,
                                input,
                                data,
                                stageResults,
                            }),
                        );
                }
                return { data, stageResults };
            },
        },
    };
}
