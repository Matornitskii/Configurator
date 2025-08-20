import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import reducer, { addModule, undo } from '@/features/builder/builderSlice';
import modules from '@/public/mock/modules.json';
import type { ModuleSpec } from '@/packages/rules';

const mods = modules as ModuleSpec[];
const modulesById = Object.fromEntries(mods.map(m=>[m.id,m]));

describe('builder slice', () => {
  it('completes after left and right sections', () => {
    const store = configureStore({reducer:{builder:reducer}});
    store.dispatch(addModule({spec: modulesById['ksl_2'], specs: modulesById}));
    store.dispatch(addModule({spec: modulesById['ksr_2'], specs: modulesById}));
    const state = store.getState().builder;
    expect(state.isComplete).toBe(true);
  });

  it('corner needs right cap to complete', () => {
    const store = configureStore({reducer:{builder:reducer}});
    store.dispatch(addModule({spec: modulesById['ksl_2'], specs: modulesById}));
    store.dispatch(addModule({spec: modulesById['corner_l'], specs: modulesById}));
    let state = store.getState().builder;
    expect(state.isComplete).toBe(false);
    store.dispatch(addModule({spec: modulesById['ksr_2'], specs: modulesById}));
    state = store.getState().builder;
    expect(state.isComplete).toBe(true);
  });

  it('undo recalculates chain and totals', () => {
    const store = configureStore({reducer:{builder:reducer}});
    store.dispatch(addModule({spec: modulesById['ksl_2'], specs: modulesById}));
    store.dispatch(addModule({spec: modulesById['ksr_2'], specs: modulesById}));
    store.dispatch(undo({specs: modulesById}));
    const state = store.getState().builder;
    expect(state.chain.length).toBe(1);
    expect(state.isComplete).toBe(false);
    expect(state.totalSeats).toBe(modulesById['ksl_2'].seatCount);
  });
});
