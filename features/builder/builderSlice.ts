import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import type { BuildState, ModuleSpec, Turn } from '@/packages/rules';
import { dirToRot, advanceVec, rotateDir, computeTotals, isComplete } from '@/packages/rules';

type SpecsMap = Record<string, ModuleSpec>;

export interface FreeItem { id: string; accessoryId: string; x: number; y: number; }

interface BuilderState extends BuildState {
  freeItems: FreeItem[];
  fitToView: number;
}

const initialState: BuilderState = {
  modelId: 'dakota-s',
  chain: [],
  dir: 'E',
  cursor: {x:0,y:0},
  placed: [],
  totalSize: {width:0, depth:0},
  totalSeats: 0,
  isComplete: false,
  freeItems: [],
  fitToView: 0,
};

const slice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    reset: () => initialState,
    selectModel: (state, action: PayloadAction<string>) => {
      state.modelId = action.payload;
      state.chain = [];
      state.dir = 'E';
      state.cursor = {x:0,y:0};
      state.placed = [];
      state.totalSize = {width:0, depth:0};
      state.totalSeats = 0;
      state.isComplete = false;
      state.freeItems = [];
      state.fitToView++;
    },
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
      state.fitToView++;
    },
    undo: (state, action: PayloadAction<{specs: SpecsMap}>) => {
      if (state.chain.length === 0) return;
      state.chain.pop();
      state.dir = 'E';
      state.cursor = {x:0,y:0};
      state.placed = [];
      for (const id of state.chain) {
        const spec = action.payload.specs[id];
        const rotation = dirToRot(state.dir);
        state.placed.push({ moduleId: id, x: state.cursor.x, y: state.cursor.y, rotation });
        const {dx, dy} = advanceVec(state.dir, spec.bbox.width);
        state.cursor.x += dx; state.cursor.y += dy;
        const t = (spec.turn ?? 0) as Turn;
        state.dir = rotateDir(state.dir, t);
      }
      const {width, depth, seats} = computeTotals(state.placed, action.payload.specs);
      state.totalSize = {width, depth};
      state.totalSeats = seats;
      state.isComplete = isComplete(state, action.payload.specs);
      state.fitToView++;
    },
    addAccessory: (state, action: PayloadAction<{accessoryId: string}>) => {
      state.freeItems.push({ id: nanoid(), accessoryId: action.payload.accessoryId, x: 0, y: 0 });
    },
    removeAccessory: (state, action: PayloadAction<{accessoryId: string}>) => {
      for (let i = state.freeItems.length - 1; i >= 0; i--) {
        if (state.freeItems[i].accessoryId === action.payload.accessoryId) {
          state.freeItems.splice(i, 1);
          break;
        }
      }
    },
    moveAccessory: (state, action: PayloadAction<{id:string;x:number;y:number}>) => {
      const item = state.freeItems.find(f => f.id === action.payload.id);
      if (item) { item.x = action.payload.x; item.y = action.payload.y; }
    },
    fitToView: (state) => { state.fitToView++; }
  }
});

export const { reset, selectModel, addModule, undo, addAccessory, removeAccessory, moveAccessory, fitToView } = slice.actions;
export default slice.reducer;

