// import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
// import { DropdownMenu, ThickChevronRightIcon } from '@radix-ui/themes';
import { SelectedWalletAccountContext } from '@/context/SelectedWalletAccountContext';
import type { UiWallet, UiWalletAccount } from '@wallet-standard/react';
import { uiWalletAccountsAreSame, useConnect, useDisconnect } from '@wallet-standard/react';
import { useCallback, useContext } from 'react';

// import { SelectedWalletAccountContext } from '../context/SelectedWalletAccountContext';
// import { WalletMenuItemContent } from './WalletMenuItemContent';

import styles from './ConnectWalletMenuItem.module.css';

type Props = Readonly<{
    onAccountSelect(account: UiWalletAccount | undefined): void;
    // onDisconnect(wallet: UiWallet): void;
    onError(err: unknown): void;
    wallet: UiWallet;
}>;

// export function ConnectWalletMenuItem({ onAccountSelect, onDisconnect, onError, wallet }: Props) {
export function ConnectWalletMenuItem({ onAccountSelect, onError, wallet }: Props) {

    const [isConnecting, connect] = useConnect(wallet);
    const [isDisconnecting, disconnect] = useDisconnect(wallet);
    const isPending = isConnecting || isDisconnecting;

    const isConnected = wallet.accounts.length > 0;         // check if wallet is connected

    const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);

    const handleConnectClick = useCallback(async () => {
        try {
            const existingAccounts = [...wallet.accounts];
            
            const nextAccounts = await connect();
            // Try to choose the first never-before-seen account.
            for (const nextAccount of nextAccounts) {
                if (!existingAccounts.some(existingAccount => uiWalletAccountsAreSame(nextAccount, existingAccount))) {
                    onAccountSelect(nextAccount);
                    return;
                }
            }
            // Failing that, choose the first account in the list.
            if (nextAccounts[0]) {
                onAccountSelect(nextAccounts[0]);
            }
        } catch (e) {
            onError(e);
        }
    }, [connect, onAccountSelect, onError, wallet.accounts]);


    return (
        <button
            key={wallet.name}
            className={styles.item}
            // onClick={() => handleConnect(wallet)}
            onClick={handleConnectClick}
            // disabled={!!connectingWallet}
            style={{ width: '100%' }}
        >
            {wallet.icon && (
                <img src={wallet.icon} alt={wallet.name} width={24} height={24} style={{ borderRadius: '50%' }} />

            )}
            {wallet.name}
            {/* {connectingWallet === wallet.name ? <Loader size="xs" /> : wallet.name} */}
        </button>
    );
}
