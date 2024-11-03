import { Config, useConfig } from "wagmi";
import { signTypedData, writeContract } from "wagmi/actions";
import { permit2Abi } from "../../abi/permit2";
import { Address, zeroAddress } from "viem";
import { anvil } from "viem/chains";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type Permit = {
  token: Address;
  amount: bigint;
  deadline: bigint;
};

async function permit2TransferFrom(
  config: Config,
  permit2Address: Address,
  owner: Address,
  to: Address,
  permit: Permit
) {
  // TODO:  get dynamic nonce
  const nonce = 0n;
  const domain = {
    name: "Permit2",
    chainId: anvil.id,
    verifyingContract: permit2Address,
  };
  const types = {
    TokenPermissions: [
      { name: "token", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    PermitTransferFrom: [
      { name: "permitted", type: "TokenPermissions" },
      { name: "spender", type: "address" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const signature = await signTypedData(config, {
    domain,
    types,
    primaryType: "PermitTransferFrom",
    message: {
      permitted: { token: permit.token, amount: permit.amount },
      spender: owner,
      nonce,
      deadline: permit.deadline,
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await writeContract(config, {
    abi: permit2Abi,
    address: permit2Address,
    functionName: "permitTransferFrom",
    args: [
      {
        permitted: { token: permit.token, amount: permit.amount },
        nonce,
        deadline: permit.deadline,
      },
      { to, requestedAmount: permit.amount },
      owner,
      signature,
    ],
  });
}

export function useErc20Permit2TransferFrom(
  {
    permit2Address = zeroAddress,
    owner = zeroAddress,
    to = zeroAddress,
    permit: { token = zeroAddress, amount = 0n, deadline = 0n },
  }: {
    permit2Address?: Address;
    owner?: Address;
    to?: Address;
    permit: Partial<Permit>;
  },
  options?: UseMutationOptions<void, unknown, void>
) {
  const config = useConfig();
  return useMutation({
    mutationFn: () =>
      permit2TransferFrom(config, permit2Address, owner, to, {
        token,
        amount,
        deadline,
      }),
    ...options,
  });
}
