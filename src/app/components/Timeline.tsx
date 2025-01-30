"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { timeline } from "../services/timeline";
import { get } from "http";

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
    // const x = d3
    //   .scaleBand()
    //   .domain(
    //     timeline.sort((a, b) => a.year - b.year).map((d) => d.year.toString())
    //   )
    //   .range([PADDING.left, getDimensions().width - PADDING.right]);

    // d3.select(graphRef.current)
    //   .select("#group-timeline")
    //   .append("g")
    //   .attr("class", "stroke-4")
    //   .attr("transform", `translate(0, ${HEIGHT_TIMELINE / 2})`)
    //   .call(d3.axisBottom(x))
    //   .selectAll("text")
    //   .attr("transform", `translate(0, -${HEIGHT_TIMELINE / 4})`)
    //   .attr("class", "text-2xl font-bold");

    const tickWidth =
      (getDimensions().width - PADDING.left - PADDING.right) / timeline.length;

    const groups = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .selectAll("g.tick")
      .data(timeline)
      .enter()
      .append("g")
      .attr("class", "tick");

    groups
      .append("text")
      .attr("x", (d, i) => PADDING.left + i * tickWidth)
      .attr("y", HEIGHT_TIMELINE / 4)
      .text((d) => d.year)
      .attr("text-anchor", "middle");

    groups
      .append("line")
      .attr("x1", (d, i) => PADDING.left + i * tickWidth)
      .attr("x2", (d, i) => PADDING.left + i * tickWidth)
      .attr("y1", HEIGHT_TIMELINE / 2)
      .attr("y2", HEIGHT_TIMELINE)
      .attr("class", "stroke-4 stroke-BLACK");

    const handleZoom = (e: any) => {
      console.log(e.transform);

      d3.select(graphRef.current)
        .select("#zoomable")
        .attr("transform", `scale(${e.transform.k}, 1)`);
    };

    // This function allows zoom/pan and also limits the zoom and the pan to a certain extent.
    const zoomFunction = d3
      .zoom()
      .on("zoom", handleZoom)
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [getDimensions().width, getDimensions().height],
      ]);

    // Attach the zoom/pan functionality to the svg element.
    d3.select(graphRef.current).call(zoomFunction);
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

    // d3.select(graphRef.current)
    //   .select("#group-timeline")
    //   .select("g")
    //   .transition()
    //   .call(d3.axisBottom(x));
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
        className=" w-full max-h-full aspect-22/9 rounded-60 origin-center"
      >
        <rect x={1} y={1} id="svg-wrapper" className="fill-WHITE"></rect>
        <g id="zoomable">
          <g id="group-timeline"></g>
          <g id="group-graph"></g>
        </g>
        <rect
          x={2}
          y={HEIGHT_TIMELINE + 2}
          className="fill-none stroke-BLACK stroke-4"
          id="main-graph-stroke"
          rx="60"
        />
      </svg>
    </div>
  );
};
export default Timeline;
