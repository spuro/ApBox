import React, { useEffect, useState, useRef } from "react";
import { AptosClient, Types, HexString, MaybeHexString } from "aptos";

const NODE_URL = "https://fullnode.mainnet.aptoslabs.com/v1";

const client = new AptosClient(NODE_URL);

type Props = {
  adapter: any;
  addressResources: Types.MoveResource[] | null;
};

function timeAgo(timestampString) {
  const timestampNumber = Number(timestampString / 1000);

  const txTime: any = new Date(timestampNumber);
  const secondsSince = (Date.now() - txTime) / 1000;

  const minutes_per_second = 60;
  const whole_minutes =
    (secondsSince - (secondsSince % minutes_per_second)) / minutes_per_second;
  const whole_seconds = secondsSince % minutes_per_second;

  const minutes_per_hour = 60;
  const whole_hours =
    (whole_minutes - (whole_minutes % minutes_per_hour)) / minutes_per_hour;

  const hours_per_day = 24;
  const whole_days =
    (whole_hours - (whole_hours % hours_per_day)) / hours_per_day;

  const days_per_week = 7;
  const whole_weeks =
    (whole_days - (whole_days % days_per_week)) / days_per_week;

  if (whole_minutes === 0) {
    return `${whole_seconds.toFixed(0)} seconds ago`;
  } else if (whole_hours === 0 && whole_days === 0) {
    return `${whole_minutes} minutes and ${whole_seconds.toFixed(
      0
    )} seconds ago`;
  } else if (whole_days === 0 && whole_weeks === 0) {
    return `${whole_hours} hours and ${
      whole_minutes - whole_hours * minutes_per_hour
    } minutes ago`;
  } else if (whole_weeks === 0) {
    return `${whole_days} days and ${
      whole_hours - whole_days * hours_per_day
    } hours ago`;
  } else {
    return `${whole_weeks} weeks and ${
      whole_days - whole_weeks * days_per_week
    } days ago`;
  }
}

function NFTHistory({ adapter, addressResources }: Props) {
  const [topazHistory, setTopazHistory] = useState([]);

  const fetchEvents = async () => {
    let txHistory = await client.getEventsByEventHandle(
      "0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2",
      "0x2c7bccf7b31baf770fdbcc768d9e9cb3d87805e255355df5db32ac9a669010a2::events::Events",
      "buy_events",
      { limit: 25 }
    );
    txHistory = txHistory.sort(
      (a, b) => parseFloat(b.sequence_number) - parseFloat(a.sequence_number)
    );
    console.log(txHistory);
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
        collection, but I&apos;m working on another solution.
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
        {topazHistory.map((event, i) => {
          return (
            <div key={i}>
              <EventHistory event={event} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NFTHistory;

const EventHistory = ({ event }) => {
  return (
    <div className="flex flex-row rounded-md border-2 border-teal-200 ">
      <div className="grid w-full grid-cols-3 gap-4 p-4">
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
        <p
          style={{ gridColumn: "1/4" }}
          className="w-full text-center text-sm text-teal-100"
        >
          {timeAgo(event.data.timestamp)}
        </p>
      </div>
      <div className="flex w-[100px] items-center justify-center ">
        <a
          href={`https://www.topaz.so/assets/${event.data.token_id.token_data_id.collection.replace(
            " ",
            "-"
          )}-${event.data.token_id.token_data_id.creator.slice(
            2,
            12
          )}/${event.data.token_id.token_data_id.name.replace("#", "%23")}/0`}
          target="_blank"
          rel="noreferrer"
        >
          <p className="text-teal-200">View</p>
        </a>
      </div>
    </div>
  );
};
