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

  const [day, setDay] = useState<number>();
  const [month, setMonth] = useState<number>();
  const [year, setYear] = useState<number>();

  const [dailyData, setDailyData] = useState<DailyData | null>(null);

  const [dataGaza, setDataGaza] = useState<GazaData | null>(null);
  const [dataWestBank, setDataWestBank] = useState<WestBankData | null>(null);
  const [dataWestBankPrevious, setDataWestBankPrevious] =
    useState<WestBankData | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const gsapTimeline = useRef<gsap.core.Timeline>(null);

  const dayRef = useRef<HTMLSpanElement | null>(null);
  const monthRef = useRef<HTMLSpanElement | null>(null);
  const yearRef = useRef<HTMLSpanElement | null>(null);

  const dayInputRef = useRef<HTMLSelectElement | null>(null);
  const monthInputRef = useRef<HTMLSelectElement | null>(null);
  const yearInputRef = useRef<HTMLSelectElement | null>(null);

  const getDataGaza = async (date: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/casualties_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: GazaData[]) => {
          const date1 = data.find((d: GazaData) => {
            const localDate = new Date(d.report_date);
            localDate.setHours(0, 0, 0, 0);
            return localDate.getTime() === date.getTime();
          });

          if (date1) {
            setDataGaza(date1);
          }
        });
      }
    });
  };

  const getDataWestBank = async (date: Date) => {
    await fetch(
      "https://data.techforpalestine.org/api/v2/west_bank_daily.json"
    ).then(async (response) => {
      if (response.ok) {
        await response.json().then((data: WestBankData[]) => {
          const date1 = data.find((d: WestBankData) => {
            const localDate = new Date(d.report_date);
            localDate.setHours(0, 0, 0, 0);
            return localDate.getTime() === date.getTime();
          });

          if (date1) {
            setDataWestBank(date1);
            if (!date1.verified) {
              const previousDay = data.find((d: WestBankData) => {
                const localDate = new Date(d.report_date);
                localDate.setHours(0, 0, 0, 0);
                return (
                  localDate.getTime() === date.getTime() - 24 * 60 * 60 * 1000
                );
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

    if (lastDate) {
      setDay(lastDate.getDate());
      setMonth(lastDate.getMonth());
      setYear(lastDate.getFullYear());
      setLoaded(true);
    }
  };

  const updateWidths = () => {
    if (dayRef.current && dayInputRef.current) {
      gsap.to(dayInputRef.current, {
        width: dayRef.current.getBoundingClientRect().width,
      });
    }

    if (monthRef.current && monthInputRef.current) {
      gsap.to(monthInputRef.current, {
        width: monthRef.current.getBoundingClientRect().width,
      });
    }

    if (yearRef.current && yearInputRef.current) {
      gsap.to(yearInputRef.current, {
        width: yearRef.current.getBoundingClientRect().width,
      });
    }
  };

  const dayToString = (day: number) => {
    if (day < 10) {
      return "0" + day;
    }
    return day;
  };

  const monthToString = (month: number) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleDateString("en-US", { month: "long" });
  };

  const dayMinus = () => {
    if (day !== undefined && month !== undefined && year !== undefined) {
      const date = new Date(year, month, day);
      const newDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
      setDay(newDate.getDate());
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
    }
  };

  const dayPlus = () => {
    if (day !== undefined && month !== undefined && year !== undefined) {
      const date = new Date(year, month, day);
      const newDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
      setDay(newDate.getDate());
      setMonth(newDate.getMonth());
      setYear(newDate.getFullYear());
    }
  };

  useEffect(() => {
    getLastUpdatedDate();
  }, []);

  useEffect(() => {
    if (loaded) getData();
  }, [loaded]);

  const getData = () => {
    if (year && month && day) {
      const date = new Date(year, month, day);

      if (date) {
        getDataGaza(date);
        getDataWestBank(date);
      }
    }
  };

  useEffect(() => {
    if (day !== undefined && month !== undefined && year !== undefined) {
      updateWidths();
    }
    const timeout = setTimeout(getData, 300);
    return () => {
      clearTimeout(timeout);
    };
  }, [day, month, year]);

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
            setScrolled(false);
            gsapTimeline?.current?.reverse();
          },
        },
        onComplete: () => {
          setScrolled(true);
        },
      });
    },
    { scope: mainRef, dependencies: [mainRef] }
  );

  return (
    <div ref={mainRef} className="main">
      <BackgroundText eyeOpen={eyeOpen} />
      <Eye eyeOpen={eyeOpen} dailyData={dailyData} />
      <div className="fixed top-0 left-0 w-screen h-screen flex flex-col p-20 justify-start items-center text-WHITE">
        <div className="fixed opacity-0 pointer-events-none text-6xl font-bold">
          {month !== undefined && (
            <span className="border-2 border-transparent" ref={monthRef}>
              {monthToString(month)}
            </span>
          )}
          {day !== undefined && (
            <span className="border-2 border-transparent" ref={dayRef}>
              {dayToString(day)}
            </span>
          )}
          {year !== undefined && (
            <span className="border-2 border-transparent" ref={yearRef}>
              {year}
            </span>
          )}
        </div>
        {day !== undefined && month !== undefined && year !== undefined && (
          <div className="flex flex-row items-center gap-12">
            <button
              onClick={() => {
                dayMinus();
                setEyeOpen(false);
              }}
            >
              <svg className="fill-WHITE w-14" viewBox="0 0 37.76 43.44">
                <path d="M.03,21.79c.13.1,4.11,2.11,9.72,5.61,3.39,1.51,6.65,4.23,9.46,5.63,2.2,1.92,5.28,3.04,8.59,4.79,6.48,3.28,9.85,4.59,9.72,5.61.06-.58-.27-5.09,0-11.23.33-2.27-.13-6.8.23-10.28-.26-4.28.22-7.62-.23-10.57-.62-5.57.27-11.83,0-11.23.06-.81-3.39,2.08-9.72,5.61-3.17,1.65-5.68,2.58-9.21,5.06-3.91,1.35-6.6,3.32-8.85,5.36C4.46,19.17-.4,21.78.03,21.79Z" />
              </svg>
            </button>

            <div className="eye-date-picker">
              <select
                onChange={(e) => {
                  setMonth(Number.parseInt(e.target.value));
                }}
                value={month}
                ref={monthInputRef}
              >
                {new Array(12).fill(0).map((_, i) => {
                  const date = new Date();
                  date.setMonth(i);
                  return (
                    <option key={i} value={i}>
                      {date.toLocaleDateString("en-US", { month: "long" })}
                    </option>
                  );
                })}
              </select>

              <div>
                <select
                  onChange={(e) => {
                    setDay(Number.parseInt(e.target.value));
                  }}
                  value={day}
                  ref={dayInputRef}
                >
                  {new Array(new Date(year, month + 1, 0).getDate())
                    .fill(0)
                    .map((_, i) => {
                      return (
                        <option key={i + 1} value={i + 1}>
                          {dayToString(i + 1)}
                        </option>
                      );
                    })}
                </select>
                <span>,</span>
              </div>

              <select
                onChange={(e) => {
                  setYear(Number.parseInt(e.target.value));
                }}
                ref={yearInputRef}
                className="input-year"
                value={year}
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
              </select>
            </div>
            <button
              onClick={() => {
                dayPlus();
                setEyeOpen(false);
              }}
            >
              <svg className="fill-WHITE w-14" viewBox="0 0 37.81 43.32">
                <path d="M37.73,21.67c-.34.49-4.88-2.53-9.72-5.61-3.04-1.89-5.67-3.74-8.85-5.24-2.83-1.84-7.62-3.58-9.21-5.18C4.13,2.61.15-.12.23.02.55-.36-.42,5.22.23,11.24c-.37,3.43.25,7.02.17,10.7.31,3.71.09,7.21-.17,10.15.07,7,.79,11.05,0,11.23.11-.42,4.54-2.5,9.72-5.61,2.94-1.98,6.6-3.94,9.04-5.18,2.63-1.25,6.32-3.25,9.02-5.24,6.3-3.74,10.45-5.59,9.72-5.61Z" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <Timeline scrolled={scrolled} gsapTimeline={gsapTimeline.current} />
    </div>
  );
}
