import { mainnet, testnet } from '@solana/kit';
import { useMemo, useState } from 'react';

import { ChainContext, DEFAULT_CHAIN_CONFIG } from './ChainContext';

const STORAGE_KEY = 'solana-example-react-app:selected-chain';

export enum ClusterNetwork {
    Mainnet = 'solana:mainnet-beta',
    Testnet = 'solana:testnet',
    Devnet = 'solana:devnet',
    Custom = 'solana:custom',
}

export function ChainContextProvider({ children }: { children: React.ReactNode }) {
    const [chain, setChain] = useState(() => localStorage.getItem(STORAGE_KEY) ?? 'solana:devnet');
    const contextValue = useMemo<ChainContext>(() => {
        switch (chain) {
            case ClusterNetwork.Mainnet:
                if (process.env.REACT_EXAMPLE_APP_ENABLE_MAINNET === 'true') {
                    return {
                        chain: 'solana:mainnet',
                        displayName: 'Mainnet Beta',
                        solanaExplorerClusterName: 'mainnet-beta',
                        solanaRpcSubscriptionsUrl: mainnet('wss://api.mainnet-beta.solana.com'),
                        solanaRpcUrl: mainnet('https://api.mainnet-beta.solana.com'),
                    };
                }
            // falls through
            case ClusterNetwork.Testnet:
                return {
                    chain: 'solana:testnet',
                    displayName: 'Testnet',
                    solanaExplorerClusterName: 'testnet',
                    solanaRpcSubscriptionsUrl: testnet('wss://api.testnet.solana.com'),
                    solanaRpcUrl: testnet('https://api.testnet.solana.com'),
                };
            case ClusterNetwork.Devnet:
            default:
                if (chain !== 'solana:devnet') {
                    localStorage.removeItem(STORAGE_KEY);
                    console.error(`Unrecognized chain \`${chain}\``);
                }
                return DEFAULT_CHAIN_CONFIG;
        }
    }, [chain]);


    const getExplorerUrl = (path: string) => `https://explorer.solana.com/${path}${getClusterUrlParam(chain)}`;
    

    const getClusterUrlParam = (cluster: string): string => {
        let suffix = ''
        switch (cluster) {
            case ClusterNetwork.Devnet:
                suffix = 'devnet'
                break
            case ClusterNetwork.Mainnet:
                suffix = ''
                break
            case ClusterNetwork.Testnet:
                suffix = 'testnet'
                break
            default:
                suffix = 'devnet'
                // suffix = `devnet&customUrl=${encodeURIComponent(cluster.endpoint)}`
                break
        }

        return suffix.length ? `?cluster=${suffix}` : ''
    }

    return (
        <ChainContext.Provider
            value={useMemo(
                () => ({
                    ...contextValue,
                    setChain(chain) {
                        localStorage.setItem(STORAGE_KEY, chain);
                        setChain(chain);
                    },
                    getExplorerUrl,
                }),
                [contextValue],
            )}
        >
            {children}
        </ChainContext.Provider>
    );
}

