function App() {
  return (
    <>
      <div className="flex flex-col gap-10 p-8 tracking-wide text-slate-700">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Permit2 Demo</h1>
          <p>This is a simple demo of how to use Permit2 to transfer WETH.</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Step 1: Mint WETH</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg w-fit text-sm">
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
                  <p>0</p>
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
    </>
  );
}

export default App;
