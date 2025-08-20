'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { moveAccessory, fitToView as fitAction } from '@/features/builder/builderSlice';
import type { ModuleSpec } from '@/packages/rules';
import type { Option } from '@/components/options/OptionsPanel';

interface Accessory { id:string; imageUrl:string; }

interface Props {
  modulesById: Record<string, ModuleSpec>;
  accessoriesById: Record<string, Accessory>;
  fabric?: Option|null;
  legs?: Option|null;
}

export default function AssemblyCanvas({ modulesById, accessoriesById, fabric, legs }: Props){
  const dispatch = useAppDispatch();
  const { placed, freeItems, totalSize, totalSeats, fitToView:fit } = useAppSelector(s=>s.builder);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({x:0,y:0,scale:0.5});
  const [panStart, setPanStart] = useState<{x:number;y:number}|null>(null);
  const [dragAcc, setDragAcc] = useState<string|null>(null);

  // fit to view when requested
  useEffect(()=>{
    if(placed.length===0){ setView({x:0,y:0,scale:0.5}); return; }
    const bbox = {minX:Infinity,minY:Infinity,maxX:-Infinity,maxY:-Infinity};
    for(const p of placed){
      const spec = modulesById[p.moduleId];
      const rot = p.rotation % 180 !== 0;
      const w = rot ? spec.bbox.depth : spec.bbox.width;
      const h = rot ? spec.bbox.width : spec.bbox.depth;
      bbox.minX = Math.min(bbox.minX, p.x);
      bbox.minY = Math.min(bbox.minY, p.y);
      bbox.maxX = Math.max(bbox.maxX, p.x + w);
      bbox.maxY = Math.max(bbox.maxY, p.y + h);
    }
    const width = bbox.maxX - bbox.minX;
    const height = bbox.maxY - bbox.minY;
    const container = containerRef.current;
    if(container){
      const scale = Math.min(container.clientWidth/width, container.clientHeight/height, 3);
      const x = (container.clientWidth - width*scale)/2 - bbox.minX*scale;
      const y = (container.clientHeight - height*scale)/2 - bbox.minY*scale;
      setView({x,y,scale});
    }
  }, [fit, placed, modulesById]);

  const onWheel = (e:React.WheelEvent) => {
    e.preventDefault();
    setView(v=>{
      let scale = v.scale * (e.deltaY < 0 ? 1.1 : 0.9);
      scale = Math.min(3, Math.max(0.5, scale));
      return {...v, scale};
    });
  };

  const onPointerDown = (e:React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const id = target.getAttribute('data-acc');
    if(id){
      setDragAcc(id);
    }else{
      setPanStart({x:e.clientX - view.x, y:e.clientY - view.y});
    }
  };

  const onPointerMove = (e:React.PointerEvent) => {
    if(dragAcc){
      const rect = containerRef.current!.getBoundingClientRect();
      let x = (e.clientX - rect.left - view.x)/view.scale;
      let y = (e.clientY - rect.top - view.y)/view.scale;
      x = Math.max(0, Math.min(totalSize.width, x));
      y = Math.max(0, Math.min(totalSize.depth, y));
      dispatch(moveAccessory({id:dragAcc,x,y}));
    }else if(panStart){
      setView(v=>({...v, x:e.clientX - panStart.x, y:e.clientY - panStart.y}));
    }
  };

  const stopDrag = () => { setPanStart(null); setDragAcc(null); };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-100 overflow-hidden" onWheel={onWheel} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerLeave={stopDrag} onPointerDown={onPointerDown}>
      <svg className="absolute inset-0 w-full h-full touch-none">
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {placed.map((p,i)=>{
            const spec = modulesById[p.moduleId];
            const rot = p.rotation % 180 !== 0;
            const w = rot ? spec.bbox.depth : spec.bbox.width;
            const h = rot ? spec.bbox.width : spec.bbox.depth;
            const href = spec.images.sceneUrl;
            return <image key={i} href={href} x={p.x} y={p.y} width={w} height={h} preserveAspectRatio="none" />;
          })}
          {freeItems.map(f=>{
            const acc = accessoriesById[f.accessoryId];
            if(!acc) return null;
            return <image key={f.id} data-acc={f.id} href={acc.imageUrl} x={f.x} y={f.y} width={80} height={80} className="cursor-move hover:opacity-80"/>;
          })}
        </g>
      </svg>
      <button className="absolute left-2 top-2 bg-white/80 rounded px-2" onClick={()=>dispatch(fitAction())}>↺</button>
      <div className="absolute right-4 top-4 flex items-center gap-2 text-sm text-gray-700 bg-white/70 px-2 py-1 rounded">
        {fabric && <img src={fabric.icon} alt={fabric.name} className="w-4 h-4"/>}
        {legs && <img src={legs.icon} alt={legs.name} className="w-4 h-4"/>}
        <span>{`Ш×Г: ${totalSize.width}×${totalSize.depth} мм · Места: ${totalSeats}`}</span>
      </div>
    </div>
  );
}
