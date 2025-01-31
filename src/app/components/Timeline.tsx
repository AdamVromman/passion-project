"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { timeline } from "../services/timelineService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const PADDING = { top: 30, left: 60, right: 60, bottom: 60 };
const HEIGHT_TIMELINE = 150;

const Timeline = () => {
  const graphRef = useRef<SVGSVGElement | null>(null);

  const [leftYear, setLeftYear] = useState(timeline[0].year);
  const [rightYear, setRightYear] = useState(
    timeline[timeline.length - 1].year
  );
  const [zoomLevel, setZoomLevel] = useState(1);

  const { contextSafe } = useGSAP({ scope: graphRef });

  const getDimensions = () => {
    if (graphRef.current)
      return {
        width: graphRef.current.clientWidth,
        height: graphRef.current.clientHeight,
      };
    return { width: -1, height: -1 };
  };

  const animateMain = contextSafe(() => {
    gsap.to("#horizontal-axis line", {
      duration: 1,
      attr: { x2: getDimensions().width - PADDING.right },
      ease: "power4.out",
    });

    gsap.to("#horizontal-axis polyline", {
      duration: 1,
      attr: {
        points: `${getDimensions().width - PADDING.right - 15}, -15 , ${
          getDimensions().width - PADDING.right
        }, 0, ${getDimensions().width - PADDING.right - 15}, 15`,
      },
      ease: "power4.out",
    });
    gsap.to("#vertical-axis line", {
      duration: 1,
      attr: { y2: PADDING.top + HEIGHT_TIMELINE + PADDING.top },
      ease: "power4.out",
    });
    gsap.to("#vertical-axis polyline", {
      duration: 1,
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

  const animateDecades = contextSafe(() => {
    gsap.to(`.decade .line`, {
      opacity: 1,
      attr: { y2: HEIGHT_TIMELINE - 8 },
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    });
    gsap.to(`.decade .line-2`, {
      opacity: 1,
      attr: { y2: getDimensions().height - PADDING.bottom - 16 },
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    });
    gsap.to(`.decade .text`, {
      opacity: 1,
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    });
  });

  const animateLustra = contextSafe(() => {
    gsap.to(`.lustrum .line`, {
      opacity: 1,
      attr: { y2: HEIGHT_TIMELINE - 8 },
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.01,
    });
    gsap.to(`.lustrum .line-2`, {
      opacity: 1,
      attr: { y2: getDimensions().height - PADDING.bottom - 16 },
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.01,
    });
    gsap.to(`.lustrum .text`, {
      opacity: 1,
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.01,
    });
  });

  const reverseLustra = contextSafe(() => {
    gsap.to(`.lustrum .line`, {
      opacity: 0,
      attr: { y2: HEIGHT_TIMELINE / 2 - 16 },
      duration: 0.6,
      ease: "power4.out",
    });
    gsap.to(`.lustrum .line-2`, {
      opacity: 0,
      attr: { y2: HEIGHT_TIMELINE + 16 },
      duration: 0.6,
      ease: "power4.out",
    });
    gsap.to(`.lustrum .text`, {
      opacity: 0,
      duration: 0.6,
      ease: "power4.out",
    });
  });

  const animateRegular = contextSafe(() => {
    gsap.to(`.regular *`, {
      opacity: 1,
      duration: 0.2,
      ease: "power4.out",
      overwrite: true,
    });
  });

  const reverseRegular = contextSafe(() => {
    gsap.to(`.regular *`, {
      opacity: 0,
      duration: 0.2,
      ease: "power4.out",
      overwrite: true,
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleZoom = (e: any) => {
    const zoom = e.transform.k;

    updateYears();

    //TODO: Correctly set the zoom level
    setZoomLevel(() => zoom);

    if (zoom > 6) {
      animateRegular();
    } else {
      reverseRegular();
    }

    if (zoom > 2) {
      animateLustra();
    } else {
      reverseLustra();
    }

    d3.select(graphRef.current)
      .select("#zoomable")
      .attr("transform", `translate(${e.transform.x}, 0) scale(${zoom}, 1)`);

    d3.select(graphRef.current)
      .selectAll(".unzoom")
      .attr("transform", `scale(${1 / zoom}, 1)`);
  };

  const drawTicks = () => {
    const tickWidth =
      (getDimensions().width - PADDING.left - PADDING.right) / timeline.length;

    const groups = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .selectAll("svg.tick")
      .data(timeline)
      .enter()
      .append("svg")
      .attr("id", (d) => `tick-${d.year}`)
      .attr("x", (_, i) => PADDING.left + i * tickWidth)
      .attr("y", 0)
      .attr(
        "class",
        (d) =>
          `tick ${
            d.year % 10 === 0
              ? "decade"
              : d.year % 5 === 0
              ? "lustrum"
              : "regular"
          }`
      );

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
      .attr("class", "stroke-4 stroke-[#C4C0B6] unzoom line");

    groups
      .append("line")
      .attr("x1", 25)
      .attr("x2", 25)
      .attr("y1", HEIGHT_TIMELINE + 16)
      .attr("y2", HEIGHT_TIMELINE + 16)
      .attr("opacity", 0)
      .attr("stroke-linecap", "round")
      .attr("class", "stroke-4 stroke-[#C4C0B6] unzoom line-2");
  };

  const updateTicks = () => {
    //TODO: Correctly update ticks when zoomed in
    const tickWidth =
      (getDimensions().width - PADDING.left - PADDING.right) / timeline.length;

    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll("svg.tick")
      .attr("x", (_, i) => PADDING.left + i * zoomLevel * tickWidth);
  };

  const drawTimeline = () => {
    drawTicks();

    // This function allows zoom/pan and also limits the zoom and the pan to a certain extent.
    const zoomFunction = d3
      .zoom<SVGSVGElement, unknown>()
      .on("zoom", handleZoom)
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [getDimensions().width, getDimensions().height],
      ]);

    // Attach the zoom/pan functionality to the svg element.
    if (graphRef.current) {
      d3.select(graphRef.current).call(zoomFunction);
    }
  };

  const resize = () => {
    updateTicks();
    animateMain();
    animateDecades();
    console.log(zoomLevel);
    if (zoomLevel > 2) animateLustra();
    if (zoomLevel > 6) animateRegular();

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
      .select("#horizontal-axis-bottom")
      .attr("y", getDimensions().height - PADDING.bottom);

    d3.select(graphRef.current)
      .select("#vertical-axis line")
      .attr("y1", getDimensions().height - PADDING.bottom);

    d3.select(graphRef.current)
      .select("#main-graph-stroke")
      .attr("width", getDimensions().width - 8)
      .attr("height", getDimensions().height - HEIGHT_TIMELINE - 8);

    d3.select(graphRef.current)
      .select("#svg-wrapper")
      .attr("width", getDimensions().width - 8)
      .attr("height", getDimensions().height - 8);
  };

  const updateYears = () => {
    const container = document?.getElementById("svg-wrapper");

    if (container) {
      const { left, right } = container.getBoundingClientRect();

      for (let i = 0; i < timeline.length; i++) {
        const tick = document?.getElementById(`tick-${timeline[i].year}`);
        if (tick) {
          const tickLeft = tick.getBoundingClientRect().left;
          if (tickLeft >= left) {
            setLeftYear(timeline[i + (-1 + zoomLevel)].year);
            break;
          }
        }
      }

      for (let i = timeline.length - 1; i >= 0; i--) {
        const tick = document?.getElementById(`tick-${timeline[i].year}`);
        if (tick) {
          const tickRight = tick.getBoundingClientRect().right;
          if (tickRight <= right) {
            setRightYear(timeline[i + (1 - zoomLevel)].year);
            break;
          }
        }
      }
    }
  };

  useEffect(() => {
    drawTimeline();
    resize();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return (
    <div className="timeline-section">
      <div className="h-1/5 flex flex-row justify-end items-end pb-8 text-BLACK text-4xl font-bold">
        {leftYear} - {rightYear}
      </div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        id="svg-graph"
        ref={graphRef}
        strokeLinecap="round"
        strokeLinejoin="round"
        className=" w-full h-4/5 max-h-full aspect-22/9 rounded-60 origin-center"
      >
        <linearGradient id="fade-to-right">
          <stop
            offset="10%"
            style={{ stopColor: "var(--color-WHITE)", stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--color-WHITE)", stopOpacity: 0 }}
          />
        </linearGradient>
        <linearGradient id="fade-to-left">
          <stop
            offset="0%"
            style={{ stopColor: "var(--color-WHITE)", stopOpacity: 0 }}
          />
          <stop
            offset="90%"
            style={{ stopColor: "var(--color-WHITE)", stopOpacity: 1 }}
          />
        </linearGradient>
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
          x={0}
          y={0}
          width={100}
          fill="url(#fade-to-right)"
          className="h-full"
        ></rect>
        <rect
          x={getDimensions().width - 100}
          y={0}
          width={100}
          fill="url(#fade-to-left)"
          className="h-full"
        ></rect>
        <rect className="h-full fill-WHITE"></rect>
        <rect
          x={4}
          y={HEIGHT_TIMELINE + 4}
          className="pointer-events-none stroke-BLACK fill-none stroke-8"
          id="main-graph-stroke"
          rx="60"
        />

        <use y={HEIGHT_TIMELINE / 2} href="#horizontal-axis" />
        <use
          id="horizontal-axis-bottom"
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
