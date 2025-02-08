"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef, useState } from "react";
import { LETTERS, LETTERS_MOBILE } from "../services/statics";

interface Props {
  eyeOpen: boolean;
  windowWidth: number;
}

const BackgroundText = ({ eyeOpen, windowWidth }: Props) => {
  const ref = useRef(null);

  const [letters, setLetters] = useState(LETTERS);
  const [viewBox, setViewBox] = useState("0 0 1356.03 696.86");

  useGSAP(
    () => {
      if (eyeOpen) {
        gsap.to(ref.current, {
          opacity: 0.1,
          scale: 0.95,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    },
    { scope: ref, dependencies: [eyeOpen] }
  );

  useEffect(() => {
    setLetters(windowWidth >= 1024 ? LETTERS : LETTERS_MOBILE);
    setViewBox(
      windowWidth >= 1024 ? "0 0 1356.03 696.86" : "0 0 885.63 1021.6"
    );
  }, [windowWidth]);

  return (
    <svg
      ref={ref}
      className="w-dvw h-dvh lg:p-60 lg:pb-120 fill-BEIGE origin-center"
      viewBox={viewBox}
    >
      {letters}
    </svg>
  );
};

export default BackgroundText;
