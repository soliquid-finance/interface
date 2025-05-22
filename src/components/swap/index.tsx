import { Card, Text, Group, Button, Box, Stack, useMantineTheme, NumberInput } from '@mantine/core';
import { useState, useRef, useEffect, useContext } from 'react';

import { PortionChip } from '@/components/PortionChip';
import TokenSelect from './TokenSelect';
import SwapSetting from './SwapSetting';
import SwapExchangeRate from './SwapExchangeRate';
import NetworkFeeSection from './NetworkFeeSection';
import SwapButton from '@/components/solana/SwapButton';

import styles from './SwapForm.module.css';

import { useSwapContext } from './SwapProvider';
import { SolanaContext } from '@/context/SolanaProvider';

import TokenBalance from './TokenBalance'; // Import the new component


const SwapForm = () => {
  const { connected } = useContext(SolanaContext);

  // const theme = useMantineTheme();
  const { setTokenFrom, setTokenTo, tokenFrom, tokenTo, tokenFromBalance, setAmountToSwapFrom, amountToSwapFrom, isTokenFromBalanceSufficient } = useSwapContext();
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
    setAmountToSwapFrom(0);
  };


  // Only fetch if both are defined and not SOL
  // const shouldFetchSpl = walletAddress && mintAddress && tokenFrom?.symbol !== 'SOL';

  const handlePortionClick = async (portion: number) => {
    if (tokenFromBalance) {
      setAmountToSwapFrom(portion * tokenFromBalance);
    } else {
      setAmountToSwapFrom(0)
    }
  };

  const handleCardClickFrom = () => {
    inputFromRef.current?.focus();
    setHighlightedCard('from'); // Highlight the "from" card
  };

  const handleCardClickTo = () => {
    setHighlightedCard('to'); // Highlight the "to" card
  };

  const handleTokenSwapFromInputChange = (value: string) => {
    // const value = e.target.value || '0';
    setAmountToSwapFrom(parseFloat(value));
  }

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
            <NumberInput
              id="input-amount-swap-from"
              classNames={{
                root: styles.inputRoot,
                input: `${styles.input} ${isTokenFromBalanceSufficient ? '' : styles.inputError}`,
              }}
              hideControls={true}
              value={amountToSwapFrom}
              onChange={(value) => handleTokenSwapFromInputChange(value?.toString() || '')}
              placeholder="0.00"
              inputMode='decimal'
              min={0}
              onFocus={() => setHighlightedCard('from')}
              ref={inputFromRef}
            // decimalScale={2}
            // fixedDecimalScale={true}
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
            <NumberInput
              id="input-amount-swap-to"
              classNames={{
                root: styles.inputRoot,
                input: styles.input,
              }}
              hideControls={true}
              // value={amountToSwapTo}
              // onChange={(value) => handleTokenSwapFromInputChange(value?.toString() || '')}
              placeholder="0.00"
              inputMode='decimal'
              min={0}
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

