import { useCallback, useContext, useRef, useState } from 'react';
import { Modal, Loader, Text } from '@mantine/core';

import { useWallets, useConnect } from '@wallet-standard/react';
import type { UiWallet } from '@wallet-standard/react';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core';

import styles from './ConnectWalletDialog.module.css';
import { SelectedWalletAccountContext } from '@/context/SelectedWalletAccountContext';
import { ConnectWalletMenuItem } from './ConnectWalletMenuItem';

interface ConnectWalletDialogProps {
    opened: boolean;
    onClose: () => void;
    // onAccountSelect: (account: import('@wallet-standard/react').UiWalletAccount) => void;
    onError: () => void;
}

export function ConnectWalletDialog({ opened, onClose, onError }: ConnectWalletDialogProps) {

    const wallets = useWallets();
    const [selectedWalletAccount, setSelectedWalletAccount] = useContext(SelectedWalletAccountContext);

    // filter out wallets that support StandardConnect and StandardDisconnect
    const walletsThatSupportStandardConnect = [];
    const unconnectableWallets = [];
    for (const wallet of wallets) {
        if (wallet.features.includes(StandardConnect) && wallet.features.includes(StandardDisconnect)) {
            walletsThatSupportStandardConnect.push(wallet);
        } else {
            unconnectableWallets.push(wallet);
        }
    }

    const { current: NO_ERROR } = useRef(Symbol());
    const [error, setError] = useState(NO_ERROR);

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Connect a wallet on Solana"
            centered
            overlayProps={{ opacity: 1, blur: 3 }}
            withCloseButton={false}
            classNames={{
                content: styles.content,
                header: styles.header,
                title: styles.title,
                body: styles.body,
                close: styles.close,
            }}
        >
            <div>
                {walletsThatSupportStandardConnect.length === 0 && <Text>No wallets detected in this browser.</Text>}
                {walletsThatSupportStandardConnect.map((wallet, i) => <ConnectWalletMenuItem
                    key={i}
                    onAccountSelect={async (account) => {
                        setSelectedWalletAccount(account);
                        // const [isConnecting, connect] = useConnect(wallet);
                        // const existingAccounts = [...wallet.accounts];
                        // const nextAccounts = await connect();
                        onClose();
                    }}
                    onError={setError}
                    wallet={wallet}
                />
                )}
            </div>
        </Modal>
    );
}