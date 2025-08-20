'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import ModelCarousel, { type Model } from '@/components/carousel/ModelCarousel';
import OptionsPanel, { type Accessory } from '@/components/options/OptionsPanel';
import ModuleGrid from '@/components/grid/ModuleGrid';
import ActionBar from '@/components/actions/ActionBar';
import AssemblyCanvas from '@/components/assembly/AssemblyCanvas';
import ChosenList from '@/components/chosen/ChosenList';
import type { ModuleSpec, CompatibilityRule } from '@/packages/rules';
import { useI18n } from '@/lib/i18n';

export default function Page(){
  const [lang,setLang] = useState<'ru'|'kz'|'hy'>('ru');
  const { t } = useI18n(lang);
  const [models,setModels] = useState<Model[]>([]);
  const [modules,setModules] = useState<ModuleSpec[]>([]);
  const [rules,setRules] = useState<CompatibilityRule[]>([]);
  const [accessories,setAccessories] = useState<Accessory[]>([]);

  useEffect(() => {
    fetch('/mock/models.json').then(r=>r.json()).then(setModels);
    fetch('/mock/modules.json').then(r=>r.json()).then(setModules);
    fetch('/mock/rules.json').then(r=>r.json()).then(setRules);
    fetch('/mock/accessories.json').then(r=>r.json()).then(setAccessories);
  }, []);

  const modulesById = useMemo(() => Object.fromEntries(modules.map(m=>[m.id,m])), [modules]);
  const accessoriesById = useMemo(() => Object.fromEntries(accessories.map(a=>[a.id,a])), [accessories]);

  return (
    <main className="grid" style={{gridTemplateRows:'12vh calc(100vh - 12vh)'}}>
      <header className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Image src="/brand/destyle_gray_alfa.png" alt="brand" width={120} height={30}/>
          <ModelCarousel models={models}/>
        </div>
        <div className="text-sm text-gray-600 flex gap-2">
          {['ru','kz','hy'].map(l => (
            <button key={l} className={lang===l?"font-bold":''} onClick={()=>setLang(l as any)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </header>

      <section className="grid" style={{gridTemplateColumns:'20vw 40vw 40vw', height:'100%'}}>
        <div className="h-full border-r"><OptionsPanel accessories={accessories} t={t}/></div>
        <div className="grid" style={{gridTemplateRows:'1fr 10%'}}>
          <div className="p-3 overflow-auto"><ModuleGrid modules={modules} rules={rules} modulesById={modulesById}/></div>
          <div className="p-3"><ActionBar modulesById={modulesById} t={t}/></div>
        </div>
        <div className="grid" style={{gridTemplateRows:'1fr 1fr'}}>
          <div className="p-3"><AssemblyCanvas modulesById={modulesById} accessoriesById={accessoriesById}/></div>
          <ChosenList modulesById={modulesById}/>
        </div>
      </section>
    </main>
  );
}
