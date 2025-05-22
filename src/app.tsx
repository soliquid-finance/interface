import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/nprogress/styles.layer.css';
import '@mantine/spotlight/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './styles/global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import { queryClient } from '@/api/query-client';

import { Router } from '@/routes/router';
import { theme } from '@/theme';

import { Toaster } from 'react-hot-toast';
import { ChainContextProvider } from './context/ChainContextProvider';
import { SelectedWalletAccountContextProvider } from './context/SelectedWalletAccountContextProvider';
import { RpcContextProvider } from './context/RpcContextProvider';
import { SolanaProvider } from './context/SolanaProvider';

export function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}

        <ChainContextProvider>
          <SelectedWalletAccountContextProvider>
            <RpcContextProvider>
              <SolanaProvider>

                <MantineProvider theme={theme} forceColorScheme='dark'>
                  <Notifications position="bottom-center" />
                  <NavigationProgress />
                  <Toaster />
                  <ModalsProvider>
                    <Router />
                  </ModalsProvider>
                </MantineProvider>
              </SolanaProvider>
            </RpcContextProvider>
          </SelectedWalletAccountContextProvider>
        </ChainContextProvider>

      </QueryClientProvider>
    </HelmetProvider>
  );
}
