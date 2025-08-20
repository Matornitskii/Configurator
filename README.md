# Sofa Configurator (v1.1)

Полноэкранный конфигуратор диванов. Стек: Next.js 14 + TypeScript + Tailwind + Redux Toolkit + React Query. SVG‑сцена, угловые и П‑образные конфигурации, PDF экспорт (позже), админка (Supabase, позже).

## Быстрый старт
```bash
pnpm install
pnpm dev
```
Открой `http://localhost:3000`.

## Структура
- `app/` — страницы (`/` и `/admin`)
- `components/` — компоненты UI (заглушки)
- `features/builder/` — Redux‑слайс (минимум)
- `lib/geometry.ts` — геометрия/направление/размёты
- `public/mock/*.json` — мок‑данные (модули, модели, правила, аксессуары)
- `public/thumbs|scene` — примеры картинок модулей
- `public/i18n` — RU/KZ/HY строки
- `public/brand` — логотип

## Цвета/шрифт
- Фон — очень светло‑серый; акценты серые; главные кнопки — красные.
- Шрифт Comfortaa (или системный fallback).

## Мок‑данные
См. `/public/mock/*.json` — включены KSL_2, CORNER_L, KSR_2.

## Дальше
- Реализовать настоящие компоненты: ModelCarousel, OptionsPanel, ModuleGrid, ActionBar, AssemblyCanvas, ChosenList.
- Экспорт PDF через API `/api/export` (Playwright/Puppeteer).
- Подключить Supabase для `/admin`.
