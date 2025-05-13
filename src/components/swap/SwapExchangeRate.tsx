import { Card, Text, Group, Button, Box, Stack, useMantineTheme } from '@mantine/core';
import styles from './SwapExchangeRate.module.scss'
import { useSwapContext } from './SwapProvider';

const SwapExchangeRate = () => {

  const { setTokenFrom, setTokenTo, tokenFrom, tokenTo } = useSwapContext();

  return (
    <Group justify="right" align="center" gap={0}>
      {tokenFrom && tokenTo && <Text size="xxs" c="#C3FFFB" fw={500}>
        1 {tokenFrom?.symbol} ≈ 146.032309 {tokenTo?.symbol}
      </Text>}
      <span className="icon-reverse" style={{ color: "#C3FFFB", paddingLeft: '4px', paddingRight: '8px' }} />
      <RefreshButton />
    </Group>
  )
}

export default SwapExchangeRate


const RefreshButton = () => {
  return (
    <button className={styles.button} onClick={() => console.log('Refresh clicked')}>
      <span className="icon-refresh" />
    </button>
  )
}
