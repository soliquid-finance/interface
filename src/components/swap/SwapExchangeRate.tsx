import { Text, Group } from '@mantine/core';
import styles from './SwapExchangeRate.module.css'
import { useSwapContext } from './SwapProvider';

const SwapExchangeRate = () => {

  const { tokenFrom, tokenTo } = useSwapContext();

  return (
    <Group justify="right" align="center" gap={0}>
      {tokenFrom && tokenTo && <Text size="xxs" c="#C3FFFB" fw={500}>
        1 {tokenFrom?.symbol} ≈ 146.032309 {tokenTo?.symbol}
      </Text>}
      <span className={`icon-reverse ${styles.swapButton}`}  />
      <RefreshButton />
    </Group>
  )
}

export default SwapExchangeRate


const RefreshButton = () => {
  return (
    <button className={styles.circleIconButton} onClick={() => console.log('Refresh clicked')}>
      <span className="icon-refresh" />
    </button>
  )
}
