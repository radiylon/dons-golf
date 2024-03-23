import "@/styles/globals.css";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactElement, ReactNode } from "react";

type AppPropsWithLayout = AppProps & {
  Component: NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
};

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      {getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>
  );
}
