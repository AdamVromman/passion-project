"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MorphSVGPlugin } from "@gsap/shockingly/MorphSVGPlugin";
import { useGSAP } from "@gsap/react";
import { DailyData, EyeLineElement } from "../services/types";
import {
  OPEN_LID,
  OPEN_LID_MOBILE,
  OPEN_CLIP,
  OPEN_CLIP_MOBILE,
  CLOSED_CLIP,
  CLOSED_CLIP_MOBILE,
  CLOSED_LID,
  CLOSED_LID_MOBILE,
  PUPIL,
  PUPIL_MOBILE,
  GLARE_1,
  GLARE_2,
  GLARE_1_MOBILE,
  GLARE_2_MOBILE,
  DEFS,
  DEFS_MOBILE,
} from "../services/statics";

interface Props {
  eyeOpen: boolean;
  dailyData: DailyData | null;
  windowWidth: number;
}

const Eye = ({ eyeOpen, dailyData, windowWidth }: Props) => {
  gsap.registerPlugin(MorphSVGPlugin);

  const ref = useRef(null);
  const eyeRef = useRef(null);
  const clipRef = useRef(null);

  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);

  const [viewBox, setViewBox] = useState("0 0 1356.03 696.86");
  const [pupil, setPupil] = useState(PUPIL);
  const [glare1, setGlare1] = useState(GLARE_1);
  const [glare2, setGlare2] = useState(GLARE_2);
  const [defs, setDefs] = useState(DEFS);
  const [clip, setClip] = useState(CLOSED_CLIP);
  const [lid, setLid] = useState(CLOSED_LID);

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
      console.log(windowWidth);
      const tl = gsap.timeline({ paused: true });
      tl.to(eyeRef.current, {
        morphSVG: windowWidth >= 1024 ? OPEN_LID : OPEN_LID_MOBILE,
        duration: 0.4,
        ease: "power2.inOut",
        overwrite: false,
      }).to(
        clipRef.current,
        {
          morphSVG: windowWidth >= 1024 ? OPEN_CLIP : OPEN_CLIP_MOBILE,
          duration: 0.4,
          ease: "power2.inOut",
          overwrite: false,
        },
        "<"
      );
      setTimeline(tl);
    },
    { scope: ref, dependencies: [windowWidth] }
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
          scale: windowWidth ? 1 : 1.2,
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

  useEffect(() => {
    if (windowWidth >= 1024) {
      setViewBox("0 0 1356.03 696.86");
      setPupil(PUPIL);
      setGlare1(GLARE_1);
      setGlare2(GLARE_2);
      setDefs(DEFS);
      setClip(CLOSED_CLIP);
      setLid(CLOSED_LID);
    } else {
      setViewBox("0 0 885.63 1021.6");
      setPupil(PUPIL_MOBILE);
      setGlare1(GLARE_1_MOBILE);
      setGlare2(GLARE_2_MOBILE);
      setDefs(DEFS_MOBILE);
      setClip(CLOSED_CLIP_MOBILE);
      setLid(CLOSED_LID_MOBILE);
    }
  }, [windowWidth]);

  return (
    <div>
      <svg
        ref={ref}
        className="absolute top-0 left-0 w-dvw h-dvh lg:p-60 lg:pb-120 fill-BEIGE opacity-0 scale-50"
        viewBox={viewBox}
      >
        {defs}
        <clipPath id="clippath">
          <path ref={clipRef} d={clip} />
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

                {pupil}
                {glare1}
                {glare2}
              </g>
            </g>
            <path ref={eyeRef} d={lid} />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default Eye;
