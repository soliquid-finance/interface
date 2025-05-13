import { WalletName } from "@solana/wallet-adapter-base";
import { Wallet } from "@solana/wallet-adapter-react";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useState } from "react";
import { Modal, Button } from '@mantine/core';
import styles from './WalletSelectionModal.module.css';

export interface WalletModalConfig {
    onSelectWallet(walletName: WalletName): void;
    wallets: Wallet[];
}

interface WalletSelectionModalProps {
    config: WalletModalConfig | null;
    onClose: () => void;
}

export const WalletSelectionModal = ({ config, onClose  } : WalletSelectionModalProps) => {

    return (<Modal
        opened={!!config}
        onClose={onClose}
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
        title="Connect a wallet on Solana"
    >
        {config?.wallets.map((wallet) => (
            <button
                className={styles.item}
                key={wallet.adapter.name}
                onClick={() => {
                    config.onSelectWallet(wallet.adapter.name);
                    onClose();
                }}
            >
                <img
                    src={wallet.adapter.icon}
                    alt={`${wallet.adapter.name} icon`}
                    style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                    }} />
                {wallet.adapter.name}
            </button>
        ))}
    </Modal>)
}