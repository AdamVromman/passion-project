"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { timeline, TimelineYear } from "../services/timelineService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SelectableDataType } from "../services/types";
const PADDING = { top: 30, left: 60, right: 60, bottom: 60 };
const HEIGHT_TIMELINE = 150;
const LUSTRUM_ZOOM = 2;
const REGULAR_ZOOM = 6;

interface Props {
  gsapTimeline: gsap.core.Timeline | null;
}

const Timeline = ({ gsapTimeline }: Props) => {
  const graphRef = useRef<SVGSVGElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const [selectedData, setSelectedData] = useState<SelectableDataType[]>([
    SelectableDataType.ADULTS_KILLED,
    SelectableDataType.ADULTS_INJURED,
    SelectableDataType.MINORS_KILLED,
    SelectableDataType.MINORS_INJURED,
    SelectableDataType.PERCENTAGE_OF_PALESTINIAN_LAND_STOLEN,
  ]);
  const [leftYear, setLeftYear] = useState(timeline[0].year);
  const [rightYear, setRightYear] = useState(
    timeline[timeline.length - 1].year
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomLevelFloored, setZoomLevelFloored] = useState(1);

  const { contextSafe } = useGSAP({ scope: graphRef });

  const getMaxValues = () => {
    const values = new Map<SelectableDataType, number>();

    selectedData.forEach((data) => {
      const max = d3.max(timeline, (d) => d[data]?.number ?? 0) ?? 0;

      const digits = Math.floor(Math.log10(max) + 1);
      const powerNumber = Math.max(Math.pow(10, digits - 2), 1);
      const ceiled = Math.ceil(max / powerNumber) * powerNumber;

      values.set(data, ceiled);
    });

    return values;
  };

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
    gsap.to(`.regular .line`, {
      opacity: 1,
      attr: { y2: HEIGHT_TIMELINE - 8 },
      duration: 0.4,
      ease: "power4.out",
    });
    gsap.to(`.regular .line-2`, {
      opacity: 1,
      attr: { y2: getDimensions().height - PADDING.bottom - 16 },
      duration: 0.4,
      ease: "power4.out",
    });
    gsap.to(`.regular .text`, {
      opacity: 1,
      duration: 0.4,
      ease: "power4.out",
    });
  });

  const reverseRegular = contextSafe(() => {
    gsap.to(`.regular .line`, {
      opacity: 0,
      attr: { y2: HEIGHT_TIMELINE / 2 - 16 },
      duration: 0.3,
      ease: "power4.out",
    });
    gsap.to(`.regular .line-2`, {
      opacity: 0,
      attr: { y2: HEIGHT_TIMELINE + 16 },
      duration: 0.3,
      ease: "power4.out",
    });
    gsap.to(`.regular .text`, {
      opacity: 0,
      duration: 0.3,
      ease: "power4.out",
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleZoom = (e: any) => {
    const zoom = e.transform.k;

    updateYears();
    setZoomLevel(() => zoom);
    setZoomLevelFloored(() => Math.floor(zoom));

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
      .attr("x", (_, i) => PADDING.left + i * tickWidth);
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
            setLeftYear(timeline[i].year);
            break;
          }
        }
      }

      for (let i = timeline.length - 1; i >= 0; i--) {
        const tick = document?.getElementById(`tick-${timeline[i].year}`);
        if (tick) {
          const tickRight = tick.getBoundingClientRect().right;
          if (tickRight <= right) {
            setRightYear(timeline[i].year);
            break;
          }
        }
      }
    }
  };

  const drawData = (localSelectedData?: SelectableDataType[]) => {
    const maxHeight =
      getDimensions().height - HEIGHT_TIMELINE - PADDING.bottom - 32;

    const groups = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .selectAll<Element, TimelineYear>("svg.tick");

    groups.selectAll(".tick-data").remove();

    (localSelectedData ?? selectedData).forEach((data) => {
      groups
        .filter((d) => typeof d[data]?.number !== "undefined")
        .append("circle")
        .attr("id", (d: TimelineYear) => `data-${d.year}`)
        .attr("cx", 25)
        .attr(
          "cy",
          (d) =>
            getDimensions().height -
            PADDING.bottom -
            16 -
            (d[data]?.number / getMaxValues().get(data)) * maxHeight
        )
        .attr("r", 0)
        .attr("class", `tick-data unzoom ${data}`);
    });
  };

  const animateDataType = (timeline: boolean, type: string) => {
    if (timeline) {
      gsapTimeline?.to(
        `.tick .tick-data.${type}`,
        {
          attr: { r: 7 },
          duration: 0.2,
          ease: "bounce.out",
          stagger: 0.01,
        },
        "<"
      );

      // if (zoomLevelFloored >= LUSTRUM_ZOOM) {
      //   gsapTimeline?.to(
      //     `.tick.lustrum .tick-data.${type}`,
      //     {
      //       attr: { r: 7 },
      //       duration: 0.2,
      //       ease: "bounce.out",
      //       stagger: 0.01,
      //     },
      //     "<"
      //   );
      // }

      // if (zoomLevelFloored >= REGULAR_ZOOM) {
      //   gsapTimeline?.to(
      //     `.tick.regular .tick-data.${type}`,
      //     {
      //       attr: { r: 7 },
      //       duration: 0.4,
      //       ease: "bounce.out",
      //     },
      //     "<"
      //   );
      // }
    } else {
      gsap.to(`.tick .tick-data.${type}`, {
        attr: { r: 7 },
        duration: 0.2,
        ease: "bounce.out",
        stagger: 0.01,
      });

      // if (zoomLevelFloored >= LUSTRUM_ZOOM) {
      //   gsap.to(`.tick.lustrum .tick-data.${type}`, {
      //     attr: { r: 7 },
      //     duration: 0.2,
      //     ease: "bounce.out",
      //     stagger: 0.01,
      //   });
      // }

      // if (zoomLevelFloored >= REGULAR_ZOOM) {
      //   gsap.to(`.tick.regular .tick-data.${type}`, {
      //     attr: { r: 7 },
      //     duration: 0.4,
      //     ease: "bounce.out",
      //   });
      // }
    }
  };

  // const reverseDataType = (type: string) => {
  //   if (zoomLevelFloored < LUSTRUM_ZOOM) {
  //     gsap.to(`.tick.lustrum .tick-data.${type}`, {
  //       attr: { r: 0 },
  //       duration: 0.4,
  //       ease: "power4.out",
  //     });
  //   }

  //   if (zoomLevelFloored < REGULAR_ZOOM) {
  //     gsap.to(`.tick.regular .tick-data.${type}`, {
  //       attr: { r: 0 },
  //       duration: 0.4,
  //       ease: "power4.out",
  //     });
  //   }
  // };

  // const reverseData = (localSelectedData?: SelectableDataType[]) => {
  //   (localSelectedData ?? selectedData).forEach((data) => {
  //     reverseDataType(data);
  //   });
  // };

  const animateData = (
    timeline: boolean,
    localSelectedData?: SelectableDataType[]
  ) => {
    (localSelectedData ?? selectedData).forEach((data) => {
      animateDataType(timeline, data);
    });
  };

  useEffect(() => {
    drawTimeline();
    drawData();
    // resize();
    getMaxValues();

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (zoomLevelFloored >= LUSTRUM_ZOOM) {
      animateLustra();
      animateData(false);
    } else {
      reverseLustra();
      // reverseData();
    }

    if (zoomLevelFloored >= REGULAR_ZOOM) {
      animateRegular();
      animateData(false);
    } else {
      reverseRegular();
      // reverseData();
    }
  }, [zoomLevelFloored]);

  useGSAP(
    () => {
      if (gsapTimeline) {
        gsapTimeline
          .to(
            timelineRef.current,
            {
              y: 0,
              ease: "power4.out",
              duration: 1,
            },
            "0"
          )
          .to(
            ".timeline-main",
            {
              opacity: 1,
              ease: "power4.out",
              duration: 0.5,
            },
            "<"
          )
          .to(
            "#main-graph-stroke",
            {
              attr: {
                height: getDimensions().height - HEIGHT_TIMELINE - 8,
                rx: 60,
              },
              duration: 0.5,
            },
            "<"
          )
          .to(
            `.decade .line`,
            {
              opacity: 1,
              attr: { y2: HEIGHT_TIMELINE - 8 },
              duration: 0.4,
              ease: "power4.out",
              stagger: 0.05,
            },
            "<"
          )
          .to(
            `.decade .line-2`,
            {
              opacity: 1,
              attr: { y2: getDimensions().height - PADDING.bottom - 16 },
              duration: 0.4,
              ease: "power4.out",
              stagger: 0.05,
            },
            "<"
          )
          .to(
            `.decade .text`,
            {
              opacity: 1,
              duration: 0.4,
              ease: "power4.out",
              stagger: 0.05,
            },
            "<"
          )
          .to(
            "#horizontal-axis, #vertical-axis",
            { opacity: 1, duration: 0.2 },
            "<+=0.5"
          )
          .to(
            "#horizontal-axis line",
            {
              duration: 1,
              attr: { x2: getDimensions().width - PADDING.right },
              ease: "power4.out",
            },
            "<"
          )
          .to(
            "#horizontal-axis polyline",
            {
              duration: 1,
              attr: {
                points: `${getDimensions().width - PADDING.right - 15}, -15 , ${
                  getDimensions().width - PADDING.right
                }, 0, ${getDimensions().width - PADDING.right - 15}, 15`,
              },
              ease: "power4.out",
            },
            "<"
          )
          .to(
            "#vertical-axis line",
            {
              duration: 1,
              attr: { y2: PADDING.top + HEIGHT_TIMELINE + PADDING.top },
              ease: "power4.out",
            },
            "<"
          )
          .to(
            "#vertical-axis polyline",
            {
              duration: 1,
              attr: {
                points: `${PADDING.left - 15}, ${
                  PADDING.top + HEIGHT_TIMELINE + PADDING.top + 15
                } , ${PADDING.left}, ${
                  PADDING.top + HEIGHT_TIMELINE + PADDING.top
                }, ${PADDING.left + 15}, ${
                  PADDING.top + HEIGHT_TIMELINE + PADDING.top + 15
                }`,
              },
              ease: "power4.out",
            },
            "<"
          );

        animateData(true);
      }
    },
    { scope: timelineRef, dependencies: [gsapTimeline] }
  );

  return (
    <div ref={timelineRef} className="timeline-section">
      <div className="timeline-main opacity-0 w-full h-full">
        <div className="h-1/5 flex flex-row justify-between items-center pb-8 ">
          <div className="flex flex-row gap-4">
            {Object.values(SelectableDataType).map((key) => {
              return (
                <button
                  className={`timeline-data-icon ${key}`}
                  key={key}
                  onMouseEnter={() => {
                    if (!selectedData.includes(key as SelectableDataType)) {
                      drawData([...selectedData, key as SelectableDataType]);
                      animateData(false, [
                        ...selectedData,
                        key as SelectableDataType,
                      ]);
                    }
                  }}
                  onClick={() => {
                    setSelectedData((prev) => {
                      if (prev.includes(key as SelectableDataType)) {
                        return prev.filter((data) => data !== key);
                      } else {
                        return [...prev, key as SelectableDataType];
                      }
                    });
                  }}
                  onMouseLeave={() => {
                    drawData();
                    animateData(false);
                  }}
                >
                  €
                </button>
              );
            })}
          </div>
          <div className="text-BLACK text-4xl font-bold">
            {leftYear}—{rightYear}
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="svg-graph"
          ref={graphRef}
          strokeLinecap="round"
          strokeLinejoin="round"
          className=" w-full h-4/5 max-h-full rounded-60 origin-center"
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
            <g id="horizontal-axis" className="opacity-0">
              <line
                x1={PADDING.left}
                x2={PADDING.left}
                y1={0}
                y2={0}
                className="stroke-8 stroke-BLACK"
              />
              <polyline
                points={`${PADDING.left}, 0 , ${PADDING.left}, 0, ${PADDING.left}, 0`}
                className="stroke-8 stroke-BLACK fill-none"
              />
            </g>
          </defs>
          <rect className="h-full w-full fill-WHITE"></rect>
          <rect
            x={4}
            y={4}
            id="svg-wrapper"
            className="w-full fill-WHITE"
          ></rect>
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

          <rect
            x={4}
            y={HEIGHT_TIMELINE + 4}
            width={getDimensions().width - 8}
            height={1}
            className="pointer-events-none stroke-BLACK fill-none stroke-8"
            id="main-graph-stroke"
            rx="10"
          />

          <use y={HEIGHT_TIMELINE / 2} href="#horizontal-axis" />
          <use
            id="horizontal-axis-bottom"
            y={getDimensions().height - PADDING.bottom}
            href="#horizontal-axis"
          />
          <g id="vertical-axis" className="opacity-0">
            <line
              x1={PADDING.left}
              x2={PADDING.left}
              y1={getDimensions().height - PADDING.bottom}
              y2={getDimensions().height - PADDING.bottom}
              className="stroke-8 stroke-BLACK"
            />
            <polyline
              points={`${PADDING.left}, ${
                getDimensions().height - PADDING.bottom
              }, ${PADDING.left}, ${getDimensions().height - PADDING.bottom},${
                PADDING.left
              }, ${getDimensions().height - PADDING.bottom}`}
              className="stroke-8 stroke-BLACK fill-none"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
export default Timeline;
