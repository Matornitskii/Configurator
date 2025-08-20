import { describe, it, expect } from 'vitest';
import modules from '@/public/mock/modules.json';
import rules from '@/public/mock/rules.json';
import {
  getAvailableNextModules,
  isComplete,
  computeTotals,
  type CompatibilityRule,
  type ModuleSpec,
  type BuildState
} from '@/packages/rules';

const moduleSpecs = modules as ModuleSpec[];
const ruleSpecs = rules as CompatibilityRule[];
const specsMap = Object.fromEntries(moduleSpecs.map(m => [m.id, m]));
const baseState: BuildState = {
  modelId: 'dakota-s',
  chain: [],
  dir: 'E',
  cursor: { x: 0, y: 0 },
  placed: [],
  totalSize: { width: 0, depth: 0 },
  totalSeats: 0,
  isComplete: false,
};

describe('rules core', () => {
  it('gets first-step modules', () => {
    const res = getAvailableNextModules(baseState, moduleSpecs, ruleSpecs);
    expect(res.map(m => m.id)).toEqual(['ksl_2']);
  });

  it('filters by connectors and rules', () => {
    const res = getAvailableNextModules({ ...baseState, chain: ['ksl_2'] }, moduleSpecs, ruleSpecs);
    expect(res.map(m => m.id).sort()).toEqual(['corner_l', 'ksr_2']);
  });

  it('checks completion by last module', () => {
    expect(isComplete({ ...baseState, chain: ['ksl_2'] }, specsMap)).toBe(false);
    expect(isComplete({ ...baseState, chain: ['ksl_2', 'corner_l'] }, specsMap)).toBe(false);
    expect(isComplete({ ...baseState, chain: ['ksl_2', 'ksr_2'] }, specsMap)).toBe(true);
  });

  it('computes total size and seats', () => {
    const placed = [
      { moduleId: 'ksl_2', x: 0, y: 0 },
      { moduleId: 'corner_l', x: 1400, y: 0 },
      { moduleId: 'ksr_2', x: 1400, y: 1000 }
    ];
    const totals = computeTotals(placed, specsMap);
    expect(totals).toEqual({ width: 2800, depth: 2000, seats: 5 });
  });
});
