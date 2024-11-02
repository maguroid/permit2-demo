import { Address, erc20Abi, Hex, parseEther, toHex, zeroAddress } from "viem";
import { keccak256, encodeAbiParameters } from "viem/utils";
import { getClient } from "wagmi/actions";
import { config } from "../../wagmi.config";
import { readContract } from "viem/actions";
import { anvil } from "viem/chains";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const wethBalanceSlot = 3n;

async function mint(
  token: `0x${string}`,
  to: `0x${string}`,
  value: bigint = parseEther("100")
) {
  console.log("minting", token, to);
  const client = getClient(config, { chainId: anvil.id });

  const location = keccak256(
    encodeAbiParameters(
      [
        {
          name: "owner",
          type: "address",
        },
        {
          name: "slot",
          type: "uint256",
        },
      ],
      [to, wethBalanceSlot]
    )
  );

  const balance = await readContract(client, {
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [to],
  });

  const valueHex32 = toHex(balance + value, { size: 32 });

  await client.request<{
    method: "anvil_setStorageAt";
    params: [Address, Hex, Hex];
    ReturnType: Hex;
  }>({
    method: "anvil_setStorageAt",
    params: [token, location, valueHex32],
  });

  console.log("minted", token, to);
}

export function useMint(
  token: `0x${string}` = zeroAddress,
  to: `0x${string}` = zeroAddress,
  options?: UseMutationOptions<void, Error, void>
) {
  return useMutation({
    mutationFn: () => mint(token, to),
    ...options,
  });
}
