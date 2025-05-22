import React, { createContext, useContext, useState, ReactNode, useEffect, use } from 'react';
import { SolanaToken } from '@/types';


import { ChainContext } from '@/context/ChainContext';
import { Lamports, address, lamports } from '@solana/kit';
import { SelectedWalletAccountContext } from '@/context/SelectedWalletAccountContext';
import { RpcContext } from '@/context/RpcContext';
import { getSplTokenBalance } from '@/utils/solana.util';

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
  // getBalanceFromNetwork: (address: string, token: SolanaToken) => Promise<number>;
  // getBalanceFromNetwork: (token: SolanaToken) => Promise<number>;
  getTokenSwapFromBalance: () => Promise<void>;
  isTokenFromBalanceSufficient: boolean;
  amountToSwapFrom: number;
  setAmountToSwapFrom: (value: number) => void;
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

  const [selectedWalletAccount, setSelectedWalletAccount, walletProvider, wallet] = useContext(SelectedWalletAccountContext);
  const { rpc } = useContext(RpcContext)

  const [tokenFrom, setTokenFrom] = useState<SolanaToken | null>(defaultTokenFrom);
  const [tokenTo, setTokenTo] = useState<SolanaToken | null>(defaultTokenTo);
  const [tokenFromBalance, setTokenFromBalance] = useState<number | null>(null);
  
  const [maxSlippage, setMaxSlippage] = useState<number | null>(0.005); // 0 for Auto, 0.005 for 0.5%, null for custom input
  const [zeroSlippage, setZeroSlippage] = useState<boolean>(true);
  
  const [isTokenFromBalanceSufficient, setIsTokenFromBalanceSufficient] = useState<boolean>(true);
  
  const [amountToSwapFrom, setAmountToSwapFrom] = useState<number>(0);

  // const { cluster } = useCluster();
  const { displayName: currentChainName, chain } = useContext(ChainContext);
  // const { publicKey, wallet } = useWallet();

  // useEffect(() => {
  //   if (publicKey) {
  //     const connection = new Connection(cluster.endpoint);
  //   }
  // }, [publicKey, cluster]);

  // // getBalanceFromNetwork returns the human-readable balance (number)
  // const getBalanceFromNetwork = async (token: SolanaToken): Promise<number> => {
  //   try {
  //     let balanceNumber = 0;
  //     if (token.symbol === 'SOL' && selectedWalletAccount) {
  //       const { value: lamportsValue } = await rpc.getBalance(address(selectedWalletAccount?.address)).send();
  //       balanceNumber = Number(lamportsValue) / 10 ** token.decimals;
  //     } else if (selectedWalletAccount) {
  //       // You should implement getSplTokenBalance to return the human-readable number
  //       const splBalance = await getSplTokenBalance(rpc, selectedWalletAccount.address, token.address);
  //       balanceNumber = splBalance ?? 0;
  //     }
  //     setTokenFromBalance(balanceNumber);
  //     return balanceNumber;
  //   } catch (error) {
  //     console.error('Failed to fetch balance:', error);
  //     setTokenFromBalance(0);
  //     return 0;
  //   }
  // };

  useEffect(() => {
    if (selectedWalletAccount && tokenFrom) {
      getTokenSwapFromBalance();
    }
  }, [selectedWalletAccount, tokenFrom]);


  const getTokenSwapFromBalance = async () => {
    console.log('Fetching balance for token:', tokenFrom);
    let balanceNumber = 0;

    if (!selectedWalletAccount || !tokenFrom) {
      // return 0;
      setTokenFromBalance(0);
      return;
    }

    const walletAddress = selectedWalletAccount.address;
    if (tokenFrom.symbol === 'SOL') {
      // Get lamports (bigint), convert to SOL (number)
      const publicKey = address(selectedWalletAccount.address);
      const { value: lamportsValue } = await rpc.getBalance(publicKey).send();
      balanceNumber = Number(lamportsValue) / 10 ** tokenFrom.decimals;
      console.log('SOL balance:', balanceNumber);
    } else {
      // SPL token: get balance as number (already in token units)
      const splBalance = await getSplTokenBalance(rpc, walletAddress, tokenFrom.address);
      balanceNumber = splBalance ?? 0;
      console.log('SPL balance:', balanceNumber);
    }

    // return balanceNumber;
    setTokenFromBalance(balanceNumber);
  }



  // // Utility to get the integer amount for transaction (lamports or smallest unit)
  // const getamountToSwapFromForTx = (): bigint | null => {
  //   if (!tokenFrom || !amountToSwapFrom) return null;
  //   const amount = parseFloat(amountToSwapFrom);
  //   if (isNaN(amount)) return null;
  //   // Convert to smallest unit (lamports for SOL, or token decimals for SPL)
  //   return BigInt(Math.floor(amount * 10 ** tokenFrom.decimals));
  // };

  // const getTokenFromBalance = async (): Promise<number> => {
  //   // if (publicKey && tokenFrom) {
  //   //   try {
  //   //     console.log('Fetching balance for token:', tokenFrom);
  //   //     // const fetchedBalance = await getBalanceFromNetwork(publicKey.toString(), tokenFrom);
  //   //     const fetchedBalance = 0; // TODO
  //   //     setTokenFromBalance(fetchedBalance);
  //   //     return fetchedBalance;
  //   //   } catch (error) {
  //   //     console.error('Failed to fetch balance:', error);
  //   //     setTokenFromBalance(0); // Default to 0 in case of an error
  //   //   }
  //   // }
  //   return 0; // Default to 0 if not connected or tokenFrom is not found
  // }

  // useEffect(() => {
  //   if (publicKey && tokenFrom) {
  //     getTokenFromBalance();
  //   }
  // }, [publicKey, tokenFrom]);

  useEffect(() => {
    if (tokenFromBalance !== null && amountToSwapFrom) {
      const inputAmount = amountToSwapFrom;
      setIsTokenFromBalanceSufficient(inputAmount <= tokenFromBalance);
    } else {
      setIsTokenFromBalanceSufficient(true); // Default to true if no input or balance
    }
  }, [tokenFromBalance, amountToSwapFrom]);

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
        // getBalanceFromNetwork,
        getTokenSwapFromBalance,
        isTokenFromBalanceSufficient,
        amountToSwapFrom,
        setAmountToSwapFrom,
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