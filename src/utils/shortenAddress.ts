export function shortenAddress(address: string, chars = 2): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

