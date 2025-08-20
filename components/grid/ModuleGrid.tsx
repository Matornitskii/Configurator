'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addModule } from '@/features/builder/builderSlice';
import { getAvailableNextModules, type ModuleSpec, type CompatibilityRule } from '@/packages/rules';
import { useMemo, useState } from 'react';

interface Props {
  modules: ModuleSpec[];
  rules: CompatibilityRule[];
  modulesById: Record<string, ModuleSpec>;
  t:(k:string)=>string;
}

export default function ModuleGrid({ modules, rules, modulesById, t }: Props){
  const dispatch = useAppDispatch();
  const builder = useAppSelector(s => s.builder);
  const [query,setQuery] = useState('');
  const available = useMemo(()=>getAvailableNextModules(builder, modules, rules), [builder, modules, rules]);
  if(modules.length===0) return <div className="text-sm text-gray-400">{t('loading')}</div>;
  const filtered = available.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
  if(filtered.length===0) return <div className="text-sm text-gray-500">{t('no_modules')}</div>;
  return (
    <div>
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={t('search')} className="border rounded p-1 w-full text-sm mb-2"/>
      <div className="grid grid-cols-3 gap-2">
        {filtered.map(m => (
          <button
            key={m.id}
            className="border rounded p-2 text-sm flex flex-col items-center hover:shadow"
            onClick={() => dispatch(addModule({spec:m, specs:modulesById}))}
          >
            <Image src={m.images.thumbUrl} alt={m.name} width={80} height={40}/>
            <span className="mt-1 font-semibold text-center">{m.name}</span>
            <span className="text-xs text-gray-600 text-center">{m.short}</span>
            <span className="text-xs">{m.sku}</span>
            <span className="text-xs">{m.bbox.width}×{m.bbox.depth}</span>
            <span className="text-xs">{t('seats')}: {m.seatCount ?? 0}</span>
            <div className="flex gap-1 mt-1">
              {m.allowedAsFirst && <span className="text-[10px] bg-green-200 px-1 rounded">F</span>}
              {m.allowedAsLast && <span className="text-[10px] bg-blue-200 px-1 rounded">L</span>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
