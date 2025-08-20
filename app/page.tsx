import Image from 'next/image';

export default function Page(){
  return (
    <main className="grid" style={{gridTemplateRows:'12vh calc(100vh - 12vh)'}}>
      {/* Карусель моделей */}
      <header className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Image src="/brand/destyle_gray_alfa.png" alt="brand" width={120} height={30}/>
          <h1 className="text-lg text-gray-700">Конфигуратор</h1>
        </div>
        <div className="text-sm text-gray-600">RU | KZ | HY</div>
      </header>

      {/* Три колонки 20/40/40 */}
      <section className="grid" style={{gridTemplateColumns:'20vw 40vw 40vw', height:'100%'}}>
        {/* Левая колонка */}
        <div className="grid" style={{gridTemplateRows:'1fr 10%'}}>
          <div className="p-3">
            <h2 className="font-semibold mb-2">Параметры</h2>
            <div className="space-y-2 text-sm text-gray-700">
              <div>Ткань / Цвет</div>
              <div>Ножки / Цвет</div>
              <div>Аксессуары (пуф/кресло/подушки)</div>
            </div>
          </div>
          <div className="p-3">
            <button className="w-full py-2 rounded text-white" style={{background:'var(--brand-red)'}} disabled>
              Скачать (неактивно)
            </button>
          </div>
        </div>

        {/* Центр */}
        <div className="grid" style={{gridTemplateRows:'1fr 10%'}}>
          <div className="p-3">
            <h2 className="font-semibold mb-2">Доступные модули</h2>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded p-2 text-sm">KSL_2</div>
              <div className="border rounded p-2 text-sm">CORNER_L</div>
              <div className="border rounded p-2 text-sm">KSR_2</div>
            </div>
          </div>
          <div className="p-3 flex gap-2">
            <button className="px-3 py-2 rounded bg-blue-600 text-white opacity-50" disabled>Отмена</button>
            <div className="text-sm text-gray-600 flex items-center">Добавьте модули слева направо</div>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="grid" style={{gridTemplateRows:'1fr 1fr'}}>
          <div className="relative p-3">
            <div className="absolute right-4 top-4 text-sm text-gray-700 bg-white/70 px-2 py-1 rounded">
              Ш×Г: 0×0 мм · Места: 0
            </div>
            <div className="h-full w-full rounded border border-gray-300 bg-gray-100 flex items-center justify-center text-gray-500">
              SVG‑сцена (пан/зум)
            </div>
          </div>
          <div className="p-3">
            <h2 className="font-semibold mb-2">Выбранные модули</h2>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-600"><th>№</th><th>SKU</th><th>Название</th><th>Размеры</th><th>Места</th></tr></thead>
              <tbody><tr><td colSpan={5} className="text-center py-4 text-gray-500">Пока пусто</td></tr></tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
