export const metadata = { title: 'Sofa Configurator', description: 'Конфигуратор диванов' };
import '../styles/globals.css';

import Providers from './providers';

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="ru">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
