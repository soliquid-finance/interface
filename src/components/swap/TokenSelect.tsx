import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { Text, Modal, TextInput, Group } from '@mantine/core';
import TokenListItem from './TokenListItem';
import { useCluster } from '@/components/solana/providers';
import clsx from 'clsx';
import styles from './TokenSelect.module.css';

import tokens from "./token.data";
import { SolanaToken } from '@/types';

interface TokenSelectProps {
    initialToken: SolanaToken | null;
    onSelect: (token: SolanaToken) => void;
    opened?: boolean;
    setOpened?: (opened: boolean) => void;
}

// Fetch tokens function
const fetchTokens = async (chainId: number): Promise<SolanaToken[]> => {
    const response = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
    const data = await response.json();
    return data.tokens.filter((token: SolanaToken) => token.chainId === chainId); // Filter by chainId
};

export default function TokenSelect({ initialToken, onSelect, opened: externalOpened, setOpened: externalSetOpened }: TokenSelectProps) {
    const [internalOpened, setInternalOpened] = useState(false);
    const opened = externalOpened ?? internalOpened; // Use external or internal state
    const setOpened = externalSetOpened ?? setInternalOpened; // Use external or internal setter
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 200);
    const [selectedToken, setSelectedToken] = useState<SolanaToken | null>(initialToken);

    const { cluster } = useCluster();

    // Determine chainId based on the current cluster
    const getChainId = () => {
        switch (cluster.network) {
            case 'mainnet-beta':
                return 101;
            case 'testnet':
                return 102;
            case 'devnet':
                return 103;
            default:
                return 103; // Default to mainnet
        }
    };

    const chainId = getChainId();

    useEffect(() => {
        setSelectedToken(initialToken);
    }, [initialToken]);

    // Use react-query to fetch and cache tokens
    const { data: tokens = [], isLoading, isError } = useQuery({
        queryKey: ['tokens', chainId],
        queryFn: () => fetchTokens(chainId),
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Filter tokens based on the debounced search input
    const filteredTokens = tokens.filter(
        (token) =>
            token.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            token.symbol.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading tokens</div>;


    return (
        <>
            <div onClick={() => setOpened(true)}
                className={
                    clsx(
                        styles.tokenSelectButton,
                        !selectedToken && styles.unselected
                    )
                }
            >
                {selectedToken && <div className={styles.tokenAvatar} style={{ backgroundImage: `url('${selectedToken.logoURI}')` }} />}
                <div
                    className={
                        clsx(
                            styles.tokenSelectLabel,
                            !selectedToken && styles.unselected
                        )
                    }
                >
                    {selectedToken ? selectedToken.symbol : 'Select'}
                </div>
                <span
                    className={
                        clsx(
                            'icon-arrow-down2',
                            !selectedToken && styles.unselected
                        )
                    }
                />
            </div>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                centered
                overlayProps={{ opacity: 1, blur: 3 }}
                styles={{
                    content: {
                        padding: '0px',
                        borderRadius: '16px',
                        border: '1px solid rgba(195, 255, 251, 0.1)',
                        background: '#121A1A',
                        overflow: 'hidden',
                    },
                    body: {
                        padding: '0px',
                        maxHeight: '80vh',
                        minHeight: '300px',
                        overflowY: 'auto',
                    },
                    header: {
                        padding: '0px 16px',
                        borderBottom: '1px solid rgba(195, 255, 251, 0.1)',
                        background: '#121A1A',
                        minHeight: '50px',
                    },
                }}
                title={
                    <TextInput
                        leftSection={
                            <span className="icon-search" style={{ color: '#627170', fontSize: '20px', marginRight: '12px' }} />
                        }
                        classNames={{
                            input: styles.input,
                        }}
                        w="100%"
                        placeholder="Search tokens"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        p={0}
                    />
                }
            >
                {filteredTokens.map((token, idx) => (
                    <TokenListItem
                        key={idx}
                        token={token}
                        onClick={() => {
                            onSelect(token);
                            setSelectedToken(token);
                            setOpened(false);
                        }}
                    />
                ))}
            </Modal>
        </>
    );
}
