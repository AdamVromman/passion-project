"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { timeline } from "../services/timeline";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";
import { get } from "http";

const PADDING = { top: 30, left: 60, right: 60, bottom: 60 };
const HEIGHT_TIMELINE = 150;

const Timeline = () => {
  const graphRef = useRef<SVGSVGElement | null>(null);

  const { contextSafe } = useGSAP({ scope: graphRef });

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
      .attr("y", 0)
      .attr("width", 200)
      .attr("height", 200)
      .attr("viewBox", "0 0 200 200")
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
      .attr("class", "unzoom text")
      .text((d) => d.year)
      .attr("width", 100)
      .attr("y", HEIGHT_TIMELINE / 4)
      .attr("x", 25)
      .attr("opacity", 0)

      .attr("text-anchor", "middle");

    groups
      .append("line")
      .attr("x1", 25)
      .attr("x2", 25)
      .attr("y1", HEIGHT_TIMELINE / 2 - 16)
      .attr("y2", HEIGHT_TIMELINE / 2 - 16)
      .attr("opacity", 0)
      .attr("stroke-linecap", "round")
      .attr("class", "stroke-4 stroke-[#C4C0B6] unzoom line mt-[50]");

    d3.select(graphRef.current)
      .append("use")
      .attr("x", 0)
      .attr("y", HEIGHT_TIMELINE / 2)
      .attr("y2", HEIGHT_TIMELINE / 2)
      .attr("href", "#horizontal-axis");

    const handleZoom = (e: any) => {
      const zoomLevel = e.transform.k;

      //TODO: ANIMATE ZOOM
      console.log(zoomLevel);

      if (zoomLevel > 6) {
        animateTickIn("regular", zoomLevel);
      } else {
        animateTickOut("regular", zoomLevel);
      }

      if (zoomLevel > 2) {
        animateTickIn("lustrum", zoomLevel);
      } else {
        animateTickOut("lustrum", zoomLevel);
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

  const animateTickIn = (className: string, zoomLevel: number) => {
    gsap.to(`.${className} .line`, {
      opacity: 1,
      attr: { y2: HEIGHT_TIMELINE - 8 },
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    });

    gsap.to(`.${className} .text`, {
      opacity: 1,
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    });
  };

  const animateTickOut = (className: string, zoomLevel: number) => {
    gsap.to(`.${className} .line`, {
      attr: { y2: HEIGHT_TIMELINE / 2 - 16 },
      opacity: 0,
      duration: 0.1,
      ease: "power4.in",
    });

    gsap.to(`.${className} .text`, {
      opacity: 0,
      duration: 1,
      ease: "power4.out",
    });
  };

  const initialAnimation = contextSafe(() => {
    animateTickIn("always-show", 1);

    gsap.to("#horizontal-axis line", {
      duration: 1,
      attr: { x2: getDimensions().width - PADDING.right },
      ease: "power4.out",
      delay: 0.5,
    });

    gsap.to("#horizontal-axis polyline", {
      duration: 1,
      attr: {
        points: `${getDimensions().width - PADDING.right - 15}, -15 , ${
          getDimensions().width - PADDING.right
        }, 0, ${getDimensions().width - PADDING.right - 15}, 15`,
      },
      ease: "power4.out",
      delay: 0.5,
    });

    gsap.to("#vertical-axis line", {
      duration: 1,
      attr: { y2: PADDING.top + HEIGHT_TIMELINE + PADDING.top },
      ease: "power4.out",
      delay: 0.5,
    });

    gsap.to("#vertical-axis polyline", {
      duration: 1,
      delay: 0.5,
      attr: {
        points: `${PADDING.left - 15}, ${
          PADDING.top + HEIGHT_TIMELINE + PADDING.top + 15
        } , ${PADDING.left}, ${PADDING.top + HEIGHT_TIMELINE + PADDING.top}, ${
          PADDING.left + 15
        }, ${PADDING.top + HEIGHT_TIMELINE + PADDING.top + 15}`,
      },
      ease: "power4.out",
    });
  });

  const resize = () => {
    initialAnimation();

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
      .attr("width", getDimensions().width - 8)
      .attr("height", getDimensions().height - HEIGHT_TIMELINE - 8);

    d3.select(graphRef.current)
      .select("#svg-wrapper")
      .attr("width", getDimensions().width - 8)
      .attr("height", getDimensions().height - 8);
  };

  useEffect(() => {
    drawTimeline();
    resize();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="timeline-section">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="svg-graph"
        ref={graphRef}
        strokeLinecap="round"
        strokeLinejoin="round"
        className=" w-full h-full max-h-full aspect-22/9 rounded-60 origin-center"
      >
        <defs>
          <g id="horizontal-axis">
            <line
              x1={PADDING.left}
              x2={PADDING.left}
              y1={0}
              y2={0}
              className="stroke-8 stroke-BLACK"
            />
            <polyline
              points={`${PADDING.left - 15}, -15 , ${PADDING.left}, 0, ${
                PADDING.left - 15
              }, 15`}
              className="stroke-8 stroke-BLACK fill-none"
            />
          </g>
        </defs>
        <rect x={4} y={4} id="svg-wrapper" className="fill-WHITE"></rect>
        <g id="zoomable">
          <g id="group-timeline"></g>
          <g id="group-graph"></g>
        </g>
        <rect
          x={4}
          y={HEIGHT_TIMELINE + 4}
          className="pointer-events-none stroke-BLACK fill-WHITE stroke-8"
          id="main-graph-stroke"
          rx="60"
        />
        <use
          y={getDimensions().height - PADDING.bottom}
          href="#horizontal-axis"
        />
        <g id="vertical-axis">
          <line
            x1={PADDING.left}
            x2={PADDING.left}
            y1={getDimensions().height - PADDING.bottom}
            y2={getDimensions().height - PADDING.bottom}
            className="stroke-8 stroke-BLACK"
          />
          <polyline
            points={`${PADDING.left - 15}, ${
              getDimensions().height - PADDING.bottom + 15
            }, ${PADDING.left}, ${getDimensions().height - PADDING.bottom}, ${
              PADDING.left + 15
            }, ${getDimensions().height - PADDING.bottom + 15}`}
            className="stroke-8 stroke-BLACK fill-none"
          />
        </g>
      </svg>
    </div>
  );
};
export default Timeline;
