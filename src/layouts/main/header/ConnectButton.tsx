import { useState, useContext, Suspense } from "react";
import { useMediaQuery } from '@mantine/hooks'; // Import useMediaQuery

// ui
import { Avatar, Button, Drawer, Group, Text, Box, Stack, Badge } from '@mantine/core';
import { shortenAddress } from '@/utils/shortenAddress'; // Utility to shorten addresses
import styles from './ConnectButton.module.css';
import { UiWallet, uiWalletAccountBelongsToUiWallet, useDisconnect, useWallets } from "@wallet-standard/react";

import { SelectedWalletAccountContext } from "@/context/SelectedWalletAccountContext";
import { ConnectWalletDialog } from "@/components/solana/ConnectWalletDialog";
import { ChainContext } from "@/context/ChainContext";
import { RxExternalLink, RxCopy } from "react-icons/rx";
import toast from "react-hot-toast";
import { Balance } from "@/components/solana/Balance";

export default function ConnectButton() {

    // const wallets = useWallets();
    const { displayName: currentChainName, chain, getExplorerUrl } = useContext(ChainContext);
    const [selectedWalletAccount, setSelectedWalletAccount, wallet] = useContext(SelectedWalletAccountContext);

    const [drawerOpened, setDrawerOpened] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width: 768px)'); // Detect mobile view
    const isConnected = !!selectedWalletAccount;

    let label = 'Connect';
    if (selectedWalletAccount && selectedWalletAccount?.address) {
        label = shortenAddress(selectedWalletAccount?.address);
    }


    // const handleButtonClick = () => {
    //     setOpened(true);
    // }

    const handleButtonClick = () => {
        if (isConnected) {
            setDrawerOpened(true);
        } else {
            setModalOpen(true);
        }
    };

    const onError = (error: Error) => {
        alert(error.message);
    }

    // console.log({
    //     wallet,
    //     wallets,
    //     isConnected,
    //     selectedWalletAccount
    // })


    const handleCopyAddress = (address: string) => {
        if (address) {
            navigator.clipboard.writeText(address);
            toast.success('Address copied to clipboard!');
        }
    };

    return (
        <>
            <Button
                classNames={{
                    root: styles.root,
                    label: styles.label
                }}
                onClick={handleButtonClick}
            >
                {selectedWalletAccount && selectedWalletAccount?.address ? (<Avatar
                    src={wallet?.icon}
                    alt={wallet?.name}
                    size={16}
                    radius="xl"
                    mr={!isMobile ? "xs" : 0}
                />) : (<span className="icon-wallet" />)}
                {!isMobile && label}
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
                    {selectedWalletAccount && (
                        <Box mb="md">
                            <Badge className={styles.networkBadge} size="sm">
                                {currentChainName}
                                {/* {cluster?.name} */}
                            </Badge>
                            <Group justify="space-between" align="center">
                                <Group gap="xs">
                                    <Text size="xs" c="primary.9" style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                        {shortenAddress(selectedWalletAccount.address, 8)}
                                    </Text>
                                    <Button
                                        className={styles.iconButton}
                                        onClick={() => handleCopyAddress(selectedWalletAccount.address)}
                                        variant="subtle"
                                        size="xs"
                                    >
                                        <RxCopy size={16} />
                                    </Button>
                                </Group>
                                <Button
                                    className={styles.iconButton}
                                    component="a"
                                    href={getExplorerUrl?.(`address/${selectedWalletAccount.address}`)}
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
                                <Suspense fallback={null}>
                                    <Balance account={selectedWalletAccount} />
                                </Suspense>
                                {/* <Text size="sm" fw={400} c="#627170">
                                    ~{balance !== null ? balance.toFixed(4) : '0'} SOL
                                </Text> */}
                            </Stack>
                        </Box>
                    )}
                    {wallet && <DisconnectButton
                        wallet={wallet}
                        onDisconnect={async (wallet: UiWallet) => {
                            if (selectedWalletAccount && uiWalletAccountBelongsToUiWallet(selectedWalletAccount, wallet)) {
                                console.log('Disconnecting wallet:', wallet);
                                setSelectedWalletAccount(undefined);
                            }
                        }}
                    />}
                </Box>
            </Drawer>
            <ConnectWalletDialog
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
                // onAccountSelect={setSelectedWalletAccount}
                onError={() => onError}
            />
        </>
    );
}



type DisconnectButtonProps = {
    wallet: UiWallet;
    onDisconnect: (wallet: UiWallet) => void;
};

const DisconnectButton = ({ wallet, onDisconnect }: DisconnectButtonProps) => {
    const [isDisconnecting, disconnect] = useDisconnect(wallet);

    const onClick = async () => {
        await disconnect();
        onDisconnect(wallet);
        
        // window.location.reload(); // Refresh the page after disconnect
    }

    return (
        <Button
            fullWidth
            classNames={{
                root: styles.disconnectButton,
            }}
            onClick={onClick}
        >
            Disconnect
        </Button>
    )
}