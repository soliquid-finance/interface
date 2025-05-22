import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import type { UiWallet } from '@wallet-standard/react';
import { useConnect } from '@wallet-standard/react';
import { SelectedWalletAccountContext } from './SelectedWalletAccountContext';

type SolanaContextType = {
    connected: boolean;
};

type SolanaProviderProps = {
    children: ReactNode;
};

function AutoConnect({ wallet }: { wallet: UiWallet }) {
    const [isConnecting, connect] = useConnect(wallet);
    const autoConnectAttempted = React.useRef<UiWallet | null>(null);

    useEffect(() => {
        if (
            wallet &&
            wallet.accounts.length === 0 &&
            autoConnectAttempted.current !== wallet
        ) {
            autoConnectAttempted.current = wallet;
            connect();
        }
    }, [wallet, connect]);

    return null;
}

export const SolanaProvider: React.FC<SolanaProviderProps> = ({ children }) => {
    const [selectedWalletAccount, setSelectedWalletAccount, walletProvider, wallet] = useContext(SelectedWalletAccountContext);

    const isConnected = !!selectedWalletAccount;
    
    return (
        <SolanaContext.Provider value={{ connected: isConnected }}>
            {wallet ? <AutoConnect wallet={wallet} /> : null}
            {children}
        </SolanaContext.Provider>
    );
};

export const SolanaContext = createContext<SolanaContextType>({
    connected: false,
});