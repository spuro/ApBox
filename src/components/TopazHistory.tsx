import React, { useEffect, useState, useRef } from "react";
import { AptosClient, Types, HexString, MaybeHexString } from "aptos";

const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";

const client = new AptosClient(NODE_URL);

type Props = {
  adapter: any;
  addressResources: Types.MoveResource[] | null;
};

function NFTHistory({ adapter, addressResources }: Props) {
  const [topazHistory, setTopazHistory] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const txHistory = await client.getEventsByEventHandle(
      "0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2",
      "0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::events::Events",
      "buy_events",
      { limit: 25 }
    );
    setTopazHistory(txHistory);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <h2 className="text-center text-3xl font-semibold text-teal-200">
        NFT History
      </h2>
      <p className="text-stone-100">
        <span className="font-semibold text-teal-200">What is this for?</span>
        <br />
        View sale history of collections on Topaz.
        <br />
        <br />
        Topaz will likely add more historical data. Unable to filter by
        collection, but I'm working on another solution.
      </p>
      <div className="mb-2 mt-2 flex items-center justify-center">
        <button
          className="rounded-md bg-teal-200 p-4 text-stone-800"
          onClick={() => fetchEvents()}
        >
          Refresh
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        {topazHistory.map((event) => {
          return <EventHistory event={event} />;
        })}
      </div>
    </div>
  );
}

export default NFTHistory;

const EventHistory = ({ event }) => {
  return (
    <div className="grid grid-cols-3 gap-4 rounded-md border-2 border-teal-200 p-2">
      <div className="flex flex-col">
        <p className="text-teal-200">Collection:</p>
        <p className="font-bold text-stone-100">
          {event.data.token_id.token_data_id.collection}
        </p>
      </div>
      <div>
        <p className="text-teal-200">Token name:</p>
        <p className="font-bold text-stone-100">
          {event.data.token_id.token_data_id.name}
        </p>
      </div>
      <div>
        <p className="text-teal-200 ">Price:</p>
        <p className="font-bold text-stone-100">{`${(
          event.data.price /
          10 ** 8
        ).toFixed(2)} $APT`}</p>
      </div>
    </div>
  );
};
