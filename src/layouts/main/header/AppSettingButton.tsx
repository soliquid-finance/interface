import { useContext } from 'react';
import { Menu, Button, Text } from '@mantine/core';
import { PiGear } from 'react-icons/pi';
// import { useCluster } from '@/components/solana/providers/ClusterProvider';
import styles from './AppSettingButton.module.css';
import { ChainContext } from '@/context/ChainContext';

const ENABLE_MAINNET = import.meta.env.VITE_EXAMPLE_APP_ENABLE_MAINNET === 'true';

export default function AppSettingButton() {
  // const { clusters, setCluster, cluster } = useCluster();

  const { displayName: currentChainName, chain, setChain } = useContext(ChainContext);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          classNames={{
            root: styles.root,
            label: styles.label,
          }}
          variant="subtle"
        >
          <PiGear size={18} color="#C3FFFB" />
        </Button>
      </Menu.Target>
      {setChain && <Menu.Dropdown>
        <Text size="xs" fw={500} c="primary.4" px="sm" py="xs">
          Select RPC
        </Text>
        {ENABLE_MAINNET ? <Menu.Item
          key="solana:mainnet-beta"
          onClick={() => setChain('solana:mainnet-beta' as 'solana:${string}')}
          style={{
            backgroundColor: chain === "solana:mainnet-beta" ? '#2A3838' : 'transparent',
            color: chain === "solana:mainnet-beta" ? '#C3FFFB' : 'inherit',
          }}
        >
          Mainnet Beta
        </Menu.Item> : null
        }
        <Menu.Item
          key="solana:devnet"
          onClick={() => setChain('solana:devnet' as 'solana:${string}')}
          style={{
            backgroundColor: chain === "solana:devnet" ? '#2A3838' : 'transparent',
            color: chain === "solana:devnet" ? '#C3FFFB' : 'inherit',
          }}
        >
          Devnet
        </Menu.Item>
        <Menu.Item
          key="solana:testnet"
          onClick={() => setChain('solana:testnet' as 'solana:${string}')}
          style={{
            backgroundColor: chain === "solana:testnet" ? '#2A3838' : 'transparent',
            color: chain === "solana:testnet" ? '#C3FFFB' : 'inherit',
          }}
        >
          Testnet
        </Menu.Item>

      </Menu.Dropdown>
      }
    </Menu>
  );
}
