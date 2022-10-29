import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Types, AptosClient } from "aptos";

const mainnetClient = new AptosClient(
  "https://fullnode.mainnet.aptoslabs.com/v1"
);
const devnetClient = new AptosClient("https://fullnode.devnet.aptoslabs.com");

import CoinRegister from "../components/CoinRegister";
import CoinCreator from "../components/CoinCreator";

import {
  BaseWalletAdapter,
  WalletProvider,
  AptosWalletAdapter,
  HippoExtensionWalletAdapter,
  MartianWalletAdapter,
  PontemWalletAdapter,
  WalletAdapterNetwork,
} from "@manahippo/aptos-wallet-adapter";

const wallets = [
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new HippoExtensionWalletAdapter(),
  new PontemWalletAdapter(),
];

const Home: NextPage = () => {
  // UI state
  const [active, setActive] = useState<string>("none");

  // Account state
  const [addressResources, setAddressResources] = useState<
    Types.MoveResource[] | null
  >(null);

  const [connectedAdapter, setConnectedAdapter] = useState<
    | MartianWalletAdapter
    | AptosWalletAdapter
    | HippoExtensionWalletAdapter
    | PontemWalletAdapter
    | null
  >(null);

  // Wallets Available state
  const [walletSelect, setWalletSelect] = useState<boolean>(false);

  const fetchResources = async () => {
    if (
      connectedAdapter !== null &&
      connectedAdapter.publicAccount.address !== null
    ) {
      switch (JSON.stringify(connectedAdapter.network.name).toLowerCase()) {
        case JSON.stringify(WalletAdapterNetwork.Mainnet).toLowerCase():
          {
            console.log("you are on mainnet");
            setAddressResources(
              await mainnetClient.getAccountResources(
                connectedAdapter.publicAccount.address
              )
            );
          }
          break;
        case JSON.stringify(WalletAdapterNetwork.Devnet).toLowerCase(): {
          console.log("you are on devnet");
          setAddressResources(
            await devnetClient.getAccountResources(
              connectedAdapter.publicAccount.address
            )
          );
        }
        default:
          break;
      }
    }
  };

  useEffect(() => {
    fetchResources();
  }, [connectedAdapter]);

  const handleConnect = async (
    _adapter:
      | MartianWalletAdapter
      | AptosWalletAdapter
      | HippoExtensionWalletAdapter
      | PontemWalletAdapter
  ) => {
    await handleDisconnect();
    if (_adapter !== null) {
      if (_adapter !== connectedAdapter) {
        await connectedAdapter?.disconnect();
        await _adapter.connect();
      }
      setConnectedAdapter(_adapter);
    }
  };

  const handleDisconnect = async () => {
    if (connectedAdapter !== null) {
      connectedAdapter.off("accountChange");
      connectedAdapter.off("networkChange");
      await connectedAdapter.disconnect();
      setConnectedAdapter(null);
    }
  };

  const WalletOption = ({ adapter }: any) => {
    return (
      <div className="m-4 flex flex-row justify-between gap-8 p-2">
        <img height={50} width={50} src={adapter.icon} />
        <div className="flex flex-col">
          <p className="text-sm text-gray-500 ">Provider</p>
          <p className="text-lg font-bold">{adapter.name}</p>
        </div>
        {adapter.readyState === "Installed" ? (
          adapter.connected ? (
            <button
              onClick={() => {
                handleDisconnect();
              }}
              className="flex items-center justify-center rounded-md border-2 border-red-500 bg-red-200 p-2 pl-2 pr-2 transition-all hover:bg-red-500 hover:text-white"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => {
                handleConnect(adapter);
              }}
              className="flex items-center justify-center rounded-md border-2 border-red-500 bg-red-200 p-2 pl-2 pr-2 transition-all hover:bg-red-500 hover:text-white"
            >
              Connect
            </button>
          )
        ) : (
          <button className="flex items-center justify-center rounded-md border-2 border-red-500 bg-red-200 p-2 pl-2 pr-2 transition-all hover:bg-red-500 hover:text-white">
            Not Installed
          </button>
        )}
      </div>
    );
  };

  const activeTool = (_active: string) => {
    switch (_active) {
      case "coinRegister": {
        return (
          <CoinRegister
            adapter={connectedAdapter}
            addressResources={addressResources}
          />
        );
      }
      case "coinCreator": {
        return <CoinCreator adapter={connectedAdapter} />;
      }
      default: {
        return (
          <div>
            <p className="text-center text-xl font-bold">Select a tool.</p>
          </div>
        );
      }
    }
  };

  return (
    <>
      <Head>
        <title>Aptos Tool Suite</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <WalletProvider
        wallets={wallets}
        autoConnect={false}
        onError={(error: Error) => {
          console.log("Handle Error Message", error);
        }}
      >
        <main className="flex min-h-screen w-screen grid-cols-2 flex-row gap-4 bg-stone-800">
          <div
            style={{ display: walletSelect ? "flex" : "none" }}
            className="absolute z-20 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70"
          >
            <div className="min-w-[500px] rounded-md border-2 border-red-500 bg-white p-4">
              <p className="my-4 text-center text-xl font-bold">
                Select Wallet
              </p>
              <div className="flex max-h-[300px] flex-col gap-4 overflow-y-scroll rounded-md border-2 p-4">
                {wallets.map((walletAdapter, i) => {
                  return (
                    <div key={i}>
                      <WalletOption adapter={walletAdapter} />
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => handleDisconnect()}
                className="m-auto my-4 flex items-center justify-center rounded-md border-2 border-red-500 bg-red-200 p-2 pl-8 pr-8 transition-all hover:bg-red-500 hover:text-white"
              >
                Disconnect
              </button>
              <button
                className="m-auto flex items-center justify-center rounded-md border-2 border-red-500 bg-red-200 p-2 pl-8 pr-8 transition-all hover:bg-red-500 hover:text-white"
                onClick={() => setWalletSelect(!walletSelect)}
              >
                Close
              </button>
            </div>
          </div>
          <div className="mt-4 mb-4 ml-4 max-w-[30%] rounded-md bg-stone-900 p-8 text-stone-50 shadow-md">
            <h1 className="text-center text-5xl font-extrabold leading-normal text-stone-50 md:text-[5rem]">
              <span className="text-teal-500">Ap</span>Box
            </h1>
            <p>
              Quick and easy to use tools for Aptos users, developers and apes.
            </p>
            <p>
              Maintained by{" "}
              <a
                href="https://twitter.com/spuro69"
                target="_blank"
                rel="noreferrer"
              >
                @spuro69
              </a>
            </p>
            <p>
              View on{" "}
              <a
                href="https://github.com/spuro/apbox"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-teal-500"
              >
                GitHub
              </a>
              .
            </p>
            <p className="text-sm">
              Have a tool suggestion or feedback?
              <br />
              <a
                href="https://github.com/spuro/apbox"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-red-500"
              >
                Submit an Issue on Github.
              </a>
            </p>
            <div className="flex items-center justify-center p-2">
              {connectedAdapter !== null ? (
                <button
                  onClick={() => setWalletSelect(true)}
                  className="mt-2 flex items-center justify-center rounded-md bg-teal-200 px-4 py-2 text-stone-600 transition-all hover:bg-teal-500 hover:text-stone-50"
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button
                  onClick={() => setWalletSelect(true)}
                  className="mt-2 flex items-center justify-center rounded-md bg-teal-200 px-4 py-2 text-stone-600 transition-all hover:bg-teal-500 hover:text-stone-50"
                >
                  Connect Wallet
                </button>
              )}
            </div>
            <p className="text-center">
              {connectedAdapter !== null
                ? `Connected as ${JSON.stringify(
                    connectedAdapter.publicAccount.address
                  ).slice(1, 8)}...`
                : "You are not connected."}
            </p>
            <p className="mt-6 text-center text-xl font-semibold text-teal-100">
              Tools Available:
            </p>
            <div className="mt-2 flex flex-col gap-6">
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setActive("coinRegister");
                }}
              >
                <ToolEntry
                  name="Coin Register"
                  description="Allows you to register any given token. We have a list of known, common tokens, or you can input your own."
                />
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setActive("coinCreator");
                }}
              >
                <ToolEntry
                  name="Coin Creator"
                  description="Create your own token! Customise it with your own symbol, name, icon and more!"
                />
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setActive("coinManager");
                }}
              >
                <ToolEntry
                  name="Coin Manager"
                  description="Manage any token your connected count has ownership of. Minting, burning, etc."
                />
              </div>
            </div>
            <p className="mt-4 text-center text-sm">
              All tools are also deployed (when applicable) on Devnet so you can
              test first, just change your network.
            </p>
            <p className="mt-4 text-center font-bold text-red-500">
              Disclaimer:
            </p>
            <p className="mt-2 text-center text-sm">
              Although these tools are tested before publishing, be aware you
              use them at your own risk. No one is responsible for any loss of
              funds except for yourself. You can verify what you&apos;re
              interacting with by visiting the{" "}
              <a
                href="https://github.com/spuro/apbox"
                target="_blank"
                rel="noreferrer"
                className="text-teal-500 underline"
              >
                ApBox repo.
              </a>
            </p>
          </div>
          <div className="mr-4 mt-4 mb-4 h-full w-full rounded-md bg-stone-900 p-8">
            {activeTool(active)}
          </div>
        </main>
      </WalletProvider>
    </>
  );
};

export default Home;

type ToolEntryProps = {
  name: string;
  description: string;
};

const ToolEntry = ({ name, description }: ToolEntryProps) => {
  return (
    <section className="flex cursor-pointer flex-col justify-center rounded-t-md border-b-2 border-teal-200 bg-stone-800 p-4 shadow-md transition-all hover:scale-105">
      <h2 className="text-lg font-bold text-teal-400  ">{name}</h2>
      <p className="mt-1 text-sm text-stone-100">{description}</p>
    </section>
  );
};
