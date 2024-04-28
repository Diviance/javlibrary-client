import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@/theme';
import { Header } from '@components/Header/Header';
import { WebSocketProvider } from '../context/websocketContext';
import NotificationsListener from '../context/notificationsContext';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Head>
        <title>JAV Library</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>
      <Header />
      <ModalsProvider>
        <WebSocketProvider>
          <NotificationsListener />
          <Component {...pageProps} />
        </WebSocketProvider>
      </ModalsProvider>
    </MantineProvider>
  );
}
