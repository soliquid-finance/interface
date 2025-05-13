import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { Text, Modal, TextInput, Group } from '@mantine/core';
import TokenListItem from './TokenListItem';
import { useCluster } from '@/components/solana/providers';
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
            <div
                onClick={() => setOpened(true)}
                className={`select-token ${styles.tokenSelectButton}`}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', width: 'fit-content', padding: '8px', borderRadius: '8px', cursor: 'pointer',
                    background: selectedToken ? 'transparent' : '#C3FFFB',
                }}
            >
                {selectedToken ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                            className={styles.tokenAvatar}
                            style={{
                                backgroundImage: `url('${selectedToken.logoURI}')`,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundSize: 'cover',
                            }}
                        />
                        <Text size="md" fw={600} c="white" tt="capitalize" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedToken.symbol}
                        </Text>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#C3FFFB', width: 'fit-content', padding: '0px 8px' }}>
                        <Text size="md" fw={600} c="black" tt="capitalize" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Select
                        </Text>
                    </div>
                )}
                <span className="icon-arrow-down2" style={{ fontSize: '14px', color: selectedToken ? '#9CA3AF' : 'black' }} />
            </div>

            {/* Modal for token selection */}
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
                        overflow: 'hidden', // Prevent the modal itself from scrolling
                    },
                    body: {
                        padding: '0px',
                        maxHeight: '80vh', // Use 80% of the viewport height for responsiveness
                        minHeight: '300px', // Ensure a minimum height for smaller screens
                        overflowY: 'auto', // Enable scrolling only in the body
                    },
                    header: {
                        padding: '16px', // Ensure the header has padding
                        borderBottom: '1px solid rgba(195, 255, 251, 0.1)', // Add a separator between header and body
                        background: '#121A1A', // Match the modal background
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
