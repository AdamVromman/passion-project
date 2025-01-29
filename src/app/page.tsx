"use client";

import { useEffect, useState } from "react";
import BackgroundText from "./components/BackgroundText";
import Eye from "./components/Eye";
import { DailyData, GazaData, WestBankData } from "./services/types";

export default function Home() {
  const [eyeOpen, setEyeOpen] = useState(false);

  const date = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [day, setDay] = useState(
    new Date(date.getFullYear(), date.getMonth() - 1, date.getDate(), 1, 0)
  );

  const [dailyData, setDailyData] = useState<DailyData | null>(null);

  const [dataGaza, setDataGaza] = useState<GazaData | null>(null);
  const [dataWestBank, setDataWestBank] = useState<WestBankData | null>(null);
  const [dataWestBankPrevious, setDataWestBankPrevious] =
    useState<WestBankData | null>(null);

  const getDataGaza = async (day: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: GazaData[]) => {
          const date1 = data.find((d: GazaData) => {
            const date = new Date(d.report_date);
            return date.getTime() === day.getTime();
          });

          if (date1) {
            setDataGaza(date1);
          }
        });
      }
    });
  };

  const getDataWestBank = async (day: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/west_bank_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: WestBankData[]) => {
          const date1 = data.find((d: WestBankData) => {
            const date = new Date(d.report_date);
            return date.getTime() === day.getTime();
          });

          if (date1) {
            setDataWestBank(date1);
            if (!date1.verified) {
              const previousDay = data.find((d: WestBankData) => {
                const date = new Date(d.report_date);
                return date.getTime() === day.getTime() - 24 * 60 * 60 * 1000;
              });

              if (previousDay) {
                setDataWestBankPrevious(previousDay);
              }
            }
          }
        });
      }
    });
  };

  useEffect(() => {
    getDataGaza(day);
    getDataWestBank(day);
  }, [day]);

  useEffect(() => {
    if (
      dataGaza &&
      dataWestBank &&
      dataGaza.report_date === dataWestBank.report_date
    ) {
      if (dataWestBank.verified) {
        setDailyData(() => {
          return {
            gazaInjured: dataGaza.injured,
            gazaKilled: dataGaza.killed,
            westBankInjured: dataWestBank.verified.injured,
            westBankKilled: dataWestBank.verified.killed,
          };
        });
      } else {
        if (dataWestBankPrevious) {
          setDailyData(() => {
            return {
              gazaInjured: dataGaza.injured,
              gazaKilled: dataGaza.killed,
              westBankInjured:
                dataWestBank.injured_cum - dataWestBankPrevious.injured_cum,
              westBankKilled:
                dataWestBank.killed_cum - dataWestBankPrevious.killed_cum,
            };
          });
        }
      }
    }
  }, [dataGaza, dataWestBank, dataWestBankPrevious]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (dailyData) {
      timeout = setTimeout(() => {
        if (
          dailyData.gazaInjured !== 0 ||
          dailyData.gazaKilled !== 0 ||
          dailyData.westBankInjured !== 0 ||
          dailyData.westBankKilled !== 0
        ) {
          setEyeOpen(true);
        }
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [dailyData]);

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
      <Eye eyeOpen={eyeOpen} dailyData={dailyData} />
      <div className="fixed top-0 left-0 w-screen h-screen bg-red flex flex-col p-20 items-center text-WHITE">
        <p className=" w-fit">{day.toLocaleDateString("nl-BE")}</p>
        {dailyData && (
          <div className="flex gap-4">
            <span className="">{dailyData.gazaKilled}</span>
            <span className="">{dailyData.gazaInjured}</span>
            <span className="">{dailyData.westBankKilled}</span>
            <span className="">{dailyData.westBankInjured}</span>
          </div>
        )}
      </div>
    </div>
  );
}
