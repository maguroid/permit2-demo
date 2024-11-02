import {
  useAccount,
  useBalance,
  useSwitchChain,
  useDisconnect,
  useConnect,
  useClient,
} from "wagmi";
import { anvil } from "viem/chains";
import { injected } from "wagmi/connectors";
import { useDemoContracts } from "./hooks/use-demo-contracts";
import { useMint } from "./hooks/use-mint";
import { useEffect } from "react";
import { Address, formatEther } from "viem";
import { Hex } from "viem";
import { toast } from "sonner";
import { useErc20Balance } from "./hooks/use-erc20-balance";

function ConnectButton() {
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain({
    mutation: {
      onError: (error) => {
        toast.error(error.message);
        disconnect();
      },
    },
  });
  const { connect } = useConnect({
    mutation: {
      onSuccess: () => {
        switchChain({ chainId: anvil.id });
      },
    },
  });

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-blue-500 text-white px-3 py-2 rounded-lg w-fit text-xs"
    >
      Connect Wallet
    </button>
  );
}

function App() {
  const client = useClient();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: contracts, isSuccess } = useDemoContracts();
  const { data: wethBalance, refetch: refetchWethBalance } = useErc20Balance(
    contracts?.weth,
    address
  );
  const { mutate: mint } = useMint(contracts?.weth, address, {
    onSuccess: () => {
      toast.success("Minted WETH");
      refetchWethBalance();
    },
  });

  const displayConnection = address ? (
    `${address.slice(0, 6)}...${address.slice(-4)}`
  ) : (
    <ConnectButton />
  );

  const displayBalance = balance ? `${balance.value} ${balance.symbol}` : "0";

  useEffect(() => {
    client?.request<{
      method: "anvil_setBalance";
      params: [Address, Hex];
      ReturnType: Hex;
    }>({
      method: "anvil_setBalance",
      params: [address, "0x1000000000000000000000000"],
    });
  }, [client, address]);

  return (
    <div className="px-32 py-10">
      <div className="flex flex-col gap-10 text-slate-700 w-2/3">
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-2xl font-bold">Permit2 Demo</h1>
            <p>This is a simple demo of how to use Permit2 to transfer WETH.</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm flex gap-2 items-center">
              Account: <span className="font-bold">{displayConnection}</span>
            </p>
            <p className="text-sm flex gap-2 items-center">
              Balance: <span className="font-bold">{displayBalance}</span>
            </p>
            {!isSuccess && <p>Loading contracts...</p>}
            {isSuccess && (
              <p className="text-sm flex gap-2 items-center">
                WETH: <span className="font-bold">{contracts?.weth}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Step 1: Mint WETH</h2>
          <button
            onClick={() => mint()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit text-sm"
          >
            Mint WETH
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">
            Step 2: Approve WETH for Permit2 contract
          </h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit text-sm">
            Approve WETH
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Step 3: Transfer WETH to alice</h2>
          <div className="flex items-center gap-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit text-sm">
              Transfer WETH
            </button>
            <div className="flex gap-4">
              <div className="flex gap-2 items-center text-slate-500">
                <h3>My WETH:</h3>
                <div className="flex gap-1 items-baseline">
                  <p>{wethBalance ? formatEther(wethBalance) : 0}</p>
                  <p className="text-sm">WETH</p>
                </div>
              </div>
              <div className="flex gap-2 items-center text-slate-500">
                <h3>Alice's WETH:</h3>
                <div className="flex gap-1 items-baseline">
                  <p>0</p>
                  <p className="text-sm">WETH</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
