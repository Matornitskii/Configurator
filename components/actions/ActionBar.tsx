'use client';

import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { undo } from '@/features/builder/builderSlice';
import type { ModuleSpec } from '@/packages/rules';

export default function ActionBar({ modulesById, t }:{ modulesById: Record<string, ModuleSpec>; t:(k:string)=>string; }){
  const dispatch = useAppDispatch();
  const { chain, isComplete } = useAppSelector(s => s.builder);
  const disabled = chain.length === 0;
  let hint = '';
  if(chain.length === 0) hint = 'Добавьте первый модуль (левый глухой торец)';
  else if(!isComplete) hint = 'Добавьте правую секцию с глухим торцом';
  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-2 rounded bg-blue-600 text-white ${disabled?'opacity-50':''}`}
        disabled={disabled}
        onClick={() => dispatch(undo({specs: modulesById}))}
      >
        {t('undo')}
      </button>
      <div className="text-sm text-gray-600 flex items-center">{hint}</div>
    </div>
  );
}
