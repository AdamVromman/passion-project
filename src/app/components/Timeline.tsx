"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { timeline } from "../services/timeline";
import gsap from "gsap";

const PADDING = { top: 30, left: 60, right: 60, bottom: 30 };
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
    const tickWidth =
      (getDimensions().width - PADDING.left - PADDING.right) / timeline.length;

    const groups = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .selectAll("svg.tick")
      .data(timeline)
      .enter()
      .append("svg")
      .attr("x", (_, i) => PADDING.left + i * tickWidth)
      .attr("opacity", 0)
      .attr("class", (d, i) => {
        let className = "tick";

        if (i === 0 || i === timeline.length - 1 || d.year % 10 === 0)
          className += " always-show";
        else if (d.year % 5 === 0) className += " lustrum";
        else className += " regular";

        return className;
      });

    groups
      .append("text")
      .attr("class", "unzoom")
      .text((d) => d.year)
      .attr("width", 100)
      .attr("y", HEIGHT_TIMELINE / 4)
      .attr("x", 25)
      .attr("text-anchor", "middle");

    groups
      .append("line")
      .attr("x1", 25)
      .attr("x2", 25)
      .attr("y1", HEIGHT_TIMELINE / 2)
      .attr("y2", HEIGHT_TIMELINE)
      .attr("class", "stroke-4 stroke-BLACK unzoom");

    const handleZoom = (e: any) => {
      const zoomLevel = e.transform.k;

      //TODO: ANIMATE ZOOM
      console.log(zoomLevel);
      d3.select(graphRef.current).selectAll(".decade").attr("y", 0);
      d3.select(graphRef.current).selectAll(".always-show").attr("y", 0);

      if (zoomLevel > 6) {
        d3.select(graphRef.current).selectAll(".regular").attr("y", 0);
      } else {
        d3.select(graphRef.current).selectAll(".regular").attr("y", 50);
      }

      if (zoomLevel > 2) {
        d3.select(graphRef.current).selectAll(".lustrum").attr("y", 0);
      } else {
        d3.select(graphRef.current).selectAll(".lustrum").attr("y", 50);
      }

      d3.select(graphRef.current)
        .select("#zoomable")
        .attr(
          "transform",
          `translate(${e.transform.x}, 0) scale(${zoomLevel}, 1)`
        );

      d3.select(graphRef.current)
        .selectAll(".unzoom")
        .attr("transform", `scale(${1 / zoomLevel}, 1)`);
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

  const initialAnimation = () => {
    gsap.to(".always-show", { y: 0, opacity: 1, duration: 1 });
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

    // const x = d3
    //   .scaleBand()
    //   .domain(
    //     timeline.sort((a, b) => a.year - b.year).map((d) => d.year.toString())
    //   )
    //   .range([PADDING.left, getDimensions().width - PADDING.right]);

    // d3.select(graphRef.current)
    //   .select("#group-timeline")
    //   .select("g")
    //   .transition()
    //   .call(d3.axisBottom(x));
  };

  useEffect(() => {
    resize();
    drawTimeline();
    initialAnimation();

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
          className="pointer-events-none fill-none stroke-BLACK stroke-4"
          id="main-graph-stroke"
          rx="60"
        />
      </svg>
    </div>
  );
};
export default Timeline;
