import type { ModuleSpec, Connector } from './geometry';

export interface ConnectionRule {
  modelId: string;
  prevConnector: Connector;
  nextConnector: Connector;
  allow: boolean;
  reason?: string;
}

export function getAvailableNextModules(
  chain: string[],
  modules: ModuleSpec[],
  rules: ConnectionRule[]
): ModuleSpec[] {
  const map = Object.fromEntries(modules.map(m => [m.id, m]));
  if (chain.length === 0) {
    return modules.filter(m => m.allowedAsFirst);
  }
  const last = map[chain[chain.length - 1]];
  const prevConn = last.connectors.right;
  return modules.filter(m => {
    const rule = rules.find(r =>
      r.modelId === last.modelId &&
      r.prevConnector === prevConn &&
      r.nextConnector === m.connectors.left
    );
    if (rule) return rule.allow;
    return true;
  });
}

export function isComplete(
  chain: string[],
  specs: Record<string, ModuleSpec>
): boolean {
  if (chain.length === 0) return false;
  const last = specs[chain[chain.length - 1]];
  return !!last?.allowedAsLast;
}

export function computeTotals(
  placed: { x: number; y: number; moduleId: string }[],
  specs: Record<string, ModuleSpec>
) {
  if (placed.length === 0) return { width: 0, depth: 0, seats: 0 };
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity,
    seats = 0;
  for (const p of placed) {
    const m = specs[p.moduleId];
    seats += m.seatCount ?? 0;
    const x2 = p.x + m.bbox.width;
    const y2 = p.y + m.bbox.depth;
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, x2);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, y2);
  }
  return {
    width: Math.round(maxX - minX),
    depth: Math.round(maxY - minY),
    seats,
  };
}
