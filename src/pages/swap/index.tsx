import { SwapProvider } from '@/components/swap/SwapProvider';
import SwapForm from '@/components/swap';
import { Box } from '@mantine/core';

export default function HomePage() {
  return (
    <Box
      style={{
        background: '#070A0A',
        // minHeight: '100vh',
        paddingTop: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      
      <SwapProvider>
        <SwapForm />
      </SwapProvider>
    </Box>
  );
}
