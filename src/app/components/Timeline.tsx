"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

const Timeline = () => {
  const padding = { top: 30, left: 30, right: 30, bottom: 30 };
  const graphRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <div className="timeline-section">
      <svg
        ref={graphRef}
        className="bg-WHITE w-full aspect-22/9 rounded-60"
      ></svg>
    </div>
  );
};
export default Timeline;
