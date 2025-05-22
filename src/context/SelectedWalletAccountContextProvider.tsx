import {
    getUiWalletAccountStorageKey,
    UiWallet,
    UiWalletAccount,
    uiWalletAccountBelongsToUiWallet,
    uiWalletAccountsAreSame,
    useWallets,
} from '@wallet-standard/react';
import { useEffect, useMemo, useState } from 'react';

import { SelectedWalletAccountContext, SelectedWalletAccountState } from './SelectedWalletAccountContext';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core';


const STORAGE_KEY = 'solana-wallet-standard-example-react:selected-wallet-and-address';

let wasSetterInvoked = false;
function getSavedWalletAccount(wallets: readonly UiWallet[]): UiWalletAccount | undefined {
    if (wasSetterInvoked) {
        // After the user makes an explicit choice of wallet, stop trying to auto-select the
        // saved wallet, if and when it appears.
        return;
    }
    const savedWalletNameAndAddress = localStorage.getItem(STORAGE_KEY);

    if (!savedWalletNameAndAddress || typeof savedWalletNameAndAddress !== 'string') {
        return;
    }
    const [savedWalletName, savedAccountAddress] = savedWalletNameAndAddress.split(':');

    if (!savedWalletName || !savedAccountAddress) {
        return;
    }
    // console.log({ savedWalletNameAndAddress,savedWalletName, savedAccountAddress });

    for (const wallet of wallets) {
        if (wallet.name === savedWalletName) {
            for (const account of wallet.accounts) {
                if (account.address === savedAccountAddress) {
                    return account;
                }
            }
        }
    }
}


function getSavedWalletAccountToConnect(wallets: readonly UiWallet[]): UiWallet | undefined {
    if (wasSetterInvoked) {
        // After the user makes an explicit choice of wallet, stop trying to auto-select the
        // saved wallet, if and when it appears.
        return;
    }

    const savedWalletNameAndAddress = localStorage.getItem(STORAGE_KEY);

    if (!savedWalletNameAndAddress || typeof savedWalletNameAndAddress !== 'string') {
        return;
    }
    const [savedWalletName, savedAccountAddress] = savedWalletNameAndAddress.split(':');

    if (!savedWalletName || !savedAccountAddress) {
        return;
    }

    const supportedWallets = getSupportedWallets(wallets);
    for (const wallet of supportedWallets) {
        if (wallet.name === savedWalletName) {
            return wallet;
        }
    }
}

function getSupportedWallets(wallets: readonly UiWallet[]): UiWallet[] {
    const walletsThatSupportStandardConnect = [];
    const unconnectableWallets = [];
    for (const wallet of wallets) {
        if (wallet.features.includes(StandardConnect) && wallet.features.includes(StandardDisconnect)) {
            walletsThatSupportStandardConnect.push(wallet);
        } else {
            unconnectableWallets.push(wallet);
        }
    }

    return walletsThatSupportStandardConnect;
}

/**
 * Saves the selected wallet account's storage key to the browser's local storage. In future
 * sessions it will try to return that same wallet account, or at least one from the same brand of
 * wallet if the wallet from which it came is still in the Wallet Standard registry.
 */
export function SelectedWalletAccountContextProvider({ children }: { children: React.ReactNode }) {

    // const { displayName: currentChainName, chain, setChain } = useContext(ChainContext);
    // console.log({
    //     currentChainName,
    //     chain,
    //     setChain
    // })

    const wallets = useWallets();
    
    // const [walletAccount, setWalletAccount] = useState<UiWalletAccount | undefined>(undefined);

    const [selectedWalletAccount, setSelectedWalletAccountInternal] = useState<SelectedWalletAccountState>(() =>
        getSavedWalletAccount(wallets),
    );
    const [wallet, setWallet] = useState<UiWallet | undefined>(() =>
        getSavedWalletAccountToConnect(wallets),
    );



    const setSelectedWalletAccount: React.Dispatch<
        React.SetStateAction<SelectedWalletAccountState>
    > = setStateAction => {
        setSelectedWalletAccountInternal(prevSelectedWalletAccount => {
            wasSetterInvoked = true;
            const nextWalletAccount =
                typeof setStateAction === 'function' ? setStateAction(prevSelectedWalletAccount) : setStateAction;
            console.log({ nextWalletAccount })
            const accountKey = nextWalletAccount ? getUiWalletAccountStorageKey(nextWalletAccount) : undefined;
            if (accountKey) {
                localStorage.setItem(STORAGE_KEY, accountKey);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
            return nextWalletAccount;
        });
    };



    useEffect(() => {
        const savedWalletAccount = getSavedWalletAccount(wallets);
        if (savedWalletAccount) {
            setSelectedWalletAccountInternal(savedWalletAccount);
        } 
        // else {
        //     // found the wallet from localStorage , and try to connect
        //     const walletToConnect = getSavedWalletAccountToConnect(wallets)

        // }
    }, [wallets]);

    // const autoConnectAttempted = useRef(false);

    // useEffect(() => {
    //     // Only attempt auto-connect once per mount
    //     if (autoConnectAttempted.current) return;
    //     autoConnectAttempted.current = true;

    //     const walletToConnect = getSavedWalletAccountToConnect(wallets);
    //     if (!walletToConnect) return;

    //     const [ isConnecting, connect ] = useConnect(walletToConnect);

    //     const a = connect()

    //     // if (walletToConnect && walletToConnect.features[StandardConnect]) {
    //     //     // Call the connect method
    //     //     walletToConnect.features[StandardConnect].connect()
    //     //         .then((accounts) => {
    //     //             // Optionally select the first account or match the saved address
    //     //             if (accounts && accounts.length > 0) {
    //     //                 // Try to match the saved account address
    //     //                 const saved = localStorage.getItem(STORAGE_KEY);
    //     //                 const [, savedAccountAddress] = saved ? saved.split(':') : [];
    //     //                 const matched = accounts.find(acc => acc.address === savedAccountAddress);
    //     //                 setSelectedWalletAccountInternal(matched || accounts[0]);
    //     //             }
    //     //         })
    //     //         .catch(() => {
    //     //             // Optionally handle error (e.g., user rejected)
    //     //         });
    //     // }
    // }, [wallets]);

    // const walletToConnect = getSavedWalletAccountToConnect(wallets);
    // const [ isConnecting, connect ] = useConnect(walletToConnect);

    // // useEffect(() => {
    // //     if (!walletToConnect) return;
    // //     connect()
    // // }, [walletToConnect]);

    const walletAccount = useMemo(() => {
        if (selectedWalletAccount) {
            for (const uiWallet of wallets) {
                for (const uiWalletAccount of uiWallet.accounts) {
                    if (uiWalletAccountsAreSame(selectedWalletAccount, uiWalletAccount)) {
                        return uiWalletAccount;
                    }
                }
                if (uiWalletAccountBelongsToUiWallet(selectedWalletAccount, uiWallet) && uiWallet.accounts[0]) {
                    // If the selected account belongs to this connected wallet, at least, then
                    // select one of its accounts.
                    return uiWallet.accounts[0];
                }
            }
        }
    }, [selectedWalletAccount, wallets]);


    const walletProvider = useMemo(() => {
        if (selectedWalletAccount) {
            for (const uiWallet of wallets) {
                for (const uiWalletAccount of uiWallet.accounts) {
                    if (uiWalletAccountsAreSame(selectedWalletAccount, uiWalletAccount)) {
                        return uiWallet;
                    }
                }
                if (uiWalletAccountBelongsToUiWallet(selectedWalletAccount, uiWallet) && uiWallet.accounts[0]) {
                    // If the selected account belongs to this connected wallet, at least, then
                    // select one of its accounts.
                    return uiWallet;
                }
            }
        }
    }, [selectedWalletAccount, wallets]);

    useEffect(() => {
        // If there is a selected wallet account but the wallet to which it belongs has since
        // disconnected, clear the selected wallet.
        if (selectedWalletAccount && !walletAccount) {
            setSelectedWalletAccountInternal(undefined);
        }
    }, [selectedWalletAccount, walletAccount]);

    // useEffect(() => {
    //     const savedWalletNameAndAddress = localStorage.getItem(STORAGE_KEY);
    //     if (!savedWalletNameAndAddress) return;
    //     const [savedWalletName, savedWalletAddress] = savedWalletNameAndAddress.split(':');

    //     // Find the wallet object
    //     const wallet = wallets.find(w => w.name === savedWalletName);       // wallet object filtered by provider name
    //     // 

    //     const account = wallet?.accounts.find(a => a.address === savedWalletAddress); // account object filtered by address

    //     console.log({ wallets, wallet, account, savedWalletName, savedWalletAddress });
    //     // if (account) {
    //     //     setWallet(wallet); // set the wallet state
    //     //     setSelectedWalletAccount(account); // set the selected wallet account

    //     //     // Save the selected wallet account to local storage
    //     //     // localStorage.setItem(STORAGE_KEY, `${wallet.name}:${account.address}`);

    //     // } else {
    //     //     setWallet(undefined); // reset the wallet state if no account is found
    //     // }


    //     // console.log({ wallet, account });
    //     // If your wallet adapter exposes a connect() method, call it here
    //     // if (wallet && typeof wallet.features .connect === 'function') {
    //     //     wallet.connect().catch(() => {});
    //     // }
    // }, [wallets]);

    // console.log({
    //     walletAccount,
    //     walletConnected
    // })
    // console.log({ SelectedWalletAccountContextProvider: wallet })

    return (
        <SelectedWalletAccountContext.Provider
            value={useMemo(() => [
                walletAccount,
                setSelectedWalletAccount,
                walletProvider,
                wallet,
            ], [walletAccount])}
        >
            {children}
        </SelectedWalletAccountContext.Provider>
    );
}