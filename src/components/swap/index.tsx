import { Card, Text, Group, Button, Box, Stack, useMantineTheme } from '@mantine/core';
import { useState, useRef, useEffect } from 'react';

import { PortionChip } from '@/components/PortionChip';
import TokenSelect from './TokenSelect';
import SwapSetting from './SwapSetting';
import SwapButton from '@/components/solana/SwapButton';
import NetworkFeeSection from './NetworkFeeSection';
import { useSwapContext } from './SwapProvider';

import styles from './SwapForm.module.css';

import SwapExchangeRate from './SwapExchangeRate';
import { useWallet } from '@solana/wallet-adapter-react';
import TokenBalance from './TokenBalance'; // Import the new component
import { Connection, PublicKey } from '@solana/web3.js';
import { useCluster } from '../solana/providers';

const SwapForm = () => {

  const { publicKey, wallet, connected } = useWallet();
  const { cluster, getExplorerUrl } = useCluster();

  const theme = useMantineTheme();
  const { setTokenFrom, setTokenTo, tokenFrom, tokenTo, setSwapFromAmount, swapFromAmount, isTokenFromBalanceSufficient } = useSwapContext();
  const [highlightedCard, setHighlightedCard] = useState<'from' | 'to'>('from'); // Track which card is highlighted

  const inputFromRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputFromRef.current?.focus();
    setHighlightedCard('from'); // Highlight the "from" card by default
  }, []);

  const handleSwap = () => {
    const tempToken = tokenFrom;
    setTokenFrom(tokenTo);
    setTokenTo(tempToken);
  };

  const handlePortionClick = async (portion: number) => {
    if (connected && publicKey && tokenFrom) {
      try {
        const connection = new Connection(cluster.endpoint); // Replace with appropriate network URL
        let balance = 0;

        if (tokenFrom.symbol === 'SOL') {
          const lamports = await connection.getBalance(publicKey);
          balance = lamports / 1e9; // Convert lamports to SOL
        } else {
          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            mint: new PublicKey(tokenFrom.address),
          });
          const tokenAccount = tokenAccounts.value.find(
            (account) => account.account.data.parsed.info.tokenAmount.uiAmount
          );
          balance = tokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0;
        }

        const calculatedAmount = balance > 0 ? (balance * portion).toFixed(tokenFrom.decimals) : '0';
        setSwapFromAmount(calculatedAmount);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setSwapFromAmount('0');
      }
    } else {
      setSwapFromAmount('0');
    }
  };

  const handleCardClickFrom = () => {
    inputFromRef.current?.focus();
    setHighlightedCard('from'); // Highlight the "from" card
  };

  const handleCardClickTo = () => {
    setHighlightedCard('to'); // Highlight the "to" card
  };

  return (
    <Stack align="center" w="100%" maw="450px" miw="300px">
      <Box className={styles.header}>
        <SwapSetting />
        <SwapExchangeRate />
      </Box>
      <Box className={styles.content}>
        <Card
          classNames={{
            root: `${styles.swapCard} ${highlightedCard === 'from' ? styles.swapCardFocused : ''}`,
          }}
          onClick={handleCardClickFrom} // Add click handler for the "from" card
        >
          <Group justify="space-between" align="center">
            <Box className={styles.cardTitle}>Pay</Box>
            {connected &&
              <Group gap="xs">
                {tokenFrom && (
                  <TokenBalance
                    style={{
                      color: isTokenFromBalanceSufficient ? 'inherit' : '#FF4800',
                    }}
                  />
                )}
                <PortionChip text="50%" onClick={() => handlePortionClick(0.5)} />
                <PortionChip text="100%" onClick={() => handlePortionClick(1)} />
              </Group>
            }
          </Group>
          <Group justify='space-between' align="start" pt={20} h={52}>
            <TokenSelect
              initialToken={tokenFrom}
              onSelect={(token) => setTokenFrom(token)}
            />
            <input
              id="swap-input-from"
              type="text"
              placeholder="0.00"
              value={swapFromAmount}
              onChange={(e) => setSwapFromAmount(e.target.value)}
              className={styles.input}
              style={{
                color: isTokenFromBalanceSufficient ? '#FFFFFF' : '#FF4800',
              }}
              onFocus={() => setHighlightedCard('from')}
              ref={inputFromRef} // Attach the ref to the input
            />
          </Group>
          <Group justify="flex-end" align="center">
            <Text size="xxs" c="#627170" fw={400}>
              $0
            </Text>
          </Group>
        </Card>

        <Button
          id="swap-button"
          variant="subtle"
          className={styles.swapButton}
          onClick={handleSwap}
        >
          <span className="icon-arrow-down" />
        </Button>

        <Card
          classNames={{
            root: `${styles.swapCard} ${highlightedCard === 'to' ? styles.swapCardFocused : ''}`,
          }}
          onClick={handleCardClickTo} // Add click handler for the "to" card
        >
          <Group justify="space-between" align="center">
            <Box className={styles.cardTitle}>Receive</Box>
            {connected && <Group gap="xs">
              <Group style={{ gap: '4px' }}>
                <span className="icon-wallet" style={{ fontSize: '10px' }} />
                <Text size="xxs" fw={400}>
                  0.000 {tokenTo?.symbol || ''}
                </Text>
              </Group>
            </Group>
            }
          </Group>
          <Group justify='space-between' align="start" pt={20} h={52} >
            <TokenSelect
              initialToken={tokenTo}
              onSelect={(token) => setTokenTo(token)}
            />
            <input
              id="swap-input-to"
              type="text"
              placeholder="0.00"
              className={styles.input}
              onFocus={() => setHighlightedCard('to')}
            />
          </Group>
          <Group justify="flex-end" align="center">
            <Text size="xxs" c="#627170" fw={400}>
              $0
            </Text>
          </Group>
        </Card>
      </Box>
      <SwapButton />
      <NetworkFeeSection />
    </Stack>
  );
};

export default SwapForm;

