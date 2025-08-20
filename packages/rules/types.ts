export type Id = string;

export type Connector = 'leftOpen'|'rightOpen'|'leftCap'|'rightCap'|'none';
export type Direction = 'E'|'S'|'W'|'N';
export type Turn = -90 | 0 | 90;

export interface BoundingBox { width: number; depth: number; height?: number; }

export interface ModuleSpec {
  id: Id; sku: string; modelId: Id;
  name: string; short: string;
  bbox: BoundingBox;             // мм
  seatCount?: number;            // места на модуле
  connectors: { left: Connector; right: Connector; };
  allowedAsFirst: boolean; allowedAsLast: boolean;
  images: { thumbUrl: string; sceneUrl?: string; };
  turn?: Turn;                   // -90/0/90 (угловой модуль меняет курс)
  tags?: string[];
}

export interface CompatibilityRule {
  modelId: Id; allow: boolean; reason?: string;
  prevModuleId?: Id; nextModuleId?: Id;
  prevConnector?: Connector; nextConnector?: Connector;
}

export interface PlacedModule { moduleId: Id; x: number; y: number; rotation: 0|90|180|270; }

export interface BuildState {
  modelId: Id;
  chain: Id[];                        // выбранные модули по порядку
  dir: Direction;                     // текущий курс (E/S/W/N)
  cursor: { x: number; y: number };   // куда ставить следующий модуль
  placed: PlacedModule[];             // как расположены модули на сцене
  totalSize: { width: number; depth: number };
  totalSeats: number;
  isComplete: boolean;
}
