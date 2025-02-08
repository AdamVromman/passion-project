"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "@gsap/shockingly/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import { DailyData, EyeLineElement } from "../services/types";

interface Props {
  eyeOpen: boolean;
  dailyData: DailyData | null;
}

const CLOSED_LID =
  "M1036.74,348.47c-10.19,17.48-22.34,29.6-32.08,45.08-8.87,15.91-22.11,29.65-37.52,40.54-11.66,10.45-29.3,24.24-42.16,35.86-12.94,8.45-29.71,20.54-45.98,31.04-20.03,10.72-41.36,22.7-65.29,31.88-23.94,7.84-44.2,11.6-67.69,19.76-23.85,6.97-46.4,9.32-68.85,7.98-19.61-1.18-44.74-3.15-68.75-3.47-24.85-5.47-46.1-7-67.47-14.27-24.59-4.56-42.64-17.74-64.75-25.66-22.15-14.2-43.79-19.09-61.52-36.08-17.62-14.05-34.99-23.17-55.33-45.59-10.19-13.26-27.41-24.32-37.77-40.16-12.18-14.2-23.35-24.68-32.17-44.71-4.32-4.46,5.36-10.27,8.68-6.22,11.81,14.86,30.25,25.26,38.29,36.49,24.11,19.45,43.38,37.59,65.16,50.4,19.95,13.76,44.31,26.82,67.1,37.73,17.67,11.21,50.1,18.16,70.39,26.54,23.04,4.48,47.44,13.57,67.87,14.85,24.81,3.53,43.46.99,69.88,3.38,22.59,1.19,46.9-2.64,69.57-8.05,28.5-9.59,63.6-10.27,91.23-28.35,17.22-9.42,27.9-19.31,44.3-22.38,13.54-6.75,29.64-15.26,43.87-25.93,13.7-12.39,30.34-18.72,42.49-31.57,15.4-10.38,27.53-24.23,41.19-36.48,3.02-6.18,13.74-11.91,18.73-18.93.08,1.03,6.09-4.2,7.58-.25,1.8,3.83,3.39,2.67.99,6.58-1.53-2.91,1.2-1.07,0,0Z";

const OPEN_LID =
  "M1028.39,348.93c-23.51-18.33-49.22-32.07-72.82-51.31-24.08-15.59-52.37-26.97-77.72-39.17-23.71-10.65-55.03-18.79-81.34-26.77-28.43-6.34-53.87-14.28-83.68-14.09-27.16-5.32-55.4-1.93-84.14-.07-20.95.85-52.46,2.67-85.13,11.01-29.33.41-58.7,13.07-83.65,25.85-29.31,9.85-53.25,24.47-79.62,39.07-10.32,4.6-30.17,19.33-42.63,27.05-12.98,6.85-28.34,22.59-40.05,30.73-.41,4.38-6.79,2.57-7.56-.58-1.69-4.67-2.96-4.55-.29-6.61,8.68-13.39,22.59-28.72,34.85-39.53,11.98-17.91,23.87-26.07,39.87-34.52,21.13-15.94,46.15-28.81,67.97-44.54,24.9-13.91,51.05-21.35,73.78-31.26,28.55-6.66,49.44-19.31,76.13-19.01,24.76-3.06,52.98-6.45,80.11-6.43,33.03,3.07,52.42,2.02,79.08,6.12,26.69,2.1,53.48,11.39,77.33,18.65,29.1,9.67,51.04,16.78,73.79,31.17,26.27,12.85,48.96,26.69,68.46,43.66,13.23,9.61,30.94,22.85,40.13,34.23,12.26,11.19,26.74,26.7,35.14,39.28,5.07,3.85-2.45,11.27-7.99,7.09.03-.03,1.13.98,0,0Z";

const OPEN_CLIP =
  "M293.77,347.55s136.19-155.72,369.31-155.72,369.31,153.55,369.31,153.55v373.85H293.77v-371.68Z";
const CLOSED_CLIP =
  "M293.77,347.55s136.19,194.1,369.31,194.1,369.31-196.27,369.31-196.27v373.85H293.77v-371.68Z";

const Eye = ({ eyeOpen, dailyData }: Props) => {
  gsap.registerPlugin(MorphSVGPlugin);

  const ref = useRef(null);
  const eyeRef = useRef(null);
  const clipRef = useRef(null);

  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);
  const [gazaKilledElements, setGazaKilledElements] = useState<
    EyeLineElement[]
  >([]);

  const [gazaInjuredElements, setGazaInjuredElements] = useState<
    EyeLineElement[]
  >([]);

  const [westBankKilledElements, setWestBankKilledElements] = useState<
    EyeLineElement[]
  >([]);

  const [westBankInjuredElements, setWestBankInjuredElements] = useState<
    EyeLineElement[]
  >([]);

  const { contextSafe } = useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true });
      tl.to(eyeRef.current, {
        morphSVG: OPEN_LID,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: false,
      }).to(
        clipRef.current,
        {
          morphSVG: OPEN_CLIP,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: false,
        },
        "<"
      );
      setTimeline(tl);
    },
    { scope: ref }
  );
  const animateOpenEye = contextSafe(() => {
    if (timeline) {
      timeline.play();
    }
  });

  const animateCloseEye = contextSafe(() => {
    if (timeline) {
      timeline.reverse();
    }
  });

  const generateEye = () => {
    if (dailyData) {
      setGazaKilledElements(() => {
        const newElements = [];
        for (let i = 0; i < dailyData.gazaKilled; i++) {
          newElements.push({
            color: `rgb(0, ${151 + (-10 + Math.random() * 20)}, 53)`,
            rotation: 360 * Math.random(),
            duration: 3 * Math.random() + 2,
            size: 1 + 0.1 * Math.random(),
          });
        }
        return newElements;
      });

      setGazaInjuredElements(() => {
        const newElements = [];
        for (let i = 0; i < dailyData.gazaInjured; i++) {
          newElements.push({
            color: `rgb(0, ${151 + (-10 + Math.random() * 20)}, 53)`,
            rotation: 360 * Math.random(),
            duration: 3 * Math.random() + 2,
            size: 1 + 0.1 * Math.random(),
          });
        }
        return newElements;
      });

      setWestBankKilledElements(() => {
        const newElements = [];
        for (let i = 0; i < dailyData.westBankKilled; i++) {
          newElements.push({
            color: `rgb(${238 + (-10 + Math.random() * 20)}, 42, 52)`,
            rotation: 360 * Math.random(),
            duration: 3 * Math.random() + 2,
            size: 1 + 0.1 * Math.random(),
          });
        }
        return newElements;
      });

      setWestBankInjuredElements(() => {
        const newElements = [];
        for (let i = 0; i < dailyData.westBankInjured; i++) {
          newElements.push({
            color: `rgb(${238 + (-10 + Math.random() * 20)}, 42, 52)`,
            rotation: 360 * Math.random(),
            duration: 3 * Math.random() + 2,
            size: 1 + 0.1 * Math.random(),
          });
        }
        return newElements;
      });
    }
  };

  const animateEye = contextSafe(() => {
    if (dailyData) {
      for (let i = 0; i < dailyData.gazaKilled; i++) {
        gsap.fromTo(
          `#gaza-killed-${i}`,
          {
            rotate: 0,
            transformOrigin: "50% 100%",
            scale: 1,
          },
          {
            duration: 3 * Math.random() + 2,
            rotate: 360 * Math.random(),
            ease: "power3.out",
            scale: 1 + 0.1 * Math.random(),
          }
        );
      }

      for (let i = 0; i < dailyData.gazaInjured; i++) {
        gsap.fromTo(
          `#gaza-injured-${i}`,
          {
            rotate: 0,
            transformOrigin: "50% 100%",
            scale: 1,
          },
          {
            duration: 3 * Math.random() + 2,
            rotate: 360 * Math.random(),
            ease: "power3.out",
            scale: 1 + 0.1 * Math.random(),
          }
        );
      }

      for (let i = 0; i < dailyData.westBankKilled; i++) {
        gsap.fromTo(
          `#west-bank-killed-${i}`,
          {
            rotate: 0,
            transformOrigin: "50% 100%",
            scale: 1,
          },
          {
            duration: 3 * Math.random() + 2,
            rotate: 360 * Math.random(),
            ease: "power3.out",
            scale: 1 + 0.1 * Math.random(),
          }
        );
      }

      for (let i = 0; i < dailyData.westBankInjured; i++) {
        gsap.fromTo(
          `#west-bank-injured-${i}`,
          {
            rotate: 0,
            transformOrigin: "50% 100%",
            scale: 1,
          },
          {
            duration: 3 * Math.random() + 2,
            rotate: 360 * Math.random(),
            ease: "power3.out",
            scale: 1 + 0.1 * Math.random(),
          }
        );
      }
    }

    gsap.fromTo(
      "#circle-1",
      {
        x: 0,
        y: 0,
      },
      {
        x: 20 + 10 - Math.random() * 20,
        y: 20 + 10 - Math.random() * 20,
        duration: 4 + Math.random(),
      }
    );
    gsap.fromTo(
      "#circle-2",
      {
        x: 0,
        y: 0,
      },
      {
        x: 20 + 10 - Math.random() * 20,
        y: 20 + 10 - Math.random() * 20,
        duration: 4 + Math.random(),
      }
    );
  });

  useGSAP(
    () => {
      if (eyeOpen) {
        gsap.to(ref.current, {
          duration: 1,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
        });

        animateOpenEye();
        animateEye();
      } else animateCloseEye();
    },
    { scope: ref, dependencies: [eyeOpen] }
  );

  useGSAP(
    () => {
      generateEye();
    },
    { dependencies: [dailyData] }
  );

  return (
    <div>
      <svg
        ref={ref}
        className="absolute top-0 left-0 w-screen h-screen p-60 pb-120 fill-BEIGE opacity-20 scale-50"
        viewBox="0 0 1356.03 696.86"
      >
        <defs>
          <path
            id="trapezium1"
            d="M684.67,191.89c.2.13-31.63.29-32,0-.48-.18,1.82,4.72.66,11.18-.26,6.45,1.83,15.91,1.64,28.48,1.17,10.72.29,23.45,2.26,36.85,1.24,13.13-.8,25.37,2.02,36.82-.36,13.79-1.24,21.35,1.55,28.44.17,6.51.62,11.07.76,11.22-.46-.02,14.41,1.57,14.23,0-.01.3,1.91-5,.57-11.38,1.13-8.22,1.98-16.7,1.73-28.29,1.22-11.58.67-23.85,2.25-36.73,2.38-12.82,2.11-24.82,2.02-36.94,1.34-10.66,1.89-20.57,1.9-28.35-.34-7.08,1.68-11.16.4-11.32Z"
          />
          <path
            id="trapezium2"
            d="M678.67,231.89c.26,1.92-24.7-2.41-21,0,.2-.05,1.68,13.85,1.4,29.3-1.08,17.78,4.27,36.93,2.61,54.41,2.35,16.39,1.8,30.25,1.4,29.3.08-1.12,10.03.71,10.17,0,.72-.7-.47-10.62,1.4-29.3,2.74-16.24,3.49-37.69,2.61-54.41,1.94-18.63,2.11-27.2,1.4-29.3Z"
          />
        </defs>
        <clipPath id="clippath">
          <path ref={clipRef} d={CLOSED_CLIP} />
        </clipPath>
        <clipPath id="clippath-1">
          <path d="M293.79,351.81s136.34-155.89,369.71-155.89,369.71,153.71,369.71,153.71v374.26H293.79v-372.08Z" />
        </clipPath>

        <g id="eye-2">
          <g id="closed">
            <g clipPath="url(#clippath)">
              <g>
                {westBankInjuredElements.map((element, index) => (
                  <use
                    id={`west-bank-injured-${index}`}
                    x={0}
                    y={0}
                    key={`west-bank-injured-${index}`}
                    className="eye-line west-bank-killed"
                    href="#trapezium1"
                    fill={element.color}
                  />
                ))}
                {gazaInjuredElements.map((element, index) => (
                  <use
                    id={`gaza-injured-${index}`}
                    x={0}
                    y={0}
                    key={`gaza-injured-${index}`}
                    className="eye-line gaza-injured"
                    href="#trapezium1"
                    fill={element.color}
                  />
                ))}
                {gazaKilledElements.map((element, index) => (
                  <use
                    id={`gaza-killed-${index}`}
                    x={0}
                    y={0}
                    key={`gaza-killed-${index}`}
                    className="eye-line gaza-killed"
                    href="#trapezium2"
                    fill={element.color}
                  />
                ))}
                {westBankKilledElements.map((element, index) => (
                  <use
                    id={`west-bank-killed-${index}`}
                    x={0}
                    y={0}
                    key={`west-bank-killed-${index}`}
                    className="eye-line west-bank-killed"
                    href="#trapezium2"
                    fill={element.color}
                  />
                ))}

                <circle
                  className="fill-black"
                  cx="667.64"
                  cy="348.96"
                  r="59.48"
                />
                <circle
                  id="circle-1"
                  className="fill-white"
                  cx="705.64"
                  cy="308.96"
                  r="19.48"
                />
                <circle
                  id="circle-2"
                  className="fill-white"
                  cx="715.64"
                  cy="330.96"
                  r="9.48"
                />
              </g>
            </g>
            <path ref={eyeRef} d={CLOSED_LID} />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Eye;
