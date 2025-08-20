import type { Direction, Turn, ModuleSpec } from './types';

export const dirToRot = (d:Direction):0|90|180|270 => ({E:0,S:90,W:180,N:270} as const)[d];

export function advanceVec(d:Direction, dist:number){
  const v = {E:[dist,0], S:[0,dist], W:[-dist,0], N:[0,-dist]} as const;
  const [dx,dy] = v[d]; return {dx,dy};
}

export function rotateDir(d:Direction, turn:Turn):Direction{
  const order:Direction[]=['E','S','W','N'];
  let i = order.indexOf(d);
  const steps = turn/90;
  i = (i + steps + 4) % 4;
  return order[i];
}

export function computeTotals(
  placed: {x:number;y:number;moduleId:string}[],
  specs: Record<string, ModuleSpec>
){
  if(placed.length===0) return {width:0, depth:0, seats:0};
  let minX=Infinity, maxX=-Infinity, minY=Infinity, maxY=-Infinity, seats=0;
  for(const p of placed){
    const m = specs[p.moduleId];
    seats += m.seatCount ?? 0;
    const x2 = p.x + m.bbox.width;
    const y2 = p.y + m.bbox.depth;
    minX = Math.min(minX, p.x); maxX = Math.max(maxX, x2);
    minY = Math.min(minY, p.y); maxY = Math.max(maxY, y2);
  }
  return {width: Math.round(maxX-minX), depth: Math.round(maxY-minY), seats};
}
