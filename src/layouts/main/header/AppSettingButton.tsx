import { useState } from 'react';
import { Menu, Button, Text, Box } from '@mantine/core';
import { PiGear } from 'react-icons/pi';
import { useCluster } from '@/components/solana/providers/ClusterProvider';
import styles from './AppSettingButton.module.css';

export default function AppSettingButton() {
  const { clusters, setCluster, cluster } = useCluster();

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
      <Menu.Dropdown>
        <Text size="xs" fw={500} c="primary.4" px="sm" py="xs">
          Select RPC
        </Text>
        {clusters.map((item) => (
          <Menu.Item
            key={item.name}
            onClick={() => setCluster(item)}
            style={{
              backgroundColor: cluster.name === item.name ? '#2A3838' : 'transparent',
              color: cluster.name === item.name ? '#C3FFFB' : 'inherit',
            }}
          >
            {item.name}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
