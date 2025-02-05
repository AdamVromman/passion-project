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
import { LeftData, RightData, SelectableDataType } from "../services/types";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "@gsap/shockingly/InertiaPlugin";

const PADDING = { top: 30, left: 60, right: 60, bottom: 60 };
const HEIGHT_TIMELINE = 150;
const LUSTRUM_ZOOM = 2;
const REGULAR_ZOOM = 6;
const SHORT_ZOOM = 2;
const PATH_PADDING = 16;
const TICK_OFFSET = 25;
const DATA_POINT_SIZE = 7;
const DATA_POINT_SIZE_PERIOD = 4;

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

  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartY, setDragStartY] = useState(0);

  const [selectedData, setSelectedData] = useState<SelectableDataType[]>([
    SelectableDataType.ADULTS_KILLED,
    //SelectableDataType.ADULTS_INJURED,
    //SelectableDataType.MINORS_KILLED,
    //SelectableDataType.MINORS_INJURED,
    //SelectableDataType.PERCENTAGE_OF_PALESTINIAN_LAND_STOLEN,
    // SelectableDataType.ADULTS_IMPRISONED,
    // SelectableDataType.MINORS_IMPRISONED,
    // SelectableDataType.BUILDINGS_DEMOLISHED,
    //SelectableDataType.ILLEGAL_SETTLERS,
  ]);
  const [leftYear, setLeftYear] = useState(timeline[0].year);
  const [rightYear, setRightYear] = useState(
    timeline[timeline.length - 1].year
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomLevelFloored, setZoomLevelFloored] = useState(1);

  const { contextSafe } = useGSAP({ scope: graphRef });

  const getMaxValues = (localSelectedData?: SelectableDataType[]) => {
    const values = new Map<SelectableDataType, number>();

    (localSelectedData ?? selectedData).forEach((data) => {
      const max = d3.max(timeline, (d) => d[data]?.number ?? 0) ?? 0;

      const digits = Math.floor(Math.log10(max) + 1);
      const powerNumber = Math.max(Math.pow(10, digits - 2), 1);
      const ceiled = Math.ceil(max / powerNumber) * powerNumber;

      values.set(data, ceiled);
    });

    return values;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleZoom = (e: any) => {
    const zoom = e.transform.k;

    updateYears();
    setZoomLevel(() => zoom);
    setZoomLevelFloored(() => Math.floor(zoom));
    updatePeriods(zoom);

    d3.select(graphRef.current)
      .select("#zoomable")
      .attr("transform", `translate(${e.transform.x}, 0) scale(${zoom}, 1)`);

    d3.select(graphRef.current)
      .selectAll(".unzoom")
      .attr("transform", `scale(${1 / zoom}, 1)`);
  };

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

  const updateTicks = () => {
    //TODO: Correctly update ticks when zoomed in

    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll("svg.tick")
      .attr("x", (_, i) => PADDING.left + i * getTickWidth());
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
    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll("line.period-line")
      .remove();

    (localSelectedData ?? selectedData).forEach((data) => {
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
              `period-line unzoom ${data} ${
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
                getMaxValues(localSelectedData).get(data)) *
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
                getMaxValues(localSelectedData).get(data)) *
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
              getMaxValues(localSelectedData).get(data)) *
              maxHeight;

          d3.select(graphRef.current)
            .select("#group-timeline")
            .select(`#tick-${period.startYear}`)
            .append("circle")
            .attr("id", `period-data-${period.startYear}`)
            .attr("cx", TICK_OFFSET)
            .attr("cy", periodHeight)
            .attr("r", 0)
            .attr("class", `tick-data unzoom ${data} period`);

          d3.select(graphRef.current)
            .select("#group-timeline")
            .select(`#tick-${period.endYear}`)
            .append("circle")
            .attr("id", `test-data-${period.endYear}`)
            .attr("cx", TICK_OFFSET)
            .attr("cy", periodHeight)
            .attr("r", 0)
            .attr("class", `tick-data unzoom ${data} period`);
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
            (d[data]?.number / getMaxValues(localSelectedData).get(data)) *
              maxHeight
        )
        .attr("r", 0)
        .attr("class", `tick-data unzoom ${data}`);
    });
  };

  const animateDataType = (timeline: boolean, type: string) => {
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
  };

  const updatePeriods = (zoom: number) => {
    selectedData.forEach((data) => {
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
                zoom +
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
                zoom +
              TICK_OFFSET -
              PATH_PADDING +
              DATA_POINT_SIZE_PERIOD
          );
      }
    });
  };

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

    if (zoomLevelFloored >= SHORT_ZOOM) {
      animateShort();
    } else {
      reverseShort();
    }
  }, [zoomLevelFloored]);

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
            type: "x,y",
            inertia: true,
            edgeResistance: 0.5,
            bounds: "#data-icon-bounds",
            onDragStart: (event: PointerEvent) => {
              setDragStartX(event.x);
              setDragStartY(event.y);
              gsap.to(icon, { scale: 0.7, borderRadius: "100%" });
            },
            onDragEnd: (event: PointerEvent) => {
              const dx = event.x - iconX;
              const dy = event.y - iconY;

              gsap.to(icon, { scale: 1, borderRadius: "7.5px" });
              if (dx < 100 && dy < 100) {
                setLeftData((prev) => {
                  const newData = { ...prev };
                  newData[key as keyof LeftData] = false;
                  return newData;
                });
              } else {
                setLeftData((prev) => {
                  const newData = { ...prev };
                  newData[key as keyof LeftData] = true;
                  return newData;
                });
              }
            },
            snap: {
              points: (point) => {
                if (point.x < 0 && point.y < 0) {
                  return { x: 0, y: 0 };
                }

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
            onDragStart: (event: PointerEvent) => {
              setDragStartX(event.x);
              setDragStartY(event.y);
              gsap.to(icon, { scale: 0.7, borderRadius: "100%" });
            },
            onDragEnd: (event: PointerEvent) => {
              const dx = event.x - iconX;
              const dy = event.y - iconY;

              gsap.to(icon, { scale: 1, borderRadius: "7.5px" });
              if (dx < 100 && dy < 100) {
                setRightData((prev) => {
                  const newData = { ...prev };
                  newData[key as keyof RightData] = false;
                  return newData;
                });
              } else {
                setRightData((prev) => {
                  const newData = { ...prev };
                  newData[key as keyof RightData] = true;
                  return newData;
                });
              }
            },
            snap: {
              points: (point) => {
                if (point.x < 0 && point.y < 0) {
                  return { x: 0, y: 0 };
                }

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

        animateData(true);
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
              {Object.values(SelectableDataType).map((key) => {
                const left =
                  key === SelectableDataType.ADULTS_KILLED ||
                  key === SelectableDataType.ADULTS_IMPRISONED ||
                  key === SelectableDataType.MINORS_KILLED ||
                  key === SelectableDataType.MINORS_IMPRISONED ||
                  key === SelectableDataType.ADULTS_INJURED ||
                  key === SelectableDataType.MINORS_INJURED;

                return (
                  <button
                    id={`timeline-data-icon-${key}`}
                    className={`data-icon ${key} ${left ? "left" : "right"}`}
                    key={key}
                    // onMouseEnter={() => {
                    //   if (!selectedData.includes(key as SelectableDataType)) {
                    //     drawData([...selectedData, key as SelectableDataType]);
                    //     animateData(false, [
                    //       ...selectedData,
                    //       key as SelectableDataType,
                    //     ]);
                    //   }
                    // }}
                    // onClick={() => {
                    //   setSelectedData((prev) => {
                    //     if (prev.includes(key as SelectableDataType)) {
                    //       return prev.filter((data) => data !== key);
                    //     } else {
                    //       return [...prev, key as SelectableDataType];
                    //     }
                    //   });
                    // }}
                    // onMouseLeave={() => {
                    //   if (!selectedData.includes(key as SelectableDataType)) {
                    //     drawData(selectedData);
                    //     animateData(false);
                    //   }
                    // }}
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
