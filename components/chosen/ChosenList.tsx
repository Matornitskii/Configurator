'use client';

import { useAppSelector } from '@/features/hooks';
import type { ModuleSpec } from '@/packages/rules';

export default function ChosenList({ modulesById }:{ modulesById: Record<string, ModuleSpec>; }){
  const { chain, totalSeats } = useAppSelector(s=>s.builder);
  return (
    <div className="p-3">
      <h2 className="font-semibold mb-2">Выбранные модули</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600"><th>№</th><th>SKU</th><th>Название</th><th>Размеры</th><th>Места</th></tr>
        </thead>
        <tbody>
          {chain.length === 0 && (
            <tr><td colSpan={5} className="text-center py-4 text-gray-500">Пока пусто</td></tr>
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
              </tr>
            );
          })}
        </tbody>
        {chain.length>0 && (
          <tfoot>
            <tr className="border-t font-semibold"><td colSpan={4} className="text-right">Итого</td><td>{totalSeats}</td></tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
