import type { BuildState, ModuleSpec, CompatibilityRule, Connector } from './types';

function connOk(a:Connector, b:Connector){
  // базовое правило «открытое стыкуется с открытым»
  return a === 'rightOpen' && b === 'leftOpen';
}

function applyWhiteBlack(
  candidates: ModuleSpec[],
  rules: CompatibilityRule[],
  prev?: ModuleSpec
){
  return candidates.filter(n => {
    let allowed = true;
    for(const r of rules){
      if (prev && r.prevModuleId && r.prevModuleId !== prev.id) continue;
      if (r.nextModuleId && r.nextModuleId !== n.id) continue;
      if (prev && r.prevConnector && r.prevConnector !== prev.connectors.right) continue;
      if (r.nextConnector && r.nextConnector !== n.connectors.left) continue;
      if (r.allow === false) allowed = false; // чёрный список бьёт
      if (r.allow === true)  allowed = true;  // белый список разрешает
    }
    return allowed;
  });
}

export function getAvailableNextModules(
  state: Pick<BuildState,'modelId'|'chain'>,
  all: ModuleSpec[],
  rules: CompatibilityRule[]
){
  const modelModules = all.filter(m => m.modelId === state.modelId);
  if (state.chain.length === 0){
    return modelModules.filter(m => m.allowedAsFirst);
  }
  const prev = modelModules.find(m => m.id === state.chain[state.chain.length-1]);
  if (!prev) return modelModules.filter(m => m.allowedAsFirst);

  let candidates = modelModules.filter(n => connOk(prev.connectors.right, n.connectors.left));
  candidates = applyWhiteBlack(candidates, rules.filter(r => r.modelId === state.modelId), prev);
  return candidates;
}

export function isComplete(state: BuildState, modulesById: Record<string, ModuleSpec>){
  if (state.chain.length === 0) return false;
  const first = modulesById[state.chain[0]];
  const last  = modulesById[state.chain[state.chain.length-1]];
  if (!first || !last) return false;
  const firstOk = first.allowedAsFirst && first.connectors.left === 'leftCap';
  const lastOk  = last.allowedAsLast  && last.connectors.right === 'rightCap';
  return firstOk && lastOk;
}
