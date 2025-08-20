import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BuildState, ModuleSpec, Turn } from '@/packages/rules';
import { dirToRot, advanceVec, rotateDir, computeTotals, isComplete } from '@/packages/rules';

type SpecsMap = Record<string, ModuleSpec>;

const initialState: BuildState = {
  modelId: 'dakota-s',
  chain: [],
  dir: 'E',
  cursor: {x:0,y:0},
  placed: [],
  totalSize: {width:0, depth:0},
  totalSeats: 0,
  isComplete: false,
};

const slice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    reset: () => initialState,
    addModule: (state, action: PayloadAction<{spec: ModuleSpec; specs: SpecsMap;}>) => {
      const spec = action.payload.spec;
      // поставить модуль
      const rotation = dirToRot(state.dir);
      state.placed.push({ moduleId: spec.id, x: state.cursor.x, y: state.cursor.y, rotation });
      state.chain.push(spec.id);
      // сдвинуть курсор
      const {dx,dy} = advanceVec(state.dir, spec.bbox.width);
      state.cursor.x += dx; state.cursor.y += dy;
      // если угол — повернуть направление
      const t = (spec.turn ?? 0) as Turn;
      state.dir = rotateDir(state.dir, t);
      // пересчёты
      const {width, depth, seats} = computeTotals(state.placed, action.payload.specs);
      state.totalSize = {width, depth};
      state.totalSeats = seats;
      state.isComplete = isComplete(state, action.payload.specs);
    },
    undo: (state, action: PayloadAction<{specs: SpecsMap}>) => {
      if (state.chain.length === 0) return;
      state.chain.pop();
      state.placed.pop();
      // для простоты сбросим курс/курсор и пересоберём позже (v1)
      state.dir = 'E'; state.cursor = {x:0,y:0};
      // TODO: пересчитать dir/cursor заново по chain (достаточно переиграть addModule в цикле)
      const {width, depth, seats} = computeTotals(state.placed, action.payload.specs);
      state.totalSize = {width, depth};
      state.totalSeats = seats;
      state.isComplete = isComplete(state, action.payload.specs);
    }
  }
});

export const { reset, addModule, undo } = slice.actions;
export default slice.reducer;

