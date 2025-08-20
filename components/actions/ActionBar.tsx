'use client';

import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { undo, reset } from '@/features/builder/builderSlice';
import type { ModuleSpec } from '@/packages/rules';

export default function ActionBar({ modulesById, t }:{ modulesById: Record<string, ModuleSpec>; t:(k:string)=>string; }){
  const dispatch = useAppDispatch();
  const { chain, isComplete } = useAppSelector(s => s.builder);
  const disabledUndo = chain.length === 0;
  const hint = chain.length===0 ? t('hint_first') : (!isComplete ? t('hint_last') : t('hint_done'));
  return (
    <div className="flex gap-2">
      <button
        className={`px-3 py-2 rounded bg-blue-600 text-white ${disabledUndo?'opacity-50':''}`}
        disabled={disabledUndo}
        onClick={() => dispatch(undo({specs: modulesById}))}
      >
        {t('undo')}
      </button>
      <button
        className={`px-3 py-2 rounded bg-red-600 text-white ${disabledUndo?'opacity-50':''}`}
        disabled={disabledUndo}
        onClick={() => dispatch(reset())}
      >
        {t('reset')}
      </button>
      <div className="text-sm text-gray-600 flex items-center">{hint}</div>
    </div>
  );
}
