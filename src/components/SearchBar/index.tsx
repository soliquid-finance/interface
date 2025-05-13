import { ReactNode, useState, useEffect } from 'react';
import { useMediaQuery } from '@mantine/hooks';
// import TokenSelect from '@/components/swap/TokenSelect'; // Import TokenSelect
import { SolanaToken } from '@/types';
import classes from './SearchBar.module.css';

import { useQuery } from '@tanstack/react-query';
import { useDebouncedValue } from '@mantine/hooks';
import { Text, Modal, TextInput, Group } from '@mantine/core';

import { useCluster } from '@/components/solana/providers';
import TokenListItem from '../swap/TokenListItem';
// import styles from './TokenSelect.module.css';
// import TokenListItem from '../swap/TokenListItem';


const fetchTokens = async (chainId: number): Promise<SolanaToken[]> => {
  const response = await fetch('https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json');
  const data = await response.json();
  return data.tokens.filter((token: SolanaToken) => token.chainId === chainId); // Filter by chainId
};

interface SearchBarProps {
  placeholder?: string;
  spotlight: ReactNode;
}

export function SearchBar({
  placeholder,
  spotlight: spotlightComponent,
  ...props
}: SearchBarProps) {
  const [opened, setOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false); // State for modal
  const [selectedToken, setSelectedToken] = useState<SolanaToken | null>(null); // State for selected token
  const isDesktop = useMediaQuery('(min-width: 768px)'); // Adjust breakpoint as needed

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 200);

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

  return (
    <>
      <div
        className={classes.container}
        onClick={() => setModalOpened(true)} // Open modal on click
        {...props}
      >
        {!isDesktop ? ( // Show only the search icon in mobile view
          <div className={classes.leadingIcon} >
            <span className="icon-search" onClick={() => setOpened(true)} />
          </div>
        ) : (
          <>
            <div className={classes.leadingIcon}>
              <span className="icon-search" onClick={() => setOpened(true)} />
            </div>
            <input
              type="text"
              className={classes.input}
              placeholder={placeholder}
              readOnly
              value={selectedToken ? selectedToken.symbol : ''} // Display selected token symbol
              onClick={() => setOpened(true)}
            />
            <div className={classes.trailingIcon}>
              <span className={classes.slash} onClick={() => setOpened(true)}>/</span>
            </div>
            {/* {spotlightComponent} */}
          </>
        )}
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
              input: classes.modalInput,
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
              // onSelect(() => {});
              setSelectedToken(token);
              setOpened(false);
            }}
          />
        ))}

      </Modal>
    </>
  );
}
