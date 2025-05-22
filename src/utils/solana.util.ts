import { address } from '@solana/kit';
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';

/**
 * Get the associated token account (ATA) address for a given wallet and token mint.
 * @param walletAddress - The wallet's public key (string or PublicKey)
 * @param mintAddress - The token mint address (string or PublicKey)
 * @returns Promise<PublicKey> - The associated token account address
 */
export async function getAssociatedTokenAccount(walletAddress: string, mintAddress: string) {
  const mint = address(mintAddress);
  const owner = address(walletAddress);
  const [ata] = await findAssociatedTokenPda({
    mint,
    owner,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  return ata;
}

/**
 * Fetch the SPL token balance for a given wallet and token mint using the provided rpc client.
 * @param rpc - The Solana RPC client (must have getTokenAccountBalance method)
 * @param walletAddress - The wallet's public key (string)
 * @param mintAddress - The token mint address (string)
 * @returns Promise<number | null> - The token balance (uiAmount) or null if not found
 */
export async function getSplTokenBalance(rpc: any, walletAddress: string, mintAddress: string): Promise<number | null> {
  try {
    const ata = await getAssociatedTokenAccount(walletAddress, mintAddress);
    const { value } = await rpc.getTokenAccountBalance(ata).send();
    return value.uiAmount ?? 0;
  } catch (e) {
    return 0;
  }
}
