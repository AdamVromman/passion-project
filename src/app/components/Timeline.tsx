"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { timeline } from "../services/timeline";

const PADDING = { top: 30, left: 30, right: 30, bottom: 30 };
const HEIGHT_TIMELINE = 150;

const Timeline = () => {
  const graphRef = useRef<SVGSVGElement | null>(null);

  const getDimensions = () => {
    if (graphRef.current)
      return {
        width: graphRef.current.clientWidth,
        height: graphRef.current.clientHeight,
      };
    const svg = document.getElementById("svg-graph");
    if (svg) return { width: svg.clientWidth, height: svg.clientHeight };
    return { width: -1, height: -1 };
  };

  const drawTimeline = () => {
    const x = d3
      .scaleBand()
      .domain(
        timeline.sort((a, b) => a.year - b.year).map((d) => d.year.toString())
      )
      .range([PADDING.left, getDimensions().width - PADDING.right]);

    d3.select(graphRef.current)
      .select("#group-timeline")
      .append("g")
      .attr("class", "stroke-4")
      .attr("transform", `translate(0, ${HEIGHT_TIMELINE / 2})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", `translate(0, -${HEIGHT_TIMELINE / 4})`)
      .attr("class", "text-2xl font-bold");
  };

  const resize = () => {
    if (getDimensions().height < HEIGHT_TIMELINE + 120) {
      //TODO: ANIMATE EXIT GRAPH

      d3.select(graphRef.current)
        .select("#group-graph")
        .attr("display", "none");
    } else {
      //TODO: ANIMATE ENTER GRAPH

      d3.select(graphRef.current)
        .select("#group-graph")
        .attr("display", "block");
    }

    d3.select(graphRef.current)
      .select("#main-graph-stroke")
      .attr("width", getDimensions().width - 4)
      .attr("height", getDimensions().height - HEIGHT_TIMELINE - 4);

    d3.select(graphRef.current)
      .select("#svg-wrapper")
      .attr("width", getDimensions().width - 4)
      .attr("height", getDimensions().height - 4);

    const x = d3
      .scaleBand()
      .domain(
        timeline.sort((a, b) => a.year - b.year).map((d) => d.year.toString())
      )
      .range([PADDING.left, getDimensions().width - PADDING.right]);

    d3.select(graphRef.current)
      .select("#group-timeline")
      .select("g")
      .transition()
      .call(d3.axisBottom(x));
  };

  useEffect(() => {
    resize();
    drawTimeline();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="timeline-section">
      <svg
        id="svg-graph"
        ref={graphRef}
        className=" w-full max-h-full aspect-22/9 rounded-60"
      >
        <rect x={1} y={1} id="svg-wrapper" className="fill-WHITE"></rect>
        <g id="group-timeline"></g>
        <g id="group-graph">
          <rect
            x={2}
            y={HEIGHT_TIMELINE + 2}
            className="fill-none stroke-BLACK stroke-4"
            id="main-graph-stroke"
            rx="60"
          />
        </g>
      </svg>
    </div>
  );
};
export default Timeline;
