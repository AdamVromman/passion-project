"use client";

import { useEffect, useRef, useState } from "react";
import BackgroundText from "./components/BackgroundText";
import Eye from "./components/Eye";
import { DailyData, GazaData, WestBankData } from "./services/types";
import Timeline from "./components/Timeline";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function Home() {
  const [eyeOpen, setEyeOpen] = useState(false);

  const [day, setDay] = useState<Date | null>(null);

  const [dailyData, setDailyData] = useState<DailyData | null>(null);

  const [dataGaza, setDataGaza] = useState<GazaData | null>(null);
  const [dataWestBank, setDataWestBank] = useState<WestBankData | null>(null);
  const [dataWestBankPrevious, setDataWestBankPrevious] =
    useState<WestBankData | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const gsapTimeline = useRef<gsap.core.Timeline>(null);

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

  const getLastUpdatedDate = async () => {
    let lastDate: Date = new Date("2025-01-28");

    await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: GazaData[]) => {
          const lastGazaDate = new Date(data[data.length - 1].report_date);
          if (lastGazaDate.getTime() > lastDate.getTime())
            lastDate = lastGazaDate;
        });
      }
    });

    await fetch(
      "https://data.techforpalestine.org/api/v2/west_bank_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: WestBankData[]) => {
          const lastWestBankDate = new Date(data[data.length - 1].report_date);
          if (lastWestBankDate.getTime() > lastDate.getTime())
            lastDate = lastWestBankDate;
        });
      }
    });

    setDay(lastDate);
  };

  useEffect(() => {
    getLastUpdatedDate();
  }, []);

  useEffect(() => {
    if (day) {
      getDataGaza(day);
      getDataWestBank(day);
    }
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

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      gsapTimeline.current = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "49",
          onEnterBack: () => {
            gsapTimeline?.current?.reverse();
          },
        },
      });
    },
    { scope: mainRef, dependencies: [mainRef] }
  );

  return (
    <div ref={mainRef} className="main">
      <BackgroundText eyeOpen={eyeOpen} />
      <Eye eyeOpen={eyeOpen} dailyData={dailyData} />
      <div className="fixed top-0 left-0 w-screen h-screen bg-red flex flex-col p-20 items-center text-WHITE">
        <p className=" w-fit">{day?.toLocaleDateString("nl-BE")}</p>
        {dailyData && (
          <div className="flex gap-4">
            <span className="">{dailyData.gazaKilled}</span>
            <span className="">{dailyData.gazaInjured}</span>
            <span className="">{dailyData.westBankKilled}</span>
            <span className="">{dailyData.westBankInjured}</span>
          </div>
        )}
        <button
          onClick={() => {
            setEyeOpen(false);
            setDay(new Date(day.getTime() - 24 * 60 * 60 * 1000));
          }}
          className="bg-RED p-15 rounded-full"
        >
          Day --
        </button>
        <button
          onClick={() => {
            setEyeOpen(false);
            setDay(new Date(day.getTime() + 24 * 60 * 60 * 1000));
          }}
          className="bg-RED p-15 rounded-full"
        >
          Day ++
        </button>
      </div>
      <Timeline gsapTimeline={gsapTimeline.current} />
    </div>
  );
}
