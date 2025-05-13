import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * Fetch the token balance for a given token address and wallet public key.
 * Handles wallet connection and errors gracefully.
 * @param tokenAddress - The token's mint address.
 * @param connectionUrl - The Solana network connection URL (default: devnet).
 * @returns The token balance as a number or 0 if not found or disconnected.
 */
export const getTokenBalance = async (
  tokenAddress: string,
  connectionUrl: string = 'https://api.devnet.solana.com'
): Promise<{ balance: number; symbol: string }> => {
  const { publicKey, connected } = useWallet();

  if (!connected || !publicKey) {
    console.warn('Wallet not connected. Returning 0 balance.');
    return { balance: 0, symbol: tokenAddress }; // Default to 0 if wallet is not connected
  }

  try {
    const connection = new Connection(connectionUrl);
    const walletPublicKey = new PublicKey(publicKey);

    if (tokenAddress === 'So11111111111111111111111111111111111111112') {
      // Fetch SOL balance
      const lamports = await connection.getBalance(walletPublicKey);
      return { balance: lamports / 1e9, symbol: 'SOL' }; // Convert lamports to SOL
    } else {
      // Fetch SPL token balance
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPublicKey, {
        mint: new PublicKey(tokenAddress),
      });

      const tokenAccount = tokenAccounts.value.find(
        (account) => account.account.data.parsed.info.tokenAmount.uiAmount
      );
      const balance = tokenAccount?.account.data.parsed.info.tokenAmount.uiAmount || 0;
      return { balance, symbol: tokenAddress };
    }
  } catch (error) {
    console.error('Failed to fetch token balance:', error);
    return { balance: 0, symbol: tokenAddress }; // Default to 0 in case of an error
  }
};
