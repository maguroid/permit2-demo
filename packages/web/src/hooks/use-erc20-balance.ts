import { useQuery } from "@tanstack/react-query";
import { Address, erc20Abi, zeroAddress } from "viem";
import { Config, useConfig } from "wagmi";
import { readContract } from "wagmi/actions";

async function getBalance(config: Config, token: Address, address: Address) {
  const balance = await readContract(config, {
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });
  console.log("token", token);
  console.log("address", address);
  console.log("balance", balance);
  return balance;
}

export function useErc20Balance(
  token: Address = zeroAddress,
  address: Address = zeroAddress
) {
  const config = useConfig();

  const enabled = token !== zeroAddress && address !== zeroAddress;

  return useQuery({
    queryKey: ["erc20-balance", token, address],
    queryFn: () => getBalance(config, token, address),
    enabled,
  });
}
