"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  DataPeriod,
  periods,
  timeline,
  TimelineYear,
} from "../services/timelineService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LeftData,
  RightData,
  SelectableDataType,
  Side,
} from "../services/types";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "@gsap/shockingly/InertiaPlugin";

const PADDING = { top: 30, left: 120, right: 120, bottom: 60 };
const HEIGHT_TIMELINE = 150;
const LUSTRUM_ZOOM = 2;
const REGULAR_ZOOM = 6;
const SHORT_ZOOM = 2;
const PATH_PADDING = 16;
const TICK_OFFSET = 25;
const DATA_POINT_SIZE = 7;
const DATA_POINT_SIZE_PERIOD = 4;
const SNAP_DISTANCE = 100;

interface Props {
  gsapTimeline: gsap.core.Timeline | null;
}

const Timeline = ({ gsapTimeline }: Props) => {
  const graphRef = useRef<SVGSVGElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);

  const [leftData, setLeftData] = useState<LeftData>({
    adultsKilled: false,
    adultsImprisoned: false,
    minorsKilled: false,
    minorsImprisoned: false,
    adultsInjured: false,
    minorsInjured: false,
  });

  const [rightData, setRightData] = useState<RightData>({
    illegalSettlers: false,
    buildingsDemolished: false,
    palestiniansDisplaced: false,
    percentageOfPalestinianLandStolen: false,
  });

  const [leftYear, setLeftYear] = useState(timeline[0].year);
  const [rightYear, setRightYear] = useState(
    timeline[timeline.length - 1].year
  );

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panLevel, setPanLevel] = useState(0);
  const [zoomLevelFloored, setZoomLevelFloored] = useState(1);

  const { contextSafe } = useGSAP({ scope: graphRef });

  //--------------------------------UTILS--------------------------------

  const getActiveData = (side: Side): SelectableDataType[] => {
    return Object.entries(side === Side.LEFT ? leftData : rightData)
      .filter((entry) => entry[1])
      .map((entry) => {
        return entry[0] as SelectableDataType;
      });
  };

  const getMaxValueOnScreen = (side: Side): number => {
    let maxValue = 0;
    const container = document?.getElementById("svg-wrapper");

    if (container) {
      const { left, right } = container.getBoundingClientRect();

      const visibleTicks = timeline.filter((tick) => {
        const element = document?.getElementById(`tick-${tick.year}`);
        if (element) {
          const { left: tickLeft, right: tickRight } =
            element.getBoundingClientRect();
          return tickLeft >= left && tickRight <= right;
        }
      });

      getActiveData(side).forEach((entry) => {
        periods
          .get(entry)
          ?.filter(
            (period) =>
              (period.startYear >= leftYear && period.startYear <= rightYear) ||
              (period.endYear <= rightYear && period.endYear >= leftYear) ||
              (period.startYear <= leftYear && period.endYear >= rightYear)
          )
          .forEach((period) => {
            const max =
              period.amount.number / (period.endYear - period.startYear + 1);
            maxValue = Math.max(maxValue, max);
          });

        console.log(maxValue);

        const max =
          d3.max(visibleTicks, (d) => {
            let value = 0;
            const yearData = d[entry as keyof TimelineYear];
            if (typeof yearData === "object") {
              value = yearData.number;
            }
            return value;
          }) ?? 0;

        maxValue = Math.max(maxValue, max);
      });

      const digits = Math.floor(Math.log10(maxValue) + 1);
      const powerNumber = Math.max(Math.pow(10, digits - 2), 1);
      const ceiled = Math.ceil(maxValue / powerNumber) * powerNumber;

      return ceiled;
    }
    return 0;
  };

  const getTickWidth = () => {
    return (
      (getDimensions().width - PADDING.left - PADDING.right) / timeline.length
    );
  };

  const getDimensions = () => {
    if (graphRef.current)
      return {
        width: graphRef.current.clientWidth,
        height: graphRef.current.clientHeight,
      };
    return { width: -1, height: -1 };
  };

  const getVisibleYears = () => {
    return timeline.filter(
      (tick) => tick.year >= leftYear && tick.year <= rightYear
    );
  };

  //--------------------------------ANIMATIONS--------------------------------

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
      attr: { y2: getDimensions().height - PADDING.bottom - PATH_PADDING },
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
      attr: { y2: getDimensions().height - PADDING.bottom - PATH_PADDING },
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
      attr: { y2: HEIGHT_TIMELINE / 2 - PATH_PADDING },
      duration: 0.6,
      ease: "power4.out",
    });
    gsap.to(`.lustrum .line-2`, {
      opacity: 0,
      attr: { y2: HEIGHT_TIMELINE + PATH_PADDING },
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
      attr: { y2: getDimensions().height - PADDING.bottom - PATH_PADDING },
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
      attr: { y2: HEIGHT_TIMELINE / 2 - PATH_PADDING },
      duration: 0.3,
      ease: "power4.out",
    });
    gsap.to(`.regular .line-2`, {
      opacity: 0,
      attr: { y2: HEIGHT_TIMELINE + PATH_PADDING },
      duration: 0.3,
      ease: "power4.out",
    });
    gsap.to(`.regular .text`, {
      opacity: 0,
      duration: 0.3,
      ease: "power4.out",
    });
  });

  const animateShort = contextSafe(() => {
    gsap.to(`.period-line.short`, {
      opacity: 1,
      duration: 0.4,
      ease: "power4.out",
    });
  });

  const reverseShort = contextSafe(() => {
    gsap.to(`.period-line.short`, {
      opacity: 0,
      duration: 0.4,
      ease: "power4.out",
    });
  });

  const animateDataType = contextSafe((timeline: boolean, type: string) => {
    if (timeline) {
      gsapTimeline?.to(
        `.tick .tick-data.${type}:not(.period)`,
        {
          attr: { r: DATA_POINT_SIZE },
          duration: 0.2,
          ease: "bounce.out",
          stagger: 0.01,
        },
        "<"
      );

      gsapTimeline?.to(
        `.tick .tick-data.${type}.period`,
        {
          attr: { r: DATA_POINT_SIZE_PERIOD },
          duration: 0.2,
          ease: "bounce.out",
          stagger: 0.01,
        },
        "<"
      );
    } else {
      gsap.to(`.tick .tick-data.${type}:not(.period)`, {
        attr: { r: DATA_POINT_SIZE },
        duration: 0.2,
        ease: "bounce.out",
        stagger: 0.01,
      });

      gsap.to(`.tick .tick-data.${type}.period`, {
        attr: { r: DATA_POINT_SIZE_PERIOD },
        duration: 0.2,
        ease: "bounce.out",
        stagger: 0.01,
      });
    }
  });

  const animateData = contextSafe((timeline: boolean, side: Side) => {
    getActiveData(side).forEach((data) => {
      animateDataType(timeline, data);
    });
  });

  //--------------------------------DRAWING DATA--------------------------------

  const drawTicks = () => {
    const groups = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .selectAll("svg.tick")
      .data(timeline)
      .enter()
      .append("svg")
      .attr("id", (d) => `tick-${d.year}`)
      .attr("x", (_, i) => PADDING.left + i * getTickWidth())
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
      .attr("x", TICK_OFFSET)
      .attr("opacity", 0)

      .attr("text-anchor", "middle");

    groups
      .append("line")
      .attr("x1", TICK_OFFSET)
      .attr("x2", TICK_OFFSET)
      .attr("y1", HEIGHT_TIMELINE / 2 - PATH_PADDING)
      .attr("y2", HEIGHT_TIMELINE / 2 - PATH_PADDING)
      .attr("opacity", 0)
      .attr("stroke-linecap", "round")
      .attr("class", "stroke-4 stroke-BROWN unzoom line");

    groups
      .append("line")
      .attr("x1", TICK_OFFSET)
      .attr("x2", TICK_OFFSET)
      .attr("y1", HEIGHT_TIMELINE + PATH_PADDING)
      .attr("y2", HEIGHT_TIMELINE + PATH_PADDING)
      .attr("opacity", 0)
      .attr("stroke-linecap", "round")
      .attr("class", "stroke-4 stroke-BROWN unzoom line-2");
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

  const drawData = (side: Side) => {
    const maxHeight =
      getDimensions().height - HEIGHT_TIMELINE - PADDING.bottom - 32;

    const groups = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .selectAll<Element, TimelineYear>("svg.tick");

    groups.selectAll(`.tick-data.${side}`).remove();
    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll(`line.period-line.${side}`)
      .remove();

    getActiveData(side).forEach((data) => {
      const localPeriods = periods.get(data);

      if (localPeriods) {
        d3.select(graphRef.current)
          .select("#group-timeline")
          .selectAll<Element, DataPeriod>("line.period-line")
          .data(localPeriods)
          .enter()
          .append("line")
          .attr(
            "class",
            (d) =>
              `period-line unzoom ${data} ${side} line-${d.startYear} ${
                d.endYear - d.startYear <= 2 ? "short" : ""
              }`
          )
          .attr(
            "x1",
            (d) =>
              timeline.findIndex((i) => i.year === d.startYear) *
                getTickWidth() +
              PADDING.left +
              TICK_OFFSET +
              PATH_PADDING -
              DATA_POINT_SIZE_PERIOD
          )
          .attr(
            "x2",
            (d) =>
              timeline.findIndex((i) => i.year === d.endYear) * getTickWidth() +
              PADDING.left +
              TICK_OFFSET -
              PATH_PADDING +
              DATA_POINT_SIZE_PERIOD
          )
          .attr("y1", (d) => {
            return (
              getDimensions().height -
              PADDING.bottom -
              PATH_PADDING -
              (d.amount.number /
                (d.endYear - d.startYear) /
                getMaxValueOnScreen(side)) *
                maxHeight
            );
          })
          .attr("y2", (d) => {
            return (
              getDimensions().height -
              PADDING.bottom -
              PATH_PADDING -
              (d.amount.number /
                (d.endYear - d.startYear) /
                getMaxValueOnScreen(side)) *
                maxHeight
            );
          });

        localPeriods.forEach((period: DataPeriod) => {
          const periodHeight =
            getDimensions().height -
            PADDING.bottom -
            PATH_PADDING -
            (period.amount.number /
              (period.endYear - period.startYear) /
              getMaxValueOnScreen(side)) *
              maxHeight;

          d3.select(graphRef.current)
            .select("#group-timeline")
            .select(`#tick-${period.startYear}`)
            .append("circle")
            .attr("id", `period-data-${period.startYear}`)
            .attr("cx", TICK_OFFSET)
            .attr("cy", periodHeight)
            .attr("r", 0)
            .attr("class", `tick-data unzoom ${data} ${side} period`);

          d3.select(graphRef.current)
            .select("#group-timeline")
            .select(`#tick-${period.endYear}`)
            .append("circle")
            .attr("id", `test-data-${period.endYear}`)
            .attr("cx", TICK_OFFSET)
            .attr("cy", periodHeight)
            .attr("r", 0)
            .attr("class", `tick-data unzoom ${data} ${side} period`);
        });
      }

      groups
        .filter((d) => typeof d[data]?.number !== "undefined")
        .append("circle")
        .attr("id", (d: TimelineYear) => `data-${d.year}`)
        .attr("cx", TICK_OFFSET)
        .attr(
          "cy",
          (d) =>
            getDimensions().height -
            PADDING.bottom -
            PATH_PADDING -
            ((d[data]?.number ?? 0) / getMaxValueOnScreen(side)) * maxHeight
        )
        .attr("r", 0)
        .attr("class", `tick-data unzoom ${data} ${side} `);
    });
  };

  //--------------------------------UPDATING DATA--------------------------------

  const updateTicks = () => {
    //TODO: Correctly update ticks when zoomed in

    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll("svg.tick")
      .attr("x", (_, i) => PADDING.left + i * getTickWidth());
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
          if (tickLeft >= left + PADDING.left) {
            setLeftYear(timeline[i].year);
            break;
          }
        }
      }

      for (let i = timeline.length - 1; i >= 0; i--) {
        const tick = document?.getElementById(`tick-${timeline[i].year}`);
        if (tick) {
          const tickRight = tick.getBoundingClientRect().right;
          if (tickRight <= right - PADDING.right) {
            setRightYear(timeline[i].year);
            break;
          }
        }
      }
    }
  };

  const updatePeriods = (side: Side) => {
    getActiveData(side).forEach((data) => {
      const localPeriods = periods.get(data);

      if (localPeriods) {
        d3.select(graphRef.current)
          .select("#group-timeline")
          .selectAll<Element, DataPeriod>("line.period-line")
          .attr(
            "x1",
            (d) =>
              (timeline.findIndex((i) => i.year === d.startYear) *
                getTickWidth() +
                PADDING.left) *
                zoomLevel +
              PATH_PADDING +
              TICK_OFFSET -
              DATA_POINT_SIZE_PERIOD
          )
          .attr(
            "x2",
            (d) =>
              (timeline.findIndex((i) => i.year === d.endYear) *
                getTickWidth() +
                PADDING.left) *
                zoomLevel +
              TICK_OFFSET -
              PATH_PADDING +
              DATA_POINT_SIZE_PERIOD
          );
      }
    });
  };

  const updateHeights = (side: Side) => {
    const maxHeight =
      getDimensions().height - HEIGHT_TIMELINE - PADDING.bottom - 32;

    getActiveData(side).forEach((data) => {
      getVisibleYears()
        .filter((d) => typeof d[data]?.number !== "undefined")
        .forEach((d) => {
          gsap.to(`#tick-${d.year} .tick-data.${data}.${side}`, {
            attr: {
              cy:
                getDimensions().height -
                PADDING.bottom -
                PATH_PADDING -
                ((d[data]?.number ?? 0) / getMaxValueOnScreen(side)) *
                  maxHeight,
            },
            duration: 0.6,
          });
        });

      periods.get(data)?.forEach((period) => {
        const value =
          getDimensions().height -
          PADDING.bottom -
          PATH_PADDING -
          (period.amount.number /
            (period.endYear - period.startYear + 1) /
            getMaxValueOnScreen(side)) *
            maxHeight;
        gsap.to(
          `#tick-${period.startYear} .tick-data.${data}.${side}, #tick-${period.endYear} .tick-data.${data}.${side}`,
          {
            attr: {
              cy: value,
            },
            duration: 0.6,
          }
        );

        gsap.to(`.period-line.line-${period.startYear}.${data}.${side}`, {
          attr: {
            y1: value,
            y2: value,
          },
          duration: 0.6,
        });
      });
    });
  };

  const updateYAxis = (side: Side) => {
    console.log("updating y axis");
    console.log(getActiveData(side));
    if (
      (side === Side.LEFT && getActiveData(side).length > 0) ||
      (side === Side.RIGHT && getActiveData(side).length > 0)
    ) {
      const graphStart = PADDING.top + HEIGHT_TIMELINE;
      const graphEnd = getDimensions().height - PADDING.bottom - PATH_PADDING;
      const nrOfTicks = Math.floor((graphEnd - graphStart) / 50);
      const maxValue = getMaxValueOnScreen(side);

      d3.select(graphRef.current).selectAll(`.y-axis.${side}`).remove();

      const y = d3
        .scaleLinear()
        .domain([0, maxValue])
        .range([graphEnd, graphStart]);

      const yArray = [];

      for (let i = 0; i <= nrOfTicks; i++) {
        yArray.push((maxValue / nrOfTicks) * i);
      }

      d3.select(graphRef.current)
        .append("g")
        .attr("class", `y-axis ${side}`)
        .selectAll<Element, number>("text.y-axis")
        .data(yArray)
        .enter()
        .append("text")
        .attr("class", "y-axis")
        .text((d) => d)
        .attr("text-anchor", side === Side.LEFT ? "end" : "start")
        .attr(
          "x",
          side === Side.LEFT
            ? PADDING.left - PATH_PADDING
            : getDimensions().width - PADDING.right + PATH_PADDING
        )
        .attr("y", (d) => y(d));
    }
  };

  const handleZoom = (e: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
    setZoomLevel(() => e.transform.k);
    setPanLevel(() => e.transform.x);
  };

  //--------------------------------USE EFFECTS--------------------------------

  useEffect(() => {
    console.log("zoom or pan changed");
    updateYears();
    setZoomLevelFloored(() => Math.floor(zoomLevel));
    if (!Object.values(leftData).every((value) => !value)) {
      getMaxValueOnScreen(Side.LEFT);
      updateHeights(Side.LEFT);
      updatePeriods(Side.LEFT);
      updateYAxis(Side.LEFT);
    }

    if (!Object.values(rightData).every((value) => !value)) {
      getMaxValueOnScreen(Side.RIGHT);
      updateHeights(Side.RIGHT);
      updateYAxis(Side.RIGHT);
      updatePeriods(Side.RIGHT);
    }

    d3.select(graphRef.current)
      .select("#zoomable")
      .attr("transform", `translate(${panLevel}, 0) scale(${zoomLevel}, 1)`);

    d3.select(graphRef.current)
      .selectAll(".unzoom")
      .attr("transform", `scale(${1 / zoomLevel}, 1)`);
  }, [zoomLevel, panLevel]);

  useEffect(() => {
    drawTimeline();
    drawData(Side.LEFT);
    drawData(Side.RIGHT);

    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    if (zoomLevelFloored >= LUSTRUM_ZOOM) {
      animateLustra();
      animateData(false, Side.LEFT);
      animateData(false, Side.RIGHT);
    } else {
      reverseLustra();
    }

    if (zoomLevelFloored >= REGULAR_ZOOM) {
      animateRegular();
      animateData(false, Side.LEFT);
      animateData(false, Side.RIGHT);
    } else {
      reverseRegular();
    }

    if (zoomLevelFloored >= SHORT_ZOOM) {
      animateShort();
    } else {
      reverseShort();
    }
  }, [zoomLevelFloored]);

  useEffect(() => {
    getMaxValueOnScreen(Side.LEFT);
    drawData(Side.LEFT);
    updateYAxis(Side.LEFT);
    animateData(false, Side.LEFT);
  }, [leftData]);

  useEffect(() => {
    getMaxValueOnScreen(Side.RIGHT);
    drawData(Side.RIGHT);
    updateYAxis(Side.RIGHT);
    animateData(false, Side.RIGHT);
  }, [rightData]);

  useGSAP(
    () => {
      gsap.registerPlugin(Draggable);
      gsap.registerPlugin(InertiaPlugin);

      Object.keys(leftData).forEach((key) => {
        const icon = document.getElementById(`timeline-data-icon-${key}`);
        const placeholder = document.getElementById(
          `active-row-placeholder-${key}`
        );

        if (icon && placeholder) {
          const { x: iconX, y: iconY } = icon.getBoundingClientRect();
          const { x: spotX, y: spotY } = placeholder.getBoundingClientRect();

          Draggable.create(icon, {
            inertia: true,
            type: "x,y",
            resistance: 0.5,
            edgeResistance: 0.5,
            bounds: "#data-icon-bounds",
            onDragStart: () => {
              gsap.to(icon, { scale: 0.7, borderRadius: "100%" });
            },
            onDragEnd: () => {
              gsap.to(icon, { scale: 1, borderRadius: "7.5px" });
            },
            snap: {
              points: (point) => {
                if (point.x < SNAP_DISTANCE && point.y < SNAP_DISTANCE) {
                  setLeftData((prev) => {
                    const newData = { ...prev };
                    newData[key as keyof LeftData] = false;
                    return newData;
                  });

                  return { x: 0, y: 0 };
                }

                setLeftData((prev) => {
                  const newData = { ...prev };
                  newData[key as keyof LeftData] = true;
                  return newData;
                });
                return { x: spotX - iconX, y: spotY - iconY };
              },
            },
          });
        }
      });

      Object.keys(rightData).forEach((key) => {
        const icon = document.getElementById(`timeline-data-icon-${key}`);
        const placeholder = document.getElementById(
          `active-row-placeholder-${key}`
        );

        if (icon && placeholder) {
          const { x: iconX, y: iconY } = icon.getBoundingClientRect();
          const { x: spotX, y: spotY } = placeholder.getBoundingClientRect();

          Draggable.create(icon, {
            type: "x,y",
            inertia: true,
            edgeResistance: 0.5,
            bounds: "#data-icon-bounds",
            onDragStart: () => {
              gsap.to(icon, { scale: 0.7, borderRadius: "100%" });
            },
            onDragEnd: () => {
              gsap.to(icon, { scale: 1, borderRadius: "7.5px" });
            },
            snap: {
              points: (point) => {
                if (point.x < SNAP_DISTANCE && point.y < SNAP_DISTANCE) {
                  setRightData((prev) => {
                    const newData = { ...prev };
                    newData[key as keyof RightData] = false;
                    return newData;
                  });
                  return { x: 0, y: 0 };
                }

                setRightData((prev) => {
                  const newData = { ...prev };
                  newData[key as keyof RightData] = true;
                  return newData;
                });
                return { x: spotX - iconX, y: spotY - iconY };
              },
            },
          });
        }
      });

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
              attr: {
                y2: getDimensions().height - PADDING.bottom - PATH_PADDING,
              },
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

        animateData(true, Side.LEFT);
        animateData(true, Side.RIGHT);
      }
    },
    { scope: timelineRef, dependencies: [gsapTimeline] }
  );

  return (
    <div ref={timelineRef} className="timeline-section">
      <div className="timeline-main opacity-0 w-full h-full">
        <div className="h-1/5 flex flex-row justify-between gap-8 items-center pb-4">
          <div id="data-icon-bounds">
            <div className="inactive">
              {Object.keys(leftData).map((key) => {
                return (
                  <button
                    id={`timeline-data-icon-${key}`}
                    className={`data-icon ${key} left`}
                    key={key}
                  >
                    {key[0]}
                  </button>
                );
              })}
              {Object.keys(rightData).map((key) => {
                return (
                  <button
                    id={`timeline-data-icon-${key}`}
                    className={`data-icon ${key} right`}
                    key={key}
                  >
                    {key[0]}
                  </button>
                );
              })}
            </div>
            <div className="active">
              <div className="active-row left">
                {Object.keys(leftData).map((key) => (
                  <div
                    key={key}
                    id={`active-row-placeholder-${key}`}
                    className="active-row-placeholder"
                  >
                    {key[0]}
                  </div>
                ))}
              </div>
              <hr />
              <div className="active-row right">
                {Object.keys(rightData).map((key) => (
                  <div
                    key={key}
                    id={`active-row-placeholder-${key}`}
                    className="active-row-placeholder"
                  >
                    {key[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-BLACK text-4xl font-bold flex flex-col items-end">
            <span>{leftYear}</span>
            <span>{rightYear}</span>
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
            width={PADDING.left + 50}
            fill="url(#fade-to-right)"
            className="h-full"
          ></rect>
          <rect
            x={getDimensions().width - PADDING.right - 50}
            y={0}
            width={PADDING.right + 50}
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
