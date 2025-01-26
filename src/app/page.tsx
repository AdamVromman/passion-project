"use client";

import { useEffect, useState } from "react";
import BackgroundText from "./components/BackgroundText";
import Eye from "./components/Eye";

interface data {
  report_date: string;
  killed: number;
}

export default function Home() {
  const [eyeOpen, setEyeOpen] = useState(false);

  const date = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [day, setDay] = useState(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), 1, 0)
  );

  const [killed, setKilled] = useState(0);

  const getData = async (day: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: data[]) => {
          const date1 = data.find((d: data) => {
            const date = new Date(d.report_date);
            return date.getTime() === day.getTime();
          });

          console.log(date1);

          if (date1) {
            setKilled(date1.killed);
            setTimeout(() => {
              setEyeOpen(true);
            }, 1000);
          }
        });
      }
    });
  };

  useEffect(() => {
    getData(day);
  }, [day]);

  return (
    <div className="bg-BLACK">
      <button
        onClick={() => {
          setEyeOpen(false);
          setDay(new Date(day.getTime() - 24 * 60 * 60 * 1000));
        }}
        className="z-20 fixed top-15 left-15 bg-RED p-15 rounded-full"
      >
        Day --
      </button>
      <button
        onClick={() => {
          setEyeOpen(false);
          setDay(new Date(day.getTime() + 24 * 60 * 60 * 1000));
        }}
        className="z-20 fixed top-15 left-120 bg-RED p-15 rounded-full"
      >
        Day ++
      </button>
      <BackgroundText eyeOpen={eyeOpen} />
      <Eye eyeOpen={eyeOpen} killed={killed} />
    </div>
  );
}
