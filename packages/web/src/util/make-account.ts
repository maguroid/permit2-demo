import { encodePacked, keccak256 } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export function makeAccount(name: string) {
  const privateKey = keccak256(encodePacked(["string"], [name]));

  return privateKeyToAccount(privateKey);
}
