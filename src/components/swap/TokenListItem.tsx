import { Group, Text } from '@mantine/core';
import styles from './TokenListItem.module.css';

interface TokenListItemProps {
  token: {
    address: string;
    name: string;
    symbol: string;
    logoURI: string;
  };
  onClick: () => void;
}

export default function TokenListItem({ token, onClick }: TokenListItemProps) {
  // Format the token address to show the first 5 and last 5 characters
  const formattedAddress = `${token.address.slice(0, 5)}...${token.address.slice(-5)}`;

  return (
    <Group
      onClick={onClick}
      className={styles.tokenListItem}
    >
      <div
        className={styles.tokenAvatar}
        style={{
          backgroundImage: `url('${token.logoURI}')`,
        }}
      />
      <div className={styles.tokenDetails}>
        <div className={styles.tokenSymbol}>
          {token.symbol}
        </div>
        <div className={styles.tokenName}>
          {token.name}
        </div>
        <div className={styles.tokenAddress}>
          {formattedAddress}
        </div>
      </div>
    </Group>
  );
}
