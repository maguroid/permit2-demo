import { anvil } from "viem/chains";
import { createConfig, http } from "wagmi";

export const config = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http(),
  },
});
