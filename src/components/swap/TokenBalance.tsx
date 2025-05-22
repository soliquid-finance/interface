
import { Group, Text } from '@mantine/core';
import { SolanaToken } from '@/types'; // Import from the centralized types file
import { useSwapContext } from './SwapProvider';

interface TokenBalanceProps {
  token: SolanaToken;
}

const TokenBalance = ({ style }: { style?: React.CSSProperties }) => {
  const { tokenFrom, tokenFromBalance } = useSwapContext();

  return (
    <Group style={{ gap: '4px', ...style }}>
      <span className="icon-wallet" style={{ fontSize: '10px', ...style }} />
      <Text size="xxs" fw={400} style={style}>
        {tokenFromBalance !== null ? `${tokenFromBalance} ${tokenFrom?.symbol}` : `0 ${tokenFrom?.symbol}`}
      </Text>
    </Group>
  );
};

export default TokenBalance;
