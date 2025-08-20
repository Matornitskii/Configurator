'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { addModule } from '@/features/builder/builderSlice';
import { getAvailableNextModules, type ModuleSpec, type CompatibilityRule } from '@/packages/rules';

interface Props {
  modules: ModuleSpec[];
  rules: CompatibilityRule[];
  modulesById: Record<string, ModuleSpec>;
}

export default function ModuleGrid({ modules, rules, modulesById }: Props){
  const dispatch = useAppDispatch();
  const builder = useAppSelector(s => s.builder);
  const available = getAvailableNextModules(builder, modules, rules);
  return (
    <div className="grid grid-cols-3 gap-2">
      {available.map(m => (
        <button
          key={m.id}
          className="border rounded p-2 text-sm flex flex-col items-center"
          onClick={() => dispatch(addModule({spec:m, specs:modulesById}))}
        >
          <Image src={m.images.thumbUrl} alt={m.name} width={80} height={40}/>
          <span className="mt-1 text-center">{m.short}</span>
        </button>
      ))}
    </div>
  );
}
