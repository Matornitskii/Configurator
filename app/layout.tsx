export const metadata = { title: 'Sofa Configurator', description: 'Конфигуратор диванов' };
import './globals.css';

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
