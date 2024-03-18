export function isChainSupported(chain: string) {
  const chains = ["ethereum", "bsc", "polygon", "base", "sepolia"];
  return chains.some((c) => c === chain);
}
export function getChainExplorer(chain: string, tx: string) {
  let url;
  switch (chain) {
    case "sepolia":
      url = `https://sepolia.etherscan.io/tx/${tx}`;
      break;
    case "bsc":
      url = `https://basescan.org/tx/${tx}`;
      break;
    case "polygon":
      url = `https://polygonscan.com/tx/${tx}`;
      break;
    case "base":
      url = `https://basescan.org/tx/${tx}`;
      break;
    case "ethereum":
      url = `https://etherscan.io/tx/${tx}`;
      break;
    default:
      url = `https://polygonscan.com/tx/${tx}`;
      break;
  }
  return url;
}
