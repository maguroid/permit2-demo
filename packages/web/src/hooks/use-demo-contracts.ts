import { wethAbi } from "../../abi/weth";
import { permit2Abi } from "../../abi/permit2";
import { privateKeyToAccount } from "viem/accounts";
import { deployContract, getTransactionReceipt } from "wagmi/actions";
import { config } from "../../wagmi.config";
import { anvil } from "wagmi/chains";
import { useQuery } from "@tanstack/react-query";
import bytecodes from "../bytecodes";

const anvilAccount1 = privateKeyToAccount(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

let weth: `0x${string}`;
let permit2: `0x${string}`;

async function deployOrUseCached() {
  console.log("Deploying contracts...");

  if (!weth) {
    const tx = await deployContract(config, {
      abi: wethAbi,
      bytecode: bytecodes.weth,
      account: anvilAccount1,
      chainId: anvil.id,
    });
    const receipt = await getTransactionReceipt(config, { hash: tx });
    if (!receipt.contractAddress) {
      throw new Error("Failed to deploy WETH");
    }
    weth = receipt.contractAddress;
    console.log("WETH deployed at", weth);
  }

  if (!permit2) {
    const tx = await deployContract(config, {
      abi: permit2Abi,
      bytecode: bytecodes.permit2,
      account: anvilAccount1,
      chainId: anvil.id,
    });
    const receipt = await getTransactionReceipt(config, { hash: tx });
    if (!receipt.contractAddress) {
      throw new Error("Failed to deploy Permit2");
    }
    permit2 = receipt.contractAddress;
    console.log("Permit2 deployed at", permit2);
  }

  return { weth, permit2 };
}

export function useDemoContracts() {
  return useQuery({
    queryKey: ["demo-contracts"],
    queryFn: deployOrUseCached,
  });
}
