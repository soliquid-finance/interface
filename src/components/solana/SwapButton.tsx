import { useState } from "react";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";

import { Button } from '@mantine/core';
import { WalletModalConfig, WalletSelectionModal } from "./WalletSelectionModal";

import styles from './SwapButton.module.css';
import { useSwapContext } from "@/components/swap/SwapProvider";

export default function SwapButton() {

    const { isTokenFromBalanceSufficient } = useSwapContext();
    const [walletModalConfig, setWalletModalConfig] = useState<Readonly<WalletModalConfig> | null>(null);
    const { buttonState, onConnect, onDisconnect, onSelectWallet } = useWalletMultiButton({
        onSelectWallet: setWalletModalConfig,
    });
    let label;
    switch (buttonState) {
        case 'connected':
            label = isTokenFromBalanceSufficient ?  'Swap' : 'Insufficient SOL';
            break;
        case 'connecting':
            label = 'Connecting';
            break;
        case 'disconnecting':
            label = 'Disconnecting';
            break;
        case 'has-wallet':
            label = 'Connect Wallet';
            break;
        case 'no-wallet':
            label = 'Connect Wallet';
            break;
    }

    const handleSelectWallet = () => {
        setWalletModalConfig(null);

    };

    return (
        <>
            <Button
                variant="filled"
                classNames={{
                    root: styles.root,
                }}
                style={
                    buttonState === 'no-wallet' || buttonState === 'has-wallet'
                        ? {
                            display: 'flex',
                            width: '100%',
                            padding: '18px 0px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: '16px',
                            background: '#C3FFFB',
                            color: '#000',
                            textAlign: 'center',
                            fontFamily: 'Inter',
                            fontSize: '18px',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: 'normal',
                        }
                        : isTokenFromBalanceSufficient
                            ? {
                                display: 'flex',
                                width: '100%',
                                padding: '18px 0px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '16px',
                                background: 'linear-gradient(91deg, #C3FFFB 1.51%, #89FFF7 98.57%)',
                            }
                            : {
                                display: 'flex',
                                width: '100%',
                                padding: '18px 156px 18px 155px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '16px',
                                border: '0.5px solid rgba(195, 255, 251, 0.05)',
                                background: '#121A1A',
                                color: '#627170',
                                textAlign: 'center',
                                fontFamily: 'Inter',
                                fontSize: '18px',
                                fontStyle: 'normal',
                                fontWeight: 600,
                                lineHeight: 'normal',
                            }

                }
                disabled={buttonState === 'connecting' || buttonState === 'disconnecting' || !isTokenFromBalanceSufficient}
                onClick={() => {
                    switch (buttonState) {
                        case 'connected':
                            if (isTokenFromBalanceSufficient) return;
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
                {label}
            </Button>
            <WalletSelectionModal config={walletModalConfig} onClose={handleSelectWallet} />
        </>
    );
}


