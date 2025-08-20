'use client';

import { useEffect, useState } from 'react';

export function useI18n(lang: string){
  const [dict, setDict] = useState<Record<string,string>>({});
  useEffect(() => {
    let ignore = false;
    fetch(`/i18n/${lang}.json`).then(r => r.json()).then(d => {
      if(!ignore) setDict(d);
    }).catch(()=>setDict({}));
    return () => { ignore = true; };
  }, [lang]);
  const t = (key: string) => dict[key] ?? key;
  return { t };
}
