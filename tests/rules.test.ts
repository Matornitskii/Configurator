import { describe, it, expect } from 'vitest';
import { getAvailableNextModules, isComplete, computeTotals, type BuildState, type ModuleSpec } from '@/packages/rules';

const ksl: ModuleSpec = {
  id: 'ksl_2', sku: 'KSL_2', modelId: 'dakota-s',
  name: 'Секция левая', short: 'Левый край (2 места)',
  bbox: { width: 1400, depth: 1000 },
  connectors: { left: 'leftCap', right: 'rightOpen' },
  allowedAsFirst: true, allowedAsLast: false,
  seatCount: 2,
  images: { thumbUrl: '/thumbs/KSL_2.png' }
};
const cornerL: ModuleSpec = {
  id: 'corner_l', sku: 'CORNER_L', modelId: 'dakota-s',
  name: 'Угол левый', short: 'Поворот на 90° влево',
  bbox: { width: 1000, depth: 1000 },
  connectors: { left: 'leftOpen', right: 'rightOpen' },
  allowedAsFirst: false, allowedAsLast: false,
  seatCount: 1, turn: -90,
  images: { thumbUrl: '/thumbs/CORNER_L.png' }
};
const ksr: ModuleSpec = {
  id: 'ksr_2', sku: 'KSR_2', modelId: 'dakota-s',
  name: 'Секция правая', short: 'Правый край (2 места)',
  bbox: { width: 1400, depth: 1000 },
  connectors: { left: 'leftOpen', right: 'rightCap' },
  allowedAsFirst: false, allowedAsLast: true,
  seatCount: 2,
  images: { thumbUrl: '/thumbs/KSR_2.png' }
};

const all = [ksl, cornerL, ksr];
const rules: any[] = [
  { modelId: 'dakota-s', allow: false, prevConnector: 'rightOpen', nextConnector: 'leftCap', reason: 'глухой к глухому нельзя' }
];
const byId = Object.fromEntries(all.map(m => [m.id, m]));

describe('rules', () => {
  it('линейная сборка завершается (KSL_2 → KSR_2)', () => {
    const state: BuildState = {
      modelId:'dakota-s', chain:['ksl_2','ksr_2'], dir:'E',
      cursor:{x:0,y:0}, placed:[{moduleId:'ksl_2',x:0,y:0,rotation:0},{moduleId:'ksr_2',x:1400,y:0,rotation:0}],
      totalSize:{width:0,depth:0}, totalSeats:0, isComplete:false
    };
    expect(isComplete(state, byId)).toBe(true);
    const totals = computeTotals(state.placed, byId);
    expect(totals.width).toBe(2800);
    expect(totals.depth).toBe(1000);
    expect(totals.seats).toBe(4);
  });

  it('угловая сборка считает габариты (KSL_2 → CORNER_L → KSR_2)', () => {
    const placed = [
      { moduleId: 'ksl_2',   x: 0,    y: 0,   rotation: 0 },   // 1400×1000
      { moduleId: 'corner_l',x: 1400, y: 0,  rotation: 0 },   // +1000×1000
      // после поворота модуль смещается на 400 мм вверх, т.к. глубина 1000 < ширины 1400
      { moduleId: 'ksr_2',   x: 1400, y: 600, rotation: 90 }   // 1400×1000 вниз
    ];
    const totals = computeTotals(placed, byId);
    expect(totals.width).toBe(2400);
    expect(totals.depth).toBe(2000);
    expect(totals.seats).toBe(5);
  });

  it('список доступных модулей учитывает коннекторы и правила', () => {
    const empty = { modelId:'dakota-s', chain:[] } as any;
    const firsts = getAvailableNextModules(empty, all, rules);
    expect(firsts.some(m => m.id==='ksl_2')).toBe(true);
    const afterLeft = { modelId:'dakota-s', chain:['ksl_2'] } as any;
    const next = getAvailableNextModules(afterLeft, all, rules);
    // нельзя левый кап к левому капу
    expect(next.some(m => m.id==='ksl_2')).toBe(false);
  });
});

