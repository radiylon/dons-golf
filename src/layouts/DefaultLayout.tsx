import { ReactNode } from 'react';

interface DefaultLayoutProps {
  children: ReactNode;
}

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return <div className="flex flex-col px-12">{children}</div>;
}