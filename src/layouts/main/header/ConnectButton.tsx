import { useState, useEffect } from "react";
import { useMediaQuery } from '@mantine/hooks'; // Import useMediaQuery

// solana 
import { Connection, PublicKey } from '@solana/web3.js';
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWallet } from '@solana/wallet-adapter-react'

// ui
import { Avatar, Button, Drawer, Group, Text, Box, ActionIcon, Stack, Badge } from '@mantine/core';
import { WalletModalConfig, WalletSelectionModal } from "../../../components/solana/WalletSelectionModal";
import { shortenAddress } from '@/utils/shortenAddress'; // Utility to shorten addresses
import { useCluster } from "@/components/solana/providers";
import { RxExternalLink, RxCopy } from "react-icons/rx";
import toast from 'react-hot-toast';

import styles from './ConnectButton.module.css';

export default function ConnectButton() {

    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<WalletModalConfig> | null>(null);
    const { buttonState, onConnect, onDisconnect, onSelectWallet } = useWalletMultiButton({
        onSelectWallet: setWalletModalConfig,
    });

    const [drawerOpened, setDrawerOpened] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);

    const { cluster, getExplorerUrl } = useCluster();
    const { publicKey, wallet } = useWallet();
    const walletAddress = publicKey ? publicKey.toBase58() : '';

    const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile view

    useEffect(() => {
        if (publicKey) {
            const connection = new Connection(cluster.endpoint);
            connection.getBalance(publicKey).then((lamports) => {
                setBalance(lamports / 1e9); // Convert lamports to SOL
            });
        }
    }, [publicKey, cluster]);

    const handleCopyAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            toast.success('Address copied to clipboard!');
        }
    };

    let label;
    switch (buttonState) {
        case 'connected':
            //label = 'Disconnect';
            label = shortenAddress(walletAddress);
            break;
        case 'connecting':
            label = 'Connecting';
            break;
        case 'disconnecting':
            label = 'Disconnecting';
            break;
        case 'has-wallet':
            label = 'Connect';
            break;
        case 'no-wallet':
            label = 'Connect';
            break;
    }

    const handleSelectWallet = () => {
        setWalletModalConfig(null);
    };

    const handleButtonClick = () => {
        if (publicKey) {
            setDrawerOpened(true);
        }
    }

    // const getClusterBadgeColor = () => {
    //     switch (cluster.network) {
    //         case 'mainnet-beta':
    //             return 'green';
    //         case 'testnet':
    //             return 'yellow';
    //         case 'devnet':
    //             return 'blue';
    //         default:
    //             return 'gray';
    //     }
    // };

    return (
        <>
            <Button
                classNames={{
                    root: styles.root,
                    label: styles.label
                }}
                disabled={buttonState === 'connecting' || buttonState === 'disconnecting'}
                onClick={() => {
                    switch (buttonState) {
                        case 'connected':
                            handleButtonClick?.();
                            // onDisconnect?.();
                            break;
                        case 'connecting':
                        case 'disconnecting':
                            break;
                        case 'has-wallet':
                            onConnect?.();
                            break;
                        case 'no-wallet':
                            onSelectWallet?.();
                            break;
                    }
                }}
            >
                {buttonState == 'connected' ? (
                    <Avatar
                        src={wallet?.adapter.icon}
                        alt={wallet?.adapter.name}
                        size={16}
                        radius="xl"
                        mr={!isMobile ? "xs" : 0} // Adjust margin for mobile
                    />
                ) : (<span className="icon-wallet" />)}
                {!isMobile && label} {/* Hide label in mobile view */}
            </Button>
            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                position="right"
                size="sm"
                overlayProps={{ opacity: 0.5, blur: 3 }}
                withCloseButton={false}
            >
                <Box p="md">
                    {wallet && publicKey && (
                        <Box mb="md">
                            <Badge className={styles.networkBadge} size="sm">
                                {cluster.name}
                            </Badge>
                            <Group justify="space-between" align="center">
                                <Group gap="xs">
                                    <Text size="xs" c="primary.9" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        {shortenAddress(publicKey.toBase58(), 8)}
                                    </Text>
                                    <Button
                                        className={styles.iconButton}
                                        onClick={handleCopyAddress}
                                        variant="subtle"
                                        size="xs"
                                    >
                                        <RxCopy size={16} />
                                    </Button>
                                </Group>
                                <Button
                                    className={styles.iconButton}
                                    component="a"
                                    href={getExplorerUrl(`address/${publicKey.toBase58()}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="subtle"
                                    size="xs"
                                >
                                    <RxExternalLink size={16} />
                                </Button>
                            </Group>
                            <Stack gap={0} mt="xs">
                                <Text fw={900} className={styles.balance}>
                                    $0
                                </Text>
                                <Text size="sm" fw={400} c="#627170">
                                    ~{balance !== null ? balance.toFixed(4) : '0'} SOL
                                </Text>
                            </Stack>
                        </Box>
                    )}
                    <Button
                        fullWidth
                        classNames={{
                            root: styles.disconnectButton,
                        }}
                        onClick={() => {
                            onDisconnect?.();
                            setDrawerOpened(false);
                        }}
                    >
                        Disconnect
                    </Button>
                </Box>
            </Drawer>

            <WalletSelectionModal config={walletModalConfig} onClose={handleSelectWallet} />
        </>
    );
}


