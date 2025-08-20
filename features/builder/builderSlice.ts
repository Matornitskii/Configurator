import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  type BuildState,
  type ModuleSpec,
  type Direction,
  type Turn,
  dirToRot,
  advanceVec,
  rotateDir,
  computeTotals
} from '@/packages/rules';

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

type SpecsMap = Record<string, ModuleSpec>;

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    reset: () => initialState,
    addModule: (state, action: PayloadAction<{spec: ModuleSpec}>) => {
      const spec = action.payload.spec;
      // place
      const rotation = dirToRot(state.dir);
      state.placed.push({ moduleId: spec.id, x: state.cursor.x, y: state.cursor.y, rotation });
      state.chain.push(spec.id);
      // move cursor
      const {dx,dy} = advanceVec(state.dir, spec.bbox.width);
      state.cursor.x += dx; state.cursor.y += dy;
      // turn if it's corner
      const t = (spec.turn ?? 0) as Turn;
      state.dir = rotateDir(state.dir, t);
    },
    setCompletion: (state, action: PayloadAction<boolean>) => { state.isComplete = action.payload; },
    recompute: (state, action: PayloadAction<{specs: SpecsMap}>) => {
      const {width, depth, seats} = computeTotals(state.placed, action.payload.specs);
      state.totalSize = {width, depth};
      state.totalSeats = seats;
    }
  }
});

export const { reset, addModule, setCompletion, recompute } = builderSlice.actions;
export default builderSlice.reducer;
