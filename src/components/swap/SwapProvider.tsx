import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { SolanaToken } from '@/types';
import { Connection, PublicKey } from '@solana/web3.js';
import { useCluster } from "@/components/solana/providers";
import { useWallet } from '@solana/wallet-adapter-react';

interface SwapContextProps {
  tokenFrom: SolanaToken | null;
  setTokenFrom: (value: SolanaToken | null) => void;
  tokenFromBalance: number | null;
  tokenTo: SolanaToken | null;
  setTokenTo: (value: SolanaToken | null) => void;
  maxSlippage: number | null;
  setMaxSlippage: (value: number | null) => void;
  zeroSlippage: boolean;
  setZeroSlippage: (value: boolean) => void;
  getBalanceFromNetwork: (address: string, token: SolanaToken) => Promise<number>;
  isTokenFromBalanceSufficient: boolean;
  swapFromAmount: string;
  setSwapFromAmount: (value: string) => void;
}

const SwapContext = createContext<SwapContextProps | undefined>(undefined);

const defaultTokenFrom: SolanaToken = {
  chainId: 101,
  address: "So11111111111111111111111111111111111111112",
  symbol: "SOL",
  name: "Wrapped SOL",
  decimals: 9,
  logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  extensions: {
    coingeckoId: "solana",
    serumV3Usdc: "9wFFyRfZBsuAha4YcuxcXLKwMxJR43S7fPfQLusDBzvT",
    serumV3Usdt: "HWHvQhFmJB3NUcu1aihKmrKegfVxBEHzwVX6yZCKEsi1",
    website: "https://solana.com/",
  },
};

const defaultTokenTo: SolanaToken = {
  chainId: 101,
  address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  symbol: "USDC",
  name: "USD Coin",
  decimals: 6,
  logoURI: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
  tags: ["stablecoin"],
  extensions: {
    coingeckoId: "usd-coin",
    serumV3Usdt: "77quYg4MGneUdjgXCunt9GgM1usmrxKY31twEy3WHwcS",
    website: "https://www.centre.io/",
  },
};

export const SwapProvider = ({ children }: { children: ReactNode }) => {
  const [tokenFrom, setTokenFrom] = useState<SolanaToken | null>(defaultTokenFrom);
  const [tokenTo, setTokenTo] = useState<SolanaToken | null>(defaultTokenTo);
  const [tokenFromBalance, setTokenFromBalance] = useState<number | null>(null);
  const [maxSlippage, setMaxSlippage] = useState<number | null>(0); // 0 for Auto, 0.005 for 0.5%, null for custom input
  const [zeroSlippage, setZeroSlippage] = useState<boolean>(false);
  const [isTokenFromBalanceSufficient, setIsTokenFromBalanceSufficient] = useState<boolean>(true);
  const [swapFromAmount, setSwapFromAmount] = useState<string>(''); // Add this state if not already present

  const { cluster } = useCluster();
  const { publicKey, wallet } = useWallet();

  // useEffect(() => {
  //   if (publicKey) {
  //     const connection = new Connection(cluster.endpoint);
  //   }
  // }, [publicKey, cluster]);

  const getBalanceFromNetwork = async (address: string, token: SolanaToken): Promise<number> => {
    const connection = new Connection(cluster.endpoint); // Replace with the appropriate network URL
    const publicKey = new PublicKey(address);

    try {
      if (token.symbol === 'SOL') {
        // Fetch SOL balance
        const lamports = await connection.getBalance(publicKey);
        return lamports / 1e9; // Convert lamports to SOL
      } else {
        // Fetch SPL token balance
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
          mint: new PublicKey(token.address),
        });

        const tokenAccount = tokenAccounts.value.find(
          (account) => account.account.data.parsed.info.tokenAmount.uiAmount
        );
        return tokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0;
      }
    } catch (error) {
      return 0; // Default to 0 in case of an error
    }
  };

  const getTokenFromBalance = async (): Promise<number> => {
    if (publicKey && tokenFrom) {
      try {
        console.log('Fetching balance for token:', tokenFrom);
        const fetchedBalance = await getBalanceFromNetwork(publicKey.toString(), tokenFrom);
        setTokenFromBalance(fetchedBalance);
        return fetchedBalance;
      } catch (error) {
        console.error('Failed to fetch balance:', error);
        setTokenFromBalance(0); // Default to 0 in case of an error
      }
    }
    return 0; // Default to 0 if not connected or tokenFrom is not found
  }

  useEffect(() => {
    if (publicKey && tokenFrom) {
      getTokenFromBalance();
    }
  }, [publicKey, tokenFrom]);

  useEffect(() => {
    if (tokenFromBalance !== null && swapFromAmount) {
      const inputAmount = parseFloat(swapFromAmount);
      setIsTokenFromBalanceSufficient(inputAmount <= tokenFromBalance);
    } else {
      setIsTokenFromBalanceSufficient(true); // Default to true if no input or balance
    }
  }, [tokenFromBalance, swapFromAmount]);

  return (
    <SwapContext.Provider
      value={{
        tokenFrom,
        setTokenFrom,
        tokenFromBalance,
        tokenTo,
        setTokenTo,
        maxSlippage,
        setMaxSlippage,
        zeroSlippage,
        setZeroSlippage,
        getBalanceFromNetwork,
        isTokenFromBalanceSufficient,
        swapFromAmount,
        setSwapFromAmount,
      }}
    >
      {children}
    </SwapContext.Provider>
  );
};

export const useSwapContext = () => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwapContext must be used within a SwapProvider');
  }
  return context;
};