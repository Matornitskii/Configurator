'use client';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/features/hooks';
import { selectModel } from '@/features/builder/builderSlice';

export interface Model { id: string; name: string; thumbUrl: string; }

export default function ModelCarousel({ models }: { models: Model[] }) {
  const dispatch = useAppDispatch();
  const current = useAppSelector(s => s.builder.modelId);
  return (
    <div className="flex gap-3 overflow-x-auto py-2">
      {models.map(m => (
        <button
          key={m.id}
          onClick={() => dispatch(selectModel(m.id))}
          className={`flex flex-col items-center ${current===m.id?'opacity-100':'opacity-60'}`}
        >
          <Image src={m.thumbUrl} alt={m.name} width={80} height={40} />
          <span className="text-xs mt-1">{m.name}</span>
        </button>
      ))}
    </div>
  );
}
