import { useEffect, useState } from "react";

import { Types, AptosClient } from "aptos";

const mainnetClient = new AptosClient(
  "https://fullnode.mainnet.aptoslabs.com/v1"
);
const devnetClient = new AptosClient("https://fullnode.devnet.aptoslabs.com");

import coinListMainnet from "../tokenRegisterCoinList/tokenRegisterCoinList.json";
import coinListDevnet from "../tokenRegisterCoinList/DEVNET_tokenRegisterCoinList.json";

type Props = {
  adapter: any;
  addressResources: Types.MoveResource[] | null;
};

function TokenRegister({ adapter, addressResources }: Props) {
  // UI state
  const [search, setSearch] = useState("");
  const [customAddress, setCustomAddress] = useState("");

  const coinList =
    adapter !== null
      ? adapter.network.name === "Mainnet"
        ? coinListMainnet
        : coinListDevnet
      : [];

  const handleRegister = (e: any, _address: string) => {
    e.preventDefault();
    const txOptions = {
      max_gas_amount: "1000",
      gas_unit_price: "100",
    };
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: "0x1::managed_coin::register",
      type_arguments: [_address],
      arguments: [],
    };
    const txn = adapter.signAndSubmitTransaction(payload, txOptions);
    console.log(txn);
    console.log(adapter);
  };

  type tokenEntryProps = {
    symbol: string;
    name: string;
    description: string;
    address: string;
  };

  const TokenEntry = ({
    symbol,
    name,
    description,
    address,
  }: tokenEntryProps) => {
    return (
      <div className="mb-5 rounded-md border-2 border-gray-300 p-2">
        <div className="mb-1 flex flex-row justify-between">
          <div className="flex flex-row">
            <div className="flex w-max flex-col">
              <div className="min-w-[200px]">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Symbol</p>
                  <p className="font-bold">{symbol}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-bold">{name}</p>
                </div>
              </div>
            </div>
            <div className="">
              <p className="text-sm text-gray-500">Description</p>
              <p>{description}</p>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            {addressResources !== null ? (
              addressResources?.filter((r) => {
                return r.type === `0x1::coin::CoinStore<${address}>`;
              }).length > 0 ? (
                <p className="rounded-md border-2 border-red-800 bg-red-800 p-2 text-white">
                  Registered
                </p>
              ) : (
                <button
                  onClick={(e) => handleRegister(e, address)}
                  className="rounded-md border-2 border-red-500 bg-red-200 p-2 transition-all hover:bg-red-500 hover:text-white"
                >
                  Register
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">{address}</p>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-center text-3xl font-semibold text-gray-800">
        Coin Register
      </h2>
      <p>
        <span className="font-semibold text-gray-800">What is this for?</span>
        <br />
        Coins on Aptos require a CoinStore. This is a resource bound to your
        address that, implied by the name, stores your coins. In many cases, a
        CoinStore is required before you can even receive a given coin.
        <br />
        <br />
        Useful for when someone wants to send you a coin you have not interacted
        with yet.
        <br />
        <br />
        Think an important coin is missing?{" "}
        <a
          href="https://github.com/spuro/apbox"
          className="underline hover:text-red-600"
        >
          Submit a pull request!
        </a>
      </p>
      <p className="m-auto my-4 w-max rounded-md bg-red-200 p-2 text-center">{`You are connected to ${
        adapter !== null ? adapter.network.name : "nothing."
      }`}</p>
      <div className="p4 m-4">
        <div className="mb-4 flex flex-row justify-between">
          <p className="flex items-center justify-center">Search:</p>
          <input
            onChange={(e) => setSearch(e.target.value)}
            className="border-1 rounded-md border-2 border-gray-300 p-1"
            type={"text"}
          />
        </div>
        <div
          style={{ scrollbarWidth: "none" }}
          className="mb-4 max-h-[500px] overflow-y-scroll rounded-md border-2 border-red-600 p-4"
        >
          {search === ""
            ? coinList.map((coin, i) => {
                return (
                  <div key={i}>
                    <TokenEntry
                      symbol={coin.symbol}
                      name={coin.name}
                      description={coin.description}
                      address={coin.address}
                    />
                  </div>
                );
              })
            : coinList.map((coin, i) => {
                return coin.symbol
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                  coin.name.toLowerCase().includes(search.toLowerCase()) ? (
                  <div key={i}>
                    <TokenEntry
                      symbol={coin.symbol}
                      name={coin.name}
                      description={coin.description}
                      address={coin.address}
                    />
                  </div>
                ) : (
                  ""
                );
              })}
        </div>
        <p className="mt-4 w-full text-center">
          If what you&apos;re after isn&apos;t available above, (or you just
          know what you&apos;re doing), register an asset via its address!
        </p>
        <div className="mt-4 flex flex-row items-center rounded-md border-2 border-red-600 p-4">
          <p className="mr-4 font-bold">Address:</p>
          <input
            className="border-1 h-full w-full rounded-md border-2 border-gray-300 p-2"
            onChange={(e) => setCustomAddress(e.target.value)}
          />
          <button
            onClick={(e) => handleRegister(e, customAddress)}
            className="ml-4 rounded-md border-2 border-red-500 bg-red-200 p-2 transition-all hover:bg-red-500 hover:text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TokenRegister;
