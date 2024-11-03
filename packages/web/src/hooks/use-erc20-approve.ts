import { Address, erc20Abi, maxUint256, zeroAddress } from "viem";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { Config, useConfig } from "wagmi";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

async function approve(
  config: Config,
  token: Address,
  spender: Address,
  amount: bigint
) {
  const tx = await writeContract(config, {
    address: token,
    abi: erc20Abi,
    functionName: "approve",
    args: [spender, amount],
  });

  await waitForTransactionReceipt(config, { hash: tx });
}

export function useErc20Approve(
  {
    token = zeroAddress,
    spender = zeroAddress,
    amount = maxUint256,
  }: {
    token?: Address;
    spender?: Address;
    amount?: bigint;
  },
  options?: UseMutationOptions<void, Error, void>
) {
  const config = useConfig();

  return useMutation({
    mutationFn: () => approve(config, token, spender, amount),
    ...options,
  });
}
