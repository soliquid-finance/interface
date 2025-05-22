import type { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { createContext } from 'react';

export type SelectedWalletAccountState = UiWalletAccount | undefined;

export const SelectedWalletAccountContext = createContext<
    readonly [
        selectedWalletAccount: SelectedWalletAccountState,
        setSelectedWalletAccount: React.Dispatch<React.SetStateAction<SelectedWalletAccountState>>,
        walletProvider: UiWallet | undefined,
        wallet: UiWallet | undefined,       // wallet to connect to
    ]
>([
    undefined /* selectedWalletAccount */,
    function setSelectedWalletAccount() {
        /* empty */
    },
    undefined /* walletProvider */,
    undefined /* wallet */,
]);
