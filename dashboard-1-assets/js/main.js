// Get CSS Variables
const getColorVariable = (color) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${color}`)
    .trim();

const colorPrimary = getColorVariable("primary"),
  colorAccent = getColorVariable("accent"),
  colorDefault = getColorVariable("default"),
  colorCard = getColorVariable("card"),
  colorLabel = getColorVariable("label");

// Declare renderChart method
const renderChart = (options, id) => {
  let chart = new ApexCharts(document.querySelector(`#${id}`), options);
  chart.render();

  return chart;
};

// Declare Default Chart Options
const defaultOptions = {
  chart: {
    height: 166,
    width: "100%",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  tooltip: {
    enabled: true,
    fillSeriesColor: false,
    style: {
      fontFamily: "Sora",
    },
  },
  legend: {
    show: false,
  },
  selection: {
    enabled: false,
  },
  markers: {
    size: 0,
    colors: undefined,
    strokeColors: colorCard,
    strokeWidth: 2,
    strokeOpacity: 0.3,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: "circle",
    hover: {
      size: undefined,
      sizeOffset: 6,
    },
  },
  dataLabels: {
    enabled: false,
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
    active: {
      filter: {
        type: "none",
      },
    },
  },
};

// Crosshair defaults
const crosshairs = {
  show: true,
  stroke: {
    color: "rgba(255, 255, 255, 0.25)",
    width: 2,
    dashArray: 3,
  },
  dropShadow: {
    enabled: false,
  },
  fill: {
    type: "solid",
    color: "#B1B9C4",
  },
  position: "front",
};

// Create sparklines bar chart
const sparklineBarOptions = {
  series: [
    {
      data: [12, 24, 15, 47, 20],
    },
  ],
  ...defaultOptions,
  chart: {
    type: "bar",
    width: 80,
    height: 35,
    sparkline: {
      enabled: true,
    },
  },
  colors: [colorPrimary],
  plotOptions: {
    bar: {
      columnWidth: "60%",
    },
  },
  labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  xaxis: {
    crosshairs: {
      width: 0,
    },
  },
  // tooltip: {
  //   enabled: false,
  // },
  selection: {
    enabled: true,
  },
};
renderChart(sparklineBarOptions, "sparklinesBar");

// Create radial bar chart
const radialBarOptions = {
  ...defaultOptions,
  chart: {
    ...defaultOptions.chart,
    type: "radialBar",
    height: 130,
  },
  series: [33],
  labels: ["Usage"],
  colors: [colorPrimary],
  grid: {
    show: false,
    padding: { left: -30, right: -30, top: 0, bottom: -25 },
  },
  stroke: {
    lineCap: "round",
  },
  plotOptions: {
    radialBar: {
      hollow: {
        size: "60%",
      },
      track: {
        background: "#363636",
      },
      dataLabels: {
        show: false,
      },
    },
  },
};
renderChart(radialBarOptions, "radialBarChart");

// Create bar Chart
const barChartOptions = {
  series: [
    {
      name: "Data 1",
      data: [24, 51, 32, 70, 65, 34, 89],
    },
    {
      name: "Data 2",
      data: [12, 24, 15, 47, 42, 15, 47],
    },
  ],
  ...defaultOptions,
  chart: {
    ...defaultOptions.chart,
    type: "bar",
  },
  colors: [colorPrimary, "#363636"],
  plotOptions: {
    bar: {
      columnWidth: "50%",
    },
  },
  grid: {
    strokeDashArray: 3,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: { left: 20, right: 20, top: -16, bottom: -8 },
  },
  yaxis: {
    show: false,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    labels: {
      style: {
        fontFamily: "Sora",
        colors: colorLabel,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: false,
    },
  },
};
renderChart(barChartOptions, "barChart");

// Create gauge Chart
const gaugeChartOptions = {
  series: [
    {
      name: "Using",
      data: [0, 24, 0],
    },
    {
      name: "Not Using",
      data: [0, 12, 0],
    },
  ],
  ...defaultOptions,
  chart: {
    ...defaultOptions.chart,
    type: "bar",
    stacked: true,
  },
  colors: [colorPrimary, "#363636"],
  plotOptions: {
    bar: {
      columnWidth: "85%",
    },
  },
  grid: {
    strokeDashArray: 3,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: { left: 20, right: 20, top: -16, bottom: -8 },
  },
  yaxis: {
    show: false,
  },
  xaxis: {
    categories: [""],
    labels: {
      style: {
        fontFamily: "Sora",
        colors: colorLabel,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: false,
    },
  },
};
renderChart(gaugeChartOptions, "gaugeChart");

// Create area chart
const areaOptions = {
  ...defaultOptions,
  series: [
    {
      name: "Series 1",
      data: [20, 51, 15, 50, 26, 78, 38],
    },
    {
      name: "Series 1",
      data: [30, 20, 51, 15, 50, 26, 40],
    },
  ],
  chart: {
    ...defaultOptions.chart,
    type: "area",
    height: 240,
  },
  colors: [colorPrimary, colorDefault],
  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: "#fff",
          opacity: 0.05,
        },
        ,
        {
          offset: 100,
          color: "#fff",
          opacity: 0,
        },
      ],
    },
  },
  grid: {
    strokeDashArray: 3,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: { left: 20, right: 20, top: 0, bottom: -8 },
  },
  stroke: {
    show: true,
    curve: "smooth",
    lineCap: "butt",
    colors: [colorPrimary, colorDefault],
    width: 3,
    dashArray: 0,
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      style: {
        fontFamily: "Sora",
        colors: colorLabel,
      },
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs,
  },
};

renderChart(areaOptions, "areaChart");

// Create line Chart
const lineOptions = {
  ...defaultOptions,
  series: [
    {
      name: "Series 1",
      data: [40, 61, 45, 51, 36, 88, 48],
    },
  ],
  chart: {
    ...defaultOptions.chart,
    type: "line",
    height: 240,
    dropShadow: {
      enabled: true,
      top: 40,
      left: 2,
      blur: 3,
      color: "#fff",
      opacity: 0.015,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      colorStops: [
        {
          offset: 0,
          color: colorCard,
          opacity: 1,
        },
        {
          offset: 30,
          color: colorPrimary,
          opacity: 1,
        },
        {
          offset: 70,
          color: colorPrimary,
          opacity: 1,
        },
        {
          offset: 100,
          color: colorCard,
          opacity: 1,
        },
      ],
    },
  },
  markers: {
    size: 0,
    strokeWidth: 3,
    strokeOpacity: 0.9,
    hover: {
      size: undefined,
      sizeOffset: 8,
    },
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: 5,
        fillColor: colorPrimary,
        strokeColor: colorCard,
        size: 8,
        shape: "circle", // "circle" | "square" | "rect"
      },
    ],
  },
  colors: [colorPrimary, colorDefault],
  grid: {
    strokeDashArray: 3,
    borderColor: "rgba(255, 255, 255, 0.05)",
    padding: { left: 20, right: 20, top: 0, bottom: -8 },
  },
  stroke: {
    lineCap: "round",
    curve: "smooth",
    width: 3,
    dashArray: 0,
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 5,
    labels: {
      style: {
        fontFamily: "Sora",
        colors: colorLabel,
      },
    },
  },
  xaxis: {
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs,
  },
};

const lineChartRef = renderChart(lineOptions, "lineChart");

const selectLineYear = (element, year) => {
  const buttons = document.querySelectorAll(
    ".card-line-chart .card-header button"
  );

  buttons.forEach((button) => {
    button.classList.remove("active");
  });

  element.classList.add("active");

  let data;
  if (year === 2022) {
    data = [40, 61, 45, 51, 36, 88, 48];
  } else {
    data = [40, 34, 54, 31, 44, 26, 79];
  }

  lineChartRef.updateSeries([
    {
      data,
    },
  ]);
};

// GSAP Animations
const cards = gsap.utils.toArray(".card");

cards.forEach((card) => {
  const animation = gsap.fromTo(
    card,
    {
      autoAlpha: 0,
      y: 100,
      x: -100,
      rotate: -10,
    },
    {
      duration: 0.6,
      autoAlpha: 1,
      y: 0,
      x: 0,
      rotate: 0,
    }
  );

  console.log("ScrollTrigger", ScrollTrigger);

  ScrollTrigger.create({
    trigger: card,
    animation,
  });
});
