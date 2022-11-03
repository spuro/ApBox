import React, { useEffect, useState } from "react";

import { RequestInit } from "next/dist/server/web/spec-extension/request";

import loadingIcon from "../loadingIcon.png";

import { Types, AptosClient } from "aptos";

type Props = {
  adapter: any;
};

function TokenCreator({ adapter }: Props) {
  const [coinSymbol, setCoinSymbol] = useState<string>(null);
  const [coinName, setCoinName] = useState<string>(null);
  const [coinDecimals, setCoinDecimals] = useState<number>(6);
  const [coinMonitor, setCoinMonitor] = useState<boolean>(true);

  const [decimalError, setDecimalError] = useState<string>(null);

  const [submitError, setSubmitError] = useState<string>(null);
  const [canSubmit, setCanSubmit] = useState<boolean>(false);

  const [isCompiling, setIsCompiling] = useState<boolean>(false);

  const handleSubmitCreateCoin = async (e: any) => {
    e.preventDefault();

    const params: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: "POST",
      body: JSON.stringify({
        symbol: coinSymbol,
        name: coinName,
        decimal: coinDecimals,
        monitor: coinMonitor,
      }),
    };

    const compileResponse = await fetch("api/compile", params);

    console.log(compileResponse);

    // const payload: Types.TransactionPayload = {
    //   type: "entry_function_payload",
    //   function: "0x1::managed_coin::initialize",
    //   type_arguments: [`<${coinName}>`],
    //   arguments: [coinName, coinSymbol, coinDecimals, coinMonitor],
    // };

    // const txn = adapter.signAndSubmitTransaction(payload);
    // console.log(txn);
    setIsCompiling(false);
  };

  useEffect(() => {
    if (isNaN(coinDecimals)) {
      setDecimalError("Must be a number!");
      return;
    } else if (coinDecimals > 63) {
      setDecimalError("Must be below 63.");
    } else {
      setDecimalError(null);
    }
  }, [coinDecimals]);

  useEffect(() => {
    if (
      adapter !== null &&
      decimalError === null &&
      !isNaN(coinDecimals) &&
      coinSymbol !== null &&
      coinName !== null &&
      coinSymbol.length > 0 &&
      coinName.length > 0
    ) {
      setCanSubmit(true);
    }

    if (adapter === null) {
      setSubmitError("You are not connected to a network.");
    } else {
      setSubmitError(null);
    }
  }, [coinSymbol, coinName, coinDecimals]);

  return (
    <div>
      <h2 className="text-center text-3xl font-semibold text-teal-200">
        Coin Creator
      </h2>
      <p className="text-stone-100">
        <span className="font-semibold text-teal-200">What is this for?</span>
        <br />
        Pretty simple, create your own coin. Decide on your name, symbol and
        supply. Coins your account have ownership of can also be managed via the
        Coin Manager tool.
        <br />
        <br />
        <span className="font-bold">
          You can mint or burn supply after creating the coin.
        </span>
      </p>
      <div className="mt-4 flex flex-col gap-4 rounded-md p-4">
        <p className="mb-4 mt-2 text-center text-xl font-bold text-teal-200">
          Enter Coin details below:
        </p>
        <div className="flex flex-row justify-between rounded-md bg-stone-800 p-4">
          <div className="flex-flex-col">
            <p className="font-bold text-teal-200">Enter your coin symbol:</p>
            <p className="text-sm text-stone-100">e.g. BTC, ETH, APT, SBUX.</p>
          </div>
          <input
            type="text"
            onChange={(e) => {
              setCoinSymbol(e.target.value);
            }}
            className="min-w-8 rounded-md p-1"
          />
        </div>
        <div className="flex flex-row justify-between rounded-md bg-stone-800 p-4">
          <div className="flex-flex-col">
            <p className="font-bold text-teal-200">Enter your coin name:</p>
            <p className="text-sm text-stone-100">
              e.g. Bitcoin, Ethereum, Aptos, SpuroBux.
            </p>
          </div>
          <input
            type="text"
            onChange={(e) => {
              setCoinName(e.target.value);
            }}
            className="min-w-8 rounded-md p-1"
          />
        </div>
        <div className="flex flex-col rounded-md bg-stone-800 p-4">
          <div className="flex flex-row justify-between">
            <div className="flex-flex-col">
              <p className="font-bold text-teal-100">Decimal count:</p>
              <p className="text-sm text-stone-100">
                The default on Aptos is 6. If you&apos;re unsure, just enter 6.
              </p>
            </div>
            <input
              type="text"
              onChange={(e) => {
                setCoinDecimals(Number(e.target.value));
              }}
              defaultValue={6}
              className="min-w-8 rounded-md p-1"
            />
          </div>
          <p className="text-center font-bold text-teal-500">
            {decimalError !== null && decimalError.length > 0
              ? decimalError
              : ""}
          </p>
        </div>
        <div className="flex flex-col rounded-md bg-stone-800 p-4">
          <div className="flex flex-row justify-between">
            <div className="flex-flex-col">
              <p className="font-bold text-teal-200">Monitor supply?</p>
              <p className="text-sm text-stone-100">
                Track supply or not. Read more{" "}
                <a
                  href="https://aptos.dev/concepts/coin-and-token/aptos-coin/#creating-a-new-cointype"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-500 underline"
                >
                  here.
                </a>{" "}
                Unsure? Just click &apos;yes&apos;.
              </p>
            </div>
            <div className="grid h-2 grid-cols-2 gap-2">
              <div>
                <button
                  onClick={() => setCoinMonitor(true)}
                  className={`${
                    coinMonitor ? "" : "brightness-50"
                  } h-full w-full cursor-pointer rounded-md bg-green-500 py-2 px-4 text-center text-stone-100 transition-all hover:brightness-90`}
                >
                  Yes
                </button>
              </div>
              <div
                onClick={() => setCoinMonitor(false)}
                className={`${
                  coinMonitor ? "brightness-50" : ""
                } h-full w-full cursor-pointer rounded-md bg-red-500 py-2 px-4 text-center text-stone-100 transition-all hover:brightness-90`}
              >
                No
              </div>
            </div>
          </div>
        </div>
        {canSubmit ? (
          <button
            onClick={(e) => handleSubmitCreateCoin(e)}
            className="bg-red-px-4 m-auto rounded-md bg-teal-200 px-4 py-2 text-black transition-all hover:bg-teal-500 hover:text-stone-100"
          >
            Submit
          </button>
        ) : (
          <button className="bg-red-px-4 m-auto rounded-md bg-teal-200 px-4 py-2 text-black brightness-75 transition-all hover:brightness-50">
            Submit
          </button>
        )}
        {isCompiling ? (
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 text-center font-bold text-teal-500">
              Compiling...
            </p>
            <img
              className="h-[30px] w-[30px] animate-spin"
              src={loadingIcon.src}
              alt="Loading Icon"
            />
          </div>
        ) : (
          <></>
        )}
        <p className="text-center font-bold text-red-500">
          {submitError !== null ? submitError : ""}
        </p>
      </div>
    </div>
  );
}

export default TokenCreator;
