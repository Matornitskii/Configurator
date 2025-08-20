'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addAccessory, removeAccessory } from '@/features/builder/builderSlice';

export interface Accessory { id: string; name: string; imageUrl: string; }

export default function OptionsPanel({ accessories, t }:{ accessories: Accessory[]; t:(k:string)=>string; }){
  const dispatch = useAppDispatch();
  const freeItems = useAppSelector(s => s.builder.freeItems);
  const isComplete = useAppSelector(s => s.builder.isComplete);
  const count = (id:string) => freeItems.filter(f => f.accessoryId===id).length;
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <select className="w-full border rounded p-1 text-sm"><option>Ткань</option></select>
          <select className="w-full border rounded p-1 text-sm"><option>Ножки</option></select>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-sm">{t('accessories')}</h3>
          <div className="flex flex-col gap-2">
            {accessories.map(a => (
              <div key={a.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Image src={a.imageUrl} alt={a.name} width={32} height={32}/>
                  <span>{a.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button className="px-2 border rounded" onClick={()=>dispatch(removeAccessory({accessoryId:a.id}))}>-</button>
                  <span>{count(a.id)}</span>
                  <button className="px-2 border rounded" onClick={()=>dispatch(addAccessory({accessoryId:a.id}))}>+</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-4">
        <button
          className="w-full py-2 rounded text-white disabled:opacity-50"
          style={{background:'var(--brand-red)'}}
          disabled={!isComplete}
          onClick={()=>alert('PDF будет в Спринте 3')}
        >
          {t('download')}
        </button>
      </div>
    </div>
  );
}
