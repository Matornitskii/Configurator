'use client';

import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { removeAt } from '@/features/builder/builderSlice';
import type { ModuleSpec } from '@/packages/rules';

export default function ChosenList({ modulesById, t }:{ modulesById: Record<string, ModuleSpec>; t:(k:string)=>string; }){
  const dispatch = useAppDispatch();
  const { chain, totalSeats } = useAppSelector(s=>s.builder);
  const remove = (idx:number) => dispatch(removeAt({index:idx, specs:modulesById}));
  return (
    <div className="p-3">
      <h2 className="font-semibold mb-2">{t('chosen_modules')}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600"><th>№</th><th>SKU</th><th>{t('name')}</th><th>{t('size')}</th><th>{t('seats')}</th><th></th></tr>
        </thead>
        <tbody>
          {chain.length === 0 && (
            <tr><td colSpan={6} className="text-center py-4 text-gray-500">{t('empty')}</td></tr>
          )}
          {chain.map((id,idx)=>{
            const m = modulesById[id];
            if(!m) return null;
            return (
              <tr key={idx} className="border-t">
                <td>{idx+1}</td>
                <td>{m.sku}</td>
                <td>{m.name}</td>
                <td>{m.bbox.width}×{m.bbox.depth}</td>
                <td>{m.seatCount ?? 0}</td>
                <td><button onClick={()=>remove(idx)} className="text-red-600">×</button></td>
              </tr>
            );
          })}
        </tbody>
        {chain.length>0 && (
          <tfoot>
            <tr className="border-t font-semibold"><td colSpan={5} className="text-right">{t('total')}</td><td>{totalSeats}</td></tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
