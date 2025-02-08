"use client";

import { use, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  DataEvent,
  DataPeriod,
  events,
  periods,
  timeline,
  TimelineYear,
} from "../services/timelineService";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  DataPoint,
  LeftData,
  SelectableDataType,
  Side,
} from "../services/types";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "@gsap/shockingly/InertiaPlugin";
import { dataTypeAndDataToString } from "../services/functions";
import { animate } from "motion";

const PADDING = { top: 30, left: 120, right: 120, bottom: 60, rx: 60 };
const PADDING_MOBILE = { top: 30, left: 20, right: 20, bottom: 20, rx: 20 };
const HEIGHT_TIMELINE = 150;
const LUSTRUM_ZOOM = 2;
const REGULAR_ZOOM = 6;
const SHORT_ZOOM = 2;
const PATH_PADDING = 16;
const TICK_OFFSET = 25;
const DATA_POINT_SIZE = 7;
const DATA_POINT_SIZE_PERIOD = 4;
const MOUSE_ELEMENT_PADDING = 30;
const EVENT_MIN_WIDTH = 10;
const EVENT_HEIGHT = 50;

interface Props {
  gsapTimeline: gsap.core.Timeline | null;
  scrolled: boolean;
  windowWidth: number;
}

const Timeline = ({ gsapTimeline, scrolled, windowWidth }: Props) => {
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

  const [rightData, setRightData] = useState<SelectableDataType | null>(null);
  const [previousRightData, setPreviousRightData] =
    useState<SelectableDataType | null>(null);

  const [leftYear, setLeftYear] = useState(timeline[0].year);
  const [rightYear, setRightYear] = useState(
    timeline[timeline.length - 1].year
  );

  const [zoomLevel, setZoomLevel] = useState(1);
  const [panLevel, setPanLevel] = useState(0);
  const [zoomLevelFloored, setZoomLevelFloored] = useState(1);

  const [selectedEvent, setSelectedEvent] = useState<DataEvent | null>(null);
  const [selectedDataPoint, setSelectedDataPoint] = useState<DataPoint | null>(
    null
  );

  const [selectedButton, setSelectedButton] =
    useState<SelectableDataType | null>(null);

  const [svgWidth, setSvgWidth] = useState(1000);
  const [svgHeight, setSvgHeight] = useState(500);

  const { contextSafe } = useGSAP({ scope: timelineRef });

  //--------------------------------UTILS--------------------------------

  const getActiveLeft = (): SelectableDataType[] => {
    return Object.entries(leftData)
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

      if (side === Side.RIGHT) {
        if (rightData) {
          periods
            .get(rightData)
            ?.filter(
              (period) =>
                (period.startYear >= leftYear &&
                  period.startYear <= rightYear) ||
                (period.endYear <= rightYear && period.endYear >= leftYear) ||
                (period.startYear <= leftYear && period.endYear >= rightYear)
            )
            .forEach((period) => {
              const max =
                period.amount.number / (period.endYear - period.startYear + 1);
              maxValue = Math.max(maxValue, max);
            });

          const max =
            d3.max(visibleTicks, (d) => {
              let value = 0;
              const yearData = d[rightData as keyof TimelineYear];
              if (typeof yearData === "object") {
                value = yearData.number;
              }
              return value;
            }) ?? 0;

          maxValue = Math.max(maxValue, max);
        }
      } else {
        getActiveLeft().forEach((entry) => {
          periods
            .get(entry)
            ?.filter(
              (period) =>
                (period.startYear >= leftYear &&
                  period.startYear <= rightYear) ||
                (period.endYear <= rightYear && period.endYear >= leftYear) ||
                (period.startYear <= leftYear && period.endYear >= rightYear)
            )
            .forEach((period) => {
              const max =
                period.amount.number / (period.endYear - period.startYear + 1);
              maxValue = Math.max(maxValue, max);
            });

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
      }

      const digits = Math.floor(Math.log10(maxValue) + 1);
      const powerNumber = Math.max(Math.pow(10, digits - 2), 1);
      const ceiled = Math.ceil(maxValue / powerNumber) * powerNumber;

      return ceiled;
    }
    return 0;
  };

  const getTickWidth = () => {
    return Math.max(
      (svgWidth - getResponsivePadding().left - getResponsivePadding().right) /
        timeline.length,
      5
    );
  };

  const getActualTickWidth = () => {
    return getTickWidth() * zoomLevel;
  };

  const getLinearScale = (side: Side) => {
    const graphStart =
      getResponsivePadding().top + HEIGHT_TIMELINE + PATH_PADDING;
    const graphEnd = svgHeight - getResponsivePadding().bottom - PATH_PADDING;
    const maxValue = getMaxValueOnScreen(side);

    return d3.scaleLinear().domain([0, maxValue]).range([graphEnd, graphStart]);
  };

  const getRightSideButtons = () => {
    return Object.values(SelectableDataType).filter(
      (d) => !Object.keys(leftData).includes(d)
    );
  };

  const getResponsivePadding = () => {
    return windowWidth >= 1024 ? PADDING : PADDING_MOBILE;
  };

  //--------------------------------ANIMATIONS--------------------------------

  const animateMain = contextSafe(() => {
    gsap.to("#horizontal-axis line", {
      duration: 1,
      attr: { x2: svgWidth - getResponsivePadding().right },
      ease: "power4.out",
    });

    gsap.to("#horizontal-axis polyline", {
      duration: 1,
      attr: {
        points: `${svgWidth - getResponsivePadding().right - 15}, -15 , ${
          svgWidth - getResponsivePadding().right
        }, 0, ${svgWidth - getResponsivePadding().right - 15}, 15`,
      },
      ease: "power4.out",
    });
    gsap.to("#vertical-axis line", {
      duration: 1,
      attr: {
        y2:
          getResponsivePadding().top +
          HEIGHT_TIMELINE +
          getResponsivePadding().top,
      },
      ease: "power4.out",
    });
    gsap.to("#vertical-axis polyline", {
      duration: 1,
      attr: {
        points: `${getResponsivePadding().left - 15}, ${
          getResponsivePadding().top +
          HEIGHT_TIMELINE +
          getResponsivePadding().top +
          15
        } , ${getResponsivePadding().left}, ${
          getResponsivePadding().top +
          HEIGHT_TIMELINE +
          getResponsivePadding().top
        }, ${getResponsivePadding().left + 15}, ${
          getResponsivePadding().top +
          HEIGHT_TIMELINE +
          getResponsivePadding().top +
          15
        }`,
      },
      ease: "power4.out",
    });
  });

  const animateDecades = contextSafe(() => {
    gsap.to(`.decade .line`, {
      opacity: 1,
      attr: { y2: HEIGHT_TIMELINE - PATH_PADDING / 2 },
      duration: 0.4,
      ease: "power4.out",
      stagger: 0.05,
    });
    gsap.to(`.decade .line-2`, {
      opacity: 1,
      attr: { y2: svgHeight - getResponsivePadding().bottom - PATH_PADDING },
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
      attr: { y2: svgHeight - getResponsivePadding().bottom - PATH_PADDING },
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
      attr: { y2: svgHeight - getResponsivePadding().bottom - PATH_PADDING },
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
    gsap.to(`.period-svg-line.short`, {
      opacity: 1,
      duration: 0.4,
      ease: "power4.out",
    });
  });

  const reverseShort = contextSafe(() => {
    gsap.to(`.period-svg-line.short`, {
      opacity: 0,
      duration: 0.4,
      ease: "power4.out",
    });
  });

  const animateDataType = contextSafe((type: SelectableDataType) => {
    gsap.to(`svg.datapoint-svg.${type} .datapoint-svg-circle`, {
      attr: { r: DATA_POINT_SIZE },
      duration: 0.2,
      ease: "elastic.out",
      stagger: 0.01,
    });

    if (periods.has(type)) {
      gsap.to(`svg.period-svg.${type} .period-svg-circle`, {
        attr: { r: DATA_POINT_SIZE_PERIOD },
        duration: 0.2,
        ease: "elastic.out",
        stagger: 0.01,
      });
    }
  });

  const animateData = contextSafe((side: Side) => {
    if (side === Side.LEFT) {
      getActiveLeft().forEach((data) => {
        animateDataType(data);
      });
    } else {
      if (rightData) {
        animateDataType(rightData);
      }
    }
  });

  const animateMouseHover = contextSafe(() => {
    gsap.to("#mouseElementContent", {
      scale: 1,
      duration: 0.4,
      ease: "power4.out",
      overwrite: true,
    });
  });

  const animateMouseHoverReverse = contextSafe(() => {
    d3.select("#mouseElement").attr("class", "");
    gsap.to("#mouseElementContent", {
      scale: 0,
      duration: 0.2,
      ease: "power4.in",
      overwrite: true,
      onComplete: () => {
        setSelectedEvent(null);
        setSelectedDataPoint(null);
        setSelectedButton(null);
        if (windowWidth >= 1024) {
          window.onmousemove = onMouseMove;
        }
      },
    });
  });

  const animateEventOpen = contextSafe(() => {
    if (windowWidth >= 1024) {
      d3.select("#mouseElement").attr("class", "selected");
      window.onmousemove = null;

      gsap.from("#mouseElement .event .event-full", {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        duration: 0.6,
        ease: "power4.out",
      });
    }

    gsap.set("#mouseElement .event .event-full", { display: "block" });

    gsap.to("#mouseElementContent", {
      scale: 1,
      duration: 0.4,
      ease: "power4.out",
      overwrite: true,
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
      .attr("x", (_, i) => {
        return getResponsivePadding().left + i * getActualTickWidth();
      })
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

    const zoomFunction = d3
      .zoom<SVGSVGElement, unknown>()
      .on("zoom", handleZoom)
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [
          Math.max(
            svgWidth,
            getTickWidth() * timeline.length +
              getResponsivePadding().left +
              getResponsivePadding().right
          ),
          svgHeight,
        ],
      ]);

    if (graphRef.current) {
      d3.select(graphRef.current).call(zoomFunction);
    }
  };

  const drawDataOfType = (type: SelectableDataType, side: Side) => {
    const svg = d3
      .select(graphRef.current)
      .select("#group-timeline")
      .append("g")
      .attr("class", `group-timeline-datapoints ${side}`)
      .attr("id", `group-timeline-datapoints-${type}`)
      .selectAll<Element, TimelineYear>("svg.datapoint-svg")
      .data(timeline.filter((d) => typeof d[type]?.number !== "undefined"))
      .enter()
      .append("svg")
      .attr("class", `datapoint-svg ${type} ${side}`)
      .attr("id", (d) => `datapoint-svg-${d.year}-${type}`)
      .attr(
        "x",
        (d) =>
          getResponsivePadding().left +
          (d.year - timeline[0].year) * getTickWidth()
      )
      .attr("y", 0);

    svg
      .append("circle")
      .attr("cx", TICK_OFFSET)
      .attr("cy", (d) => getLinearScale(side)(d[type]?.number ?? 0))
      .attr("r", 0)
      .attr("class", "datapoint-svg-circle unzoom")
      .attr("transform", `scale(${1 / zoomLevel}, 1)`)
      .on("mouseenter", (_, d) => {
        if (d[type] && windowWidth >= 1024) {
          setSelectedDataPoint({
            year: d.year,
            type: type,
            amount: d[type],
          });
        }
      })

      .on("mouseleave", () => {
        animateMouseHoverReverse();
      })
      .on("click", (_, d) => {
        if (windowWidth < 1024) {
          if (d[type]) {
            setSelectedDataPoint({
              year: d.year,
              type: type,
              amount: d[type],
            });
          }
        }
      });
  };

  const drawData = (side: Side) => {
    d3.select(graphRef.current)
      .selectAll(`.group-timeline-datapoints.${side}`)
      .remove();

    if (side === Side.RIGHT) {
      if (rightData) {
        drawDataOfType(rightData, side);
      }
    } else {
      getActiveLeft().forEach((data) => drawDataOfType(data, side));
    }
  };

  const drawPeriodOfType = (type: SelectableDataType, side: Side) => {
    const localPeriods = periods.get(type);

    if (localPeriods) {
      const svg = d3
        .select(graphRef.current)
        .select("#group-timeline")
        .append("g")
        .attr("class", `group-timeline-periods ${side}`)
        .attr("id", `group-timeline-periods-${type}`)
        .selectAll<Element, DataPeriod>("svg.period-svg")
        .data(localPeriods)
        .enter()
        .append("svg")
        .attr("class", `period-svg ${type} ${side}`)
        .attr("id", (d) => `period-svg-${d.startYear}-${type}`)
        .attr(
          "x",
          (d) =>
            getResponsivePadding().left +
            (d.startYear - timeline[0].year) * getTickWidth()
        )
        .attr("y", 0);

      svg
        .append("circle")
        .attr("cx", TICK_OFFSET)
        .attr("cy", (d) =>
          getLinearScale(side)(d.amount.number / (d.endYear - d.startYear + 1))
        )
        .attr("r", 0)
        .attr("transform", `scale(${1 / zoomLevel}, 1)`)
        .attr("class", "period-svg-circle unzoom");

      svg
        .append("circle")
        .attr(
          "cx",
          (d) => TICK_OFFSET + getActualTickWidth() * (d.endYear - d.startYear)
        )
        .attr("cy", (d) =>
          getLinearScale(side)(d.amount.number / (d.endYear - d.startYear + 1))
        )
        .attr("r", 0)
        .attr("transform", `scale(${1 / zoomLevel}, 1)`)
        .attr("class", "period-svg-circle unzoom end");

      svg
        .append("line")
        .attr(
          "class",
          (d) =>
            `period-svg-line unzoom ${
              d.endYear - d.startYear <= 2 ? "short" : ""
            }`
        )
        .attr("transform", `scale(${1 / zoomLevel}, 1)`)
        .attr("x1", TICK_OFFSET + PATH_PADDING - DATA_POINT_SIZE_PERIOD)
        .attr(
          "x2",
          (d) =>
            TICK_OFFSET -
            PATH_PADDING +
            DATA_POINT_SIZE_PERIOD +
            getActualTickWidth() * (d.endYear - d.startYear)
        )
        .attr("y1", (d) =>
          getLinearScale(side)(d.amount.number / (d.endYear - d.startYear + 1))
        )
        .attr("y2", (d) =>
          getLinearScale(side)(d.amount.number / (d.endYear - d.startYear + 1))
        );

      svg
        .on("mouseenter", (_, d) => {
          if (windowWidth >= 1024)
            setSelectedDataPoint({
              year: d.startYear,
              endYear: d.endYear,
              type: type,
              amount: d.amount,
            });
        })
        .on("mouseleave", () => {
          animateMouseHoverReverse();
        })
        .on("click", (_, d) => {
          if (windowWidth < 1024) {
            setSelectedDataPoint({
              year: d.startYear,
              endYear: d.endYear,
              type: type,
              amount: d.amount,
            });
          }
        });
    }
  };

  const drawPeriods = (side: Side) => {
    d3.select(graphRef.current)
      .selectAll(`.group-timeline-periods.${side}`)
      .remove();

    if (side === Side.RIGHT) {
      if (rightData) {
        drawPeriodOfType(rightData, side);
      }
    } else {
      getActiveLeft().forEach((data) => drawPeriodOfType(data, side));
    }
  };

  const getEventWidth = (d: DataEvent) => {
    if (d.endDate && d.endDate.getFullYear() !== d.date.getFullYear()) {
      return (
        (d.endDate.getFullYear() - d.date.getFullYear()) *
          getActualTickWidth() -
        (d.date.getMonth() * getActualTickWidth()) / 12 +
        (d.endDate.getMonth() * getActualTickWidth()) / 12
      );
    } else {
      return EVENT_MIN_WIDTH;
    }
  };

  const drawEvents = () => {
    d3.select(graphRef.current)
      .select("#group-timeline-events")
      .selectAll("svg.event-svg")
      .remove();

    d3.select(graphRef.current)
      .select("#group-timeline-events")
      .selectAll("svg.event-svg")
      .data(events)
      .enter()
      .append("svg")
      .attr("class", "event-svg")
      .attr("x", (d) => {
        return (
          getResponsivePadding().left +
          (d.date.getFullYear() - timeline[0].year) * getActualTickWidth()
        );
      })
      .attr("y", 0)
      .append("rect")
      .attr("class", "event-rect unzoom")
      .attr("y", HEIGHT_TIMELINE / 2)
      .attr("x", (d) => 25 + (d.date.getMonth() * getActualTickWidth()) / 12)
      .attr("rx", (EVENT_MIN_WIDTH / 2) * zoomLevel)
      .attr("height", EVENT_HEIGHT)
      .attr("width", 0);
  };

  //--------------------------------UPDATING DATA--------------------------------

  const updateYears = () => {
    const container = document?.getElementById("svg-wrapper");

    if (container) {
      const { left, right } = container.getBoundingClientRect();

      for (let i = 0; i < timeline.length; i++) {
        const tick = document?.getElementById(`tick-${timeline[i].year}`);
        if (tick) {
          const tickLeft = tick.getBoundingClientRect().left;
          if (tickLeft >= left + getResponsivePadding().left) {
            setLeftYear(timeline[i].year);
            break;
          }
        }
      }

      for (let i = timeline.length - 1; i >= 0; i--) {
        const tick = document?.getElementById(`tick-${timeline[i].year}`);
        if (tick) {
          const tickRight = tick.getBoundingClientRect().right;
          if (tickRight <= right - getResponsivePadding().right) {
            setRightYear(timeline[i].year);
            break;
          }
        }
      }
    }
  };

  const updatePeriods = (type: SelectableDataType) => {
    const svg = d3.selectAll<Element, DataPeriod>(`svg.period-svg.${type}`);

    svg
      .select("line.period-svg-line")
      .attr(
        "x2",
        (d) =>
          TICK_OFFSET -
          PATH_PADDING +
          DATA_POINT_SIZE_PERIOD +
          getActualTickWidth() * (d.endYear - d.startYear)
      );

    svg
      .select("circle.period-svg-circle.end")
      .attr(
        "cx",
        (d) => TICK_OFFSET + getActualTickWidth() * (d.endYear - d.startYear)
      )
      .on("mouseenter", (_, d) => {
        if (windowWidth >= 1024) {
          setSelectedDataPoint({
            year: d.startYear,
            endYear: d.endYear,
            type: type,
            amount: d.amount,
          });
        }
      })
      .on("mouseleave", () => {
        animateMouseHoverReverse();
      })
      .on("click", (_, d) => {
        if (windowWidth < 1024) {
          setSelectedDataPoint({
            year: d.startYear,
            endYear: d.endYear,
            type: type,
            amount: d.amount,
          });
        }
      });
  };

  const updateHeightsOfType = (type: SelectableDataType, side: Side) => {
    d3.selectAll<Element, TimelineYear>(
      `svg.datapoint-svg.${side}.${type}`
    ).each((d) => {
      gsap.to(`#datapoint-svg-${d.year}-${type} .datapoint-svg-circle`, {
        attr: {
          cy: getLinearScale(side)(d[type]?.number ?? 0),
        },
        duration: 0.6,
      });
    });

    d3.selectAll<Element, DataPeriod>(`svg.period-svg.${side}.${type}`).each(
      (d) => {
        const y = getLinearScale(side)(
          d.amount.number / (d.endYear - d.startYear + 1)
        );

        gsap.to(`#period-svg-${d.startYear}-${type} .period-svg-circle`, {
          attr: {
            cy: y,
          },
          duration: 0.6,
        });

        gsap.to(`#period-svg-${d.startYear}-${type} .period-svg-line`, {
          attr: {
            y1: y,
            y2: y,
          },
          duration: 0.6,
        });
      }
    );
  };

  const updateHeights = (side: Side) => {
    if (side === Side.RIGHT) {
      if (rightData) {
        updateHeightsOfType(rightData, side);
      }
    } else {
      getActiveLeft().forEach((data) => updateHeightsOfType(data, side));
    }
  };

  const updateYAxis = (side: Side) => {
    d3.select(graphRef.current).selectAll(`.y-axis.${side}`).remove();
    if (
      (side === Side.LEFT && getActiveLeft().length > 0) ||
      (side === Side.RIGHT && rightData)
    ) {
      const graphStart =
        getResponsivePadding().top + HEIGHT_TIMELINE + PATH_PADDING;
      const graphEnd = svgHeight - getResponsivePadding().bottom - PATH_PADDING;
      const nrOfTicks = Math.floor((graphEnd - graphStart) / 50);
      const maxValue = getMaxValueOnScreen(side);

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
        .text((d) => Intl.NumberFormat("en-US").format(d))
        .attr("text-anchor", side === Side.LEFT ? "end" : "start")
        .attr(
          "x",
          side === Side.LEFT
            ? getResponsivePadding().left - PATH_PADDING
            : svgWidth - getResponsivePadding().right + PATH_PADDING
        )
        .attr("y", (d) => getLinearScale(side)(d));
    }
  };

  const updateEvents = () => {
    d3.select(graphRef.current)
      .select("#group-timeline-events")
      .selectAll<Element, DataEvent>("svg.event-svg")
      .select("rect.event-rect")
      .attr("x", (d) => 25 + (d.date.getMonth() * getActualTickWidth()) / 12)
      .attr("width", getEventWidth);
  };

  const handleZoom = (e: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
    setZoomLevel(() => e.transform.k);
    setPanLevel(() => e.transform.x);
  };

  const movingRightSideBack = contextSafe((key: SelectableDataType) => {
    const icon = document.getElementById(`timeline-data-icon-${key}`);

    gsap.killTweensOf(icon);

    gsap.to(icon, { x: 0, y: 0, duration: 1, ease: "power4.out" });
  });

  //--------------------------------USE EFFECTS--------------------------------

  useEffect(() => {
    updateYears();
    updateEvents();
    setZoomLevelFloored(() => Math.floor(zoomLevel));
    getActiveLeft().forEach((data) => {
      getMaxValueOnScreen(Side.LEFT);
      updateHeights(Side.LEFT);
      updatePeriods(data);
      updateYAxis(Side.LEFT);
    });

    if (rightData) {
      getMaxValueOnScreen(Side.RIGHT);
      updateHeights(Side.RIGHT);
      updateYAxis(Side.RIGHT);
      updatePeriods(rightData);
    }

    d3.select(graphRef.current)
      .select("#group-timeline")
      .attr("transform", `translate(${panLevel}, 0) scale(${zoomLevel}, 1)`);

    d3.select(graphRef.current)
      .select("#group-timeline-events")
      .attr("transform", `translate(${panLevel}, 0) scale(${zoomLevel}, 1)`);

    d3.select(graphRef.current)
      .selectAll(".unzoom")
      .attr("transform", `scale(${1 / zoomLevel}, 1)`);
  }, [zoomLevel, panLevel]);

  useEffect(() => {
    if (scrolled) {
      if (zoomLevelFloored >= LUSTRUM_ZOOM) {
        animateLustra();
        animateData(Side.LEFT);
        animateData(Side.RIGHT);
      } else {
        reverseLustra();
      }

      if (zoomLevelFloored >= REGULAR_ZOOM) {
        animateRegular();
        animateData(Side.LEFT);
        animateData(Side.RIGHT);
      } else {
        reverseRegular();
      }

      if (
        (getActiveLeft().length > 0 || rightData) &&
        zoomLevelFloored >= SHORT_ZOOM
      ) {
        animateShort();
      }

      if (
        (getActiveLeft().length > 0 || rightData) &&
        zoomLevelFloored < SHORT_ZOOM
      ) {
        reverseShort();
      }
    }
  }, [zoomLevelFloored]);

  useEffect(() => {
    getMaxValueOnScreen(Side.LEFT);
    drawData(Side.LEFT);
    drawPeriods(Side.LEFT);
    updateYAxis(Side.LEFT);
    animateData(Side.LEFT);
  }, [leftData]);

  useEffect(() => {
    if (previousRightData) {
      movingRightSideBack(previousRightData);
    }
    setPreviousRightData(rightData);

    getMaxValueOnScreen(Side.RIGHT);
    drawData(Side.RIGHT);
    drawPeriods(Side.RIGHT);
    updateYAxis(Side.RIGHT);
    animateData(Side.RIGHT);
  }, [rightData]);

  useEffect(() => {
    console.log("selectedButton", selectedButton);
    if (selectedButton) {
      setSelectedDataPoint(null);
      setSelectedEvent(null);
      animateMouseHover();
    }
  }, [selectedButton]);

  useEffect(() => {
    console.log("selectedDataPoint", selectedDataPoint);
    if (selectedDataPoint) {
      setSelectedButton(null);
      setSelectedEvent(null);
      animateMouseHover();
    }
  }, [selectedDataPoint]);

  useEffect(() => {
    console.log("selectedEvent", selectedEvent);
    if (selectedEvent) {
      setSelectedButton(null);
      setSelectedDataPoint(null);
      if (windowWidth >= 1024) {
        animateMouseHover();
      } else {
        animateEventOpen();
      }
    }
  }, [selectedEvent]);

  useGSAP(
    () => {
      gsap.registerPlugin(Draggable);
      gsap.registerPlugin(InertiaPlugin);

      Object.keys(leftData).forEach((key) => {
        const icon = document.getElementById(`timeline-data-icon-${key}`);
        const placeholder = document.getElementById(
          `active-row-placeholder-${key}`
        );

        const returnElement = document.getElementById(
          `active-row-return-${key}`
        );

        if (icon && placeholder && returnElement) {
          const { x: iconX, y: iconY } = icon.getBoundingClientRect();
          const { x: spotX, y: spotY } = placeholder.getBoundingClientRect();
          const { x: returnX, y: returnY } =
            returnElement.getBoundingClientRect();

          const halfwayX = Math.abs(spotX - returnX) / 2;

          Draggable.create(icon, {
            inertia: true,
            type: "x,y",
            resistance: 0.5,
            edgeResistance: 0.5,
            bounds: "#data-icon-bounds",
            onClick: () => {
              if (windowWidth < 1024) {
                setSelectedButton(key as SelectableDataType);
              }
            },
            onDragStart: () => {
              animateMouseHoverReverse();
              gsap.to(icon, { scale: 0.7, borderRadius: "100%" });
            },
            onDragEnd: () => {
              gsap.to(icon, { scale: 1, borderRadius: "7.5px" });
              returnElement.classList.remove("closer");
              placeholder.classList.remove("closer");
            },
            liveSnap: {
              points: (point) => {
                if (point.x <= halfwayX) {
                  returnElement.classList.add("closer");
                  placeholder.classList.remove("closer");
                } else {
                  returnElement.classList.remove("closer");
                  placeholder.classList.add("closer");
                }

                return point;
              },
            },
            snap: {
              points: (point) => {
                if (point.x <= halfwayX) {
                  setLeftData((prev) => {
                    const newData = { ...prev };
                    newData[key as keyof LeftData] = false;
                    return newData;
                  });

                  return { x: returnX - iconX, y: returnY - iconY };
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

      getRightSideButtons().forEach((key) => {
        const icon = document.getElementById(`timeline-data-icon-${key}`);
        const placeholder = document.getElementById(
          `active-row-placeholder-right`
        );

        const returnElement = document.getElementById(
          `active-row-return-${key}`
        );

        if (icon && placeholder && returnElement) {
          const { x: iconX, y: iconY } = icon.getBoundingClientRect();
          const { x: spotX, y: spotY } = placeholder.getBoundingClientRect();

          const { x: returnX, y: returnY } =
            returnElement.getBoundingClientRect();

          const halfwayX = Math.abs(spotX - returnX) / 2;

          Draggable.create(icon, {
            type: "x,y",
            inertia: true,
            edgeResistance: 0.5,
            bounds: "#data-icon-bounds",
            onClick: () => {
              if (windowWidth < 1024) {
                setSelectedButton(key);
              }
            },
            onDragStart: () => {
              animateMouseHoverReverse();
              gsap.to(icon, { scale: 0.7, borderRadius: "100%" });
            },
            onDragEnd: () => {
              gsap.to(icon, { scale: 1, borderRadius: "7.5px" });
              returnElement.classList.remove("closer");
              placeholder.classList.remove("closer");
            },
            liveSnap: {
              points: (point) => {
                if (point.x <= halfwayX) {
                  returnElement.classList.add("closer");
                  placeholder.classList.remove("closer");
                } else {
                  returnElement.classList.remove("closer");
                  placeholder.classList.add("closer");
                }

                return point;
              },
            },
            snap: {
              points: (point) => {
                if (point.x <= halfwayX) {
                  setRightData(null);
                  return { x: returnX - iconX, y: returnY - iconY };
                }

                setRightData(key);
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
          .to(".timeline-cta", { opacity: 0, duration: 0.5 }, "<")
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
                height: svgHeight - HEIGHT_TIMELINE - 8,
                rx: getResponsivePadding().rx,
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
                y2: svgHeight - getResponsivePadding().bottom - PATH_PADDING,
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
              attr: { x2: svgWidth - getResponsivePadding().right },
              ease: "power4.out",
            },
            "<"
          )
          .to(
            "#horizontal-axis polyline",
            {
              duration: 1,
              attr: {
                points: `${
                  svgWidth - getResponsivePadding().right - 15
                }, -15 , ${svgWidth - getResponsivePadding().right}, 0, ${
                  svgWidth - getResponsivePadding().right - 15
                }, 15`,
              },
              ease: "power4.out",
            },
            "<"
          )
          .to(
            "#vertical-axis line",
            {
              duration: 1,
              attr: {
                y2:
                  getResponsivePadding().top +
                  HEIGHT_TIMELINE +
                  getResponsivePadding().top,
              },
              ease: "power4.out",
            },
            "<"
          )
          .to(
            "#vertical-axis polyline",
            {
              duration: 1,
              attr: {
                points: `${getResponsivePadding().left - 15}, ${
                  getResponsivePadding().top +
                  HEIGHT_TIMELINE +
                  getResponsivePadding().top +
                  15
                } , ${getResponsivePadding().left}, ${
                  getResponsivePadding().top +
                  HEIGHT_TIMELINE +
                  getResponsivePadding().top
                }, ${getResponsivePadding().left + 15}, ${
                  getResponsivePadding().top +
                  HEIGHT_TIMELINE +
                  getResponsivePadding().top +
                  15
                }`,
              },
              ease: "power4.out",
            },
            "<"
          );

        d3.select(graphRef.current)
          .selectAll<Element, DataEvent>("svg.event-svg")
          .attr("x", (d) => {
            return (
              getResponsivePadding().left +
              (d.date.getFullYear() - timeline[0].year) * getTickWidth()
            );
          });
        d3.select(graphRef.current)
          .selectAll<Element, DataEvent>(".event-svg .event-rect")
          .each((d, i, nodes) => {
            gsapTimeline.to(
              nodes[i],
              {
                attr: { width: getEventWidth(d) },
                duration: 0.5,
              },
              "<+0.05"
            );
          });
      }
    },
    { scope: timelineRef, dependencies: [gsapTimeline] }
  );

  useEffect(() => {
    drawTimeline();
    resizeTicks();
    getActiveLeft().forEach((data) => {
      resizeDataPoints(data);
      resizePeriods(data);
    });

    if (rightData) {
      resizeDataPoints(rightData);
      resizePeriods(rightData);
    }

    if (windowWidth >= 1024) {
      window.onmousemove = onMouseMove;
    }

    resizeYAxis();

    if (svgHeight < HEIGHT_TIMELINE + 120) {
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
      .attr("y", svgHeight - getResponsivePadding().bottom);
    d3.select(graphRef.current)
      .select("#vertical-axis line")
      .attr("y1", svgHeight - getResponsivePadding().bottom);
    d3.select(graphRef.current)
      .select("#main-graph-stroke")
      .attr("width", svgWidth - 8)
      .attr("height", svgHeight - HEIGHT_TIMELINE - 8);
    d3.select(graphRef.current)
      .select("#svg-wrapper")
      .attr("width", svgWidth - 8)
      .attr("height", svgHeight - 8);

    if (scrolled) {
      resizeEvents();
      animateMain();
      animateDecades();
      if (zoomLevel >= LUSTRUM_ZOOM) animateLustra();
      if (zoomLevel >= REGULAR_ZOOM) animateRegular();
      updateHeights(Side.RIGHT);
      updateHeights(Side.LEFT);
    }
  }, [svgWidth, svgHeight, scrolled]);

  //--------------------------------MAIN USE EFFECT--------------------------------

  useEffect(() => {
    if (graphRef.current) {
      const { width, height } = graphRef.current.getBoundingClientRect();
      setSvgHeight(height);
      setSvgWidth(width);
    }

    drawTimeline();
    drawEvents();
    drawData(Side.LEFT);
    drawData(Side.RIGHT);
    drawPeriods(Side.LEFT);
    drawPeriods(Side.RIGHT);

    window.onresize = onResize;

    return () => {
      window.onmousemove = null;
      window.onresize = null;
    };
  }, []);

  //--------------------------------WINDOW STUFF--------------------------------

  const resizeTicks = () => {
    //TODO: Correctly update ticks when zoomed in

    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll<Element, TimelineYear>("svg.tick")
      .attr("x", (d) => {
        return (
          getResponsivePadding().left +
          (d.year - timeline[0].year) * getTickWidth()
        );
      });
  };

  const resizeDataPoints = (type: SelectableDataType) => {
    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll<Element, TimelineYear>("svg.datapoint-svg")
      .attr(
        "x",
        (d) =>
          getResponsivePadding().left +
          (d.year - timeline[0].year) * getTickWidth()
      )
      .on("mouseenter", (_, d) => {
        if (windowWidth >= 1024) {
          if (d[type]) {
            setSelectedDataPoint({
              year: d.year,
              type: type,
              amount: d[type],
            });
          }
        }
      })

      .on("mouseleave", () => {
        animateMouseHoverReverse();
      })
      .on("click", (_, d) => {
        if (windowWidth < 1024) {
          if (d[type]) {
            setSelectedDataPoint({
              year: d.year,
              type: type,
              amount: d[type],
            });
          }
        }
      });
  };

  const resizePeriods = (type: SelectableDataType) => {
    d3.select(graphRef.current)
      .select("#group-timeline")
      .selectAll<Element, DataPeriod>(`svg.period-svg.${type}`)
      .attr(
        "x",
        (d) =>
          getResponsivePadding().left +
          (d.startYear - timeline[0].year) * getTickWidth()
      );

    updatePeriods(type);
  };

  const resizeEvents = () => {
    d3.select(graphRef.current)
      .select("#group-timeline-events")
      .selectAll<Element, DataEvent>("svg.event-svg")
      .attr("x", (d) => {
        return (
          getResponsivePadding().left +
          (d.date.getFullYear() - timeline[0].year) * getTickWidth()
        );
      })
      .select("rect.event-rect")
      .attr("x", (d) => 25 + (d.date.getMonth() * getTickWidth()) / 12)
      .attr("width", getEventWidth)
      .on("mouseenter", (_, d) => {
        if (windowWidth >= 1024) {
          window.onmousemove = onMouseMove;
          setSelectedEvent(d);
        }
      })
      .on("mouseleave", (e: MouseEvent) => {
        if (windowWidth >= 1024) {
          if (
            e.relatedTarget &&
            (e.relatedTarget as Element).id !== "mouseElement"
          ) {
            animateMouseHoverReverse();
          }
        } else {
          if (
            e.relatedTarget &&
            !(e.relatedTarget as Element).classList.contains("event-rect")
          ) {
            animateMouseHoverReverse();
          }
        }
      })
      .on("click", (_, d) => {
        if (windowWidth >= 1024) {
          animateEventOpen();
        } else {
          setSelectedEvent(d);
        }
      });
  };

  const resizeYAxis = () => {
    if (rightData) {
      updateYAxis(Side.RIGHT);
    }
    if (getActiveLeft().length > 0) {
      updateYAxis(Side.LEFT);
    }
  };

  const onResize = () => {
    if (graphRef.current) {
      const { width, height } = graphRef.current.getBoundingClientRect();
      setSvgHeight(height);
      setSvgWidth(width);
    }
  };

  const onMouseMove = (e: MouseEvent) => {
    const elementWidth =
      document.getElementById("mouseElement")?.getBoundingClientRect().width ??
      0;

    gsap.to("#mouseElement", {
      x: e.clientX - elementWidth / 2,
      y: e.clientY - MOUSE_ELEMENT_PADDING,
      duration: 0.2,
      stagger: 0.5,
      overwrite: true,
    });
  };

  return (
    <div ref={timelineRef} className="timeline-section">
      <div className="timeline-cta">
        <span>
          The crimes against Palestinians did not start on October 07, 2023.
          <span className="text-BLACK"> Scroll down to see more.</span>
        </span>
      </div>

      <div className="timeline-main opacity-0 w-full h-full">
        <div className="h-2/5 lg:h-1/5 flex flex-col-reverse lg:flex-row justify-between gap-8 items-center pb-4">
          <div id="data-icon-bounds">
            <div className="inactive">
              <div className="data-icon-row left">
                {Object.keys(leftData).map((key) => {
                  return (
                    <div
                      id={`active-row-return-${key}`}
                      className="data-button active-row-placeholder"
                      key={key}
                    >
                      <button
                        id={`timeline-data-icon-${key}`}
                        className={`data-button data-icon ${key} left`}
                        onMouseEnter={() => {
                          setSelectedButton(key as SelectableDataType);
                        }}
                        onMouseLeave={() => {
                          animateMouseHoverReverse();
                        }}
                      >
                        {key[0]}
                      </button>
                    </div>
                  );
                })}
                {getRightSideButtons().map((key) => {
                  return (
                    <div
                      className="data-button active-row-placeholder"
                      key={key}
                      id={`active-row-return-${key}`}
                    >
                      <button
                        onMouseEnter={() => {
                          setSelectedButton(key as SelectableDataType);
                        }}
                        onMouseLeave={() => {
                          animateMouseHoverReverse();
                        }}
                        id={`timeline-data-icon-${key}`}
                        className={`data-button data-icon ${key} right`}
                      >
                        {key[0]}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="separator"></div>
            <div className="active">
              <div className="data-icon-row left">
                {Object.keys(leftData).map((key) => (
                  <div
                    key={key}
                    id={`active-row-placeholder-${key}`}
                    className="data-button active-row-placeholder"
                  ></div>
                ))}
              </div>
              <div className="separator-vertical"></div>
              <div className="data-icon-row right">
                <div
                  id={`active-row-placeholder-right`}
                  className="data-button active-row-placeholder"
                ></div>
              </div>
            </div>
          </div>

          <div className="text-BLACK text-4xl font-bold flex flex-row lg:flex-col items-end lg:w-1/4">
            <span>{leftYear}</span>
            <span className="lg:hidden">—</span>
            <span>{rightYear}</span>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="svg-graph"
          ref={graphRef}
          strokeLinecap="round"
          strokeLinejoin="round"
          className=" w-full h-3/5 lg:h-4/5 max-h-full rounded-[20px] lg:rounded-60 origin-center overscroll-contain"
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
                x1={getResponsivePadding().left}
                x2={getResponsivePadding().left}
                y1={0}
                y2={0}
                className="stroke-4 lg:stroke-8 stroke-BLACK"
              />
              <polyline
                points={`${getResponsivePadding().left}, 0 , ${
                  getResponsivePadding().left
                }, 0, ${getResponsivePadding().left}, 0`}
                className="stroke-4 lg:stroke-8 stroke-BLACK fill-none"
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
          <g id="group-timeline"></g>
          <use
            y={
              HEIGHT_TIMELINE -
              PATH_PADDING / 2 -
              (HEIGHT_TIMELINE / 2 - PATH_PADDING) / 2 -
              15
            }
            href="#horizontal-axis"
          />
          <g id="group-timeline-events"></g>
          <use
            id="horizontal-axis-bottom"
            y={svgHeight - getResponsivePadding().bottom}
            href="#horizontal-axis"
          />
          <g id="vertical-axis" className="opacity-0">
            <line
              x1={getResponsivePadding().left}
              x2={getResponsivePadding().left}
              y1={svgHeight - getResponsivePadding().bottom}
              y2={svgHeight - getResponsivePadding().bottom}
              className="stroke-4 lg:stroke-8 stroke-BLACK"
            />
            <polyline
              points={`${getResponsivePadding().left}, ${
                svgHeight - getResponsivePadding().bottom
              }, ${getResponsivePadding().left}, ${
                svgHeight - getResponsivePadding().bottom
              },${getResponsivePadding().left}, ${
                svgHeight - getResponsivePadding().bottom
              }`}
              className="stroke-4 lg:stroke-8 stroke-BLACK fill-none"
            />
          </g>
          <rect
            x={0}
            y={0}
            width={getResponsivePadding().left + 50}
            fill="url(#fade-to-right)"
            className="h-full pointer-events-none"
          ></rect>
          <rect
            x={svgWidth - getResponsivePadding().right - 50}
            y={0}
            width={getResponsivePadding().right + 50}
            fill="url(#fade-to-left)"
            className="h-full pointer-events-none"
          ></rect>
          <rect
            x={4}
            y={HEIGHT_TIMELINE + 4}
            width={Math.max(svgWidth - 8, 0)}
            height={1}
            className="pointer-events-none stroke-BLACK fill-none stroke-4 lg:stroke-8"
            id="main-graph-stroke"
            rx={getResponsivePadding().rx}
          />
        </svg>
      </div>

      <div
        onMouseLeave={() => {
          if (selectedEvent) {
            animateMouseHoverReverse();
          }
        }}
        id="mouseElement"
      >
        <div id="mouseElementContent">
          <div id="mouseElementContentVisibility">
            {selectedButton && (
              <span>{dataTypeAndDataToString(selectedButton)}</span>
            )}
            {selectedDataPoint && (
              <div className="datapoint">
                <span className="number">
                  {selectedDataPoint.endYear ? (
                    <>
                      <span>
                        {dataTypeAndDataToString(
                          selectedDataPoint.type,
                          selectedDataPoint.amount.number
                        )}
                      </span>{" "}
                      between <span>{selectedDataPoint.year}</span> and{" "}
                      <span>{selectedDataPoint.endYear}</span>(avg.{" "}
                      {Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 0,
                      }).format(
                        selectedDataPoint.amount.number /
                          (selectedDataPoint.endYear -
                            selectedDataPoint.year +
                            1)
                      )}{" "}
                      per year)
                    </>
                  ) : (
                    <>
                      <span>
                        {dataTypeAndDataToString(
                          selectedDataPoint.type,
                          selectedDataPoint.amount.number
                        )}
                      </span>{" "}
                      in <span>{selectedDataPoint.year}</span>
                    </>
                  )}
                </span>

                <ul className="sources">
                  <li>
                    <span>
                      Source
                      {selectedDataPoint.amount.source.length === 1 ? "" : "s"}:
                    </span>
                  </li>
                  {selectedDataPoint.amount.source.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
                {selectedDataPoint.amount.note && (
                  <p className="note">{selectedDataPoint.amount.note}</p>
                )}
              </div>
            )}
            {selectedEvent && (
              <div className="event">
                <div className="title">{selectedEvent.name}</div>
                <div className="date">
                  {selectedEvent.date.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {selectedEvent.endDate && " - "}
                  {selectedEvent.endDate &&
                    selectedEvent.endDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                </div>
                <div className="event-full">
                  <div className="description">
                    {selectedEvent?.description}
                  </div>

                  <a
                    className="read-more"
                    target="_blank"
                    href={selectedEvent?.link}
                  >
                    read more
                  </a>
                  <ul className="sources">
                    {selectedEvent?.source?.map((source) => (
                      <li key={source}>{source}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Timeline;
