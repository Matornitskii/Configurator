'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addAccessory, removeAccessory } from '@/features/builder/builderSlice';

export interface Accessory { id: string; name: string; imageUrl: string; }
export interface Option { id: string; name: string; icon: string; }

const fabricOptions: Option[] = [
  {id:'fab1', name:'Fabric 1', icon:'/brand/destyle_gray_alfa.png'},
  {id:'fab2', name:'Fabric 2', icon:'/brand/destyle_gray_alfa.png'}
];
const legOptions: Option[] = [
  {id:'leg1', name:'Legs 1', icon:'/brand/destyle_gray_alfa.png'},
  {id:'leg2', name:'Legs 2', icon:'/brand/destyle_gray_alfa.png'}
];

export default function OptionsPanel({ accessories, fabric, legs, setFabric, setLegs, t }:{ accessories: Accessory[]; fabric:Option|null; legs:Option|null; setFabric:(o:Option)=>void; setLegs:(o:Option)=>void; t:(k:string)=>string; }){
  const dispatch = useAppDispatch();
  const freeItems = useAppSelector(s => s.builder.freeItems);
  const isComplete = useAppSelector(s => s.builder.isComplete);
  const count = (id:string) => freeItems.filter(f => f.accessoryId===id).length;
  const disabled = !isComplete;
  const download = async () => {
    const res = await fetch('/api/export', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title:'Sofa', scene:''})});
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'sofa.pdf'; a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            {fabricOptions.map(o => (
              <button key={o.id} onClick={()=>setFabric(o)} className={`border p-1 rounded ${fabric?.id===o.id?'ring-2 ring-blue-500':''}`}>
                <Image src={o.icon} alt={o.name} width={24} height={24}/>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {legOptions.map(o => (
              <button key={o.id} onClick={()=>setLegs(o)} className={`border p-1 rounded ${legs?.id===o.id?'ring-2 ring-blue-500':''}`}>
                <Image src={o.icon} alt={o.name} width={24} height={24}/>
              </button>
            ))}
          </div>
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
          disabled={disabled}
          title={disabled?t('incomplete'):''}
          onClick={download}
        >
          {t('download')}
        </button>
      </div>
    </div>
  );
}
