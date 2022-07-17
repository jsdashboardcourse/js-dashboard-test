// Create Jquery style selector function
const $ = (selector) => document.querySelector(selector);

// Data variables
let topProducts = [];

// Load Dark Mode Settings
let isDarkMode = localStorage.getItem("js_dashboard_dark_mode")
  ? localStorage.getItem("js_dashboard_dark_mode") === "true"
  : window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

$(".dark-mode-toggle.uil").classList.remove("uil-sun");
$(".dark-mode-toggle.uil").classList.remove("uil-moon");

if (isDarkMode) {
  $(".dark-mode-toggle.uil").classList.add("uil-sun");
} else {
  $(".dark-mode-toggle.uil").classList.add("uil-moon");
}

$("html").setAttribute("data-dark-mode", isDarkMode.toString());

// Get Colors From CSS Variables
const getColorVariable = (color) =>
  getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${color}`)
    .trim();

let colorPrimary = getColorVariable("primary"),
  colorPrimaryLight = getColorVariable("primary-light"),
  colorAccent = getColorVariable("accent"),
  colorDefault = getColorVariable("default"),
  colorCard = getColorVariable("card"),
  colorBorder = getColorVariable("border"),
  colorGrey = getColorVariable("grey"),
  colorLabel = getColorVariable("label"),
  colorChartShade0 = getColorVariable("chart-shade-0"),
  colorChartShade1 = getColorVariable("chart-shade-1");

// Chart default options
const defaultOptions = {
  type: "bar",
  data: {},
  options: {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        usePointStyle: true,
        callback: {
          labelPointStyle: () => ({
            pointStyle: "circle",
          }),
        },
        caretSize: 0,
        padding: 12,
        titleFont: {
          family: "Sora",
          size: 12,
          weight: 400,
        },
        bodyFont: {
          family: "Sora",
          size: 12,
          weight: 400,
        },
        footerFont: {
          family: "Sora",
          size: 12,
          weight: 400,
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  },
};

// Create chart
const createChart = (selector, options) => {
  const ctx = document.getElementById(selector).getContext("2d");
  const chart = new Chart(ctx, options);
  return [ctx, chart];
};

// Abbreviate long number function
const abbreviateLongNumber = (n) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + "K";
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + "M";
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + "B";
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + "T";
};

// Bar Figure Chart
const buildBarChart = () => {
  const labels = topProducts.map((product) => product.brands);

  const barData1 = [],
    barData2 = [];

  topProducts.forEach((product) => {
    const additives = product.languages_tags.length,
      ingredients = product.ingredients.length;

    barData1.push(additives);
    barData2.push(ingredients);
  });

  const barOptions = {
    ...defaultOptions,
    data: {
      ...defaultOptions.data,
      labels,
      datasets: [
        {
          label: "Languages",
          data: barData1,
          backgroundColor: colorPrimaryLight,
          hoverBackgroundColor: colorPrimaryLight,
          borderColor: colorPrimaryLight,
          borderWidth: 0,
          barThickness: 12,
          borderRadius: 6,
        },
        {
          label: "Ingredients",
          data: barData2,
          backgroundColor: "#ffffff",
          hoverBackgroundColor: "#ffffff",
          borderColor: "#ffffff",
          borderWidth: 0,
          barThickness: 12,
          borderRadius: 6,
        },
      ],
    },
  };

  createChart("figureBarChart", barOptions);
};

// Get Radial bar select items
const radialBarOptions = {
  ...defaultOptions,
  type: "doughnut",
  data: {
    labels: ["", ""],
    datasets: [
      {
        label: "",
        data: [33, 66],
        backgroundColor: [colorPrimary, colorGrey],
        hoverBackgroundColor: [colorPrimary, colorGrey],
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  },
  options: {
    ...defaultOptions.options,
    cutout: 40,
    plugins: {
      ...defaultOptions.options.plugins,
      tooltip: {
        ...defaultOptions.options.plugins.tooltip,
        filter: ({ dataIndex }) => dataIndex === 0,
        multiKeyBackground: "transparent",
      },
    },
  },
};

const [radialBarCtx, radialBarChart] = createChart(
  "radialBarChart",
  radialBarOptions
);

const selectProduct = (id) => {
  const product = topProducts.find((p) => p.id === id);

  radialBarChart.data.datasets[0].data = [product.additives_n, 5];
  radialBarChart.update();

  $("#preloader").classList.remove("radial-bar-loading");

  const facts = [
    `${product?.additives_n || 0} additive(s)`,
    `${product?.categories_tags.length} tag(s)`,
    `${product?.ingredients_n} ingredient(s)`,
    `${(product?.completeness * 100).toFixed(1)}%`,
  ];

  let html = "";

  facts.forEach((fact) => {
    html += `
      <span class="card-radial-bar-chart-feature-icon uil uil-angle-right"></span>
      <span class="card-radial-bar-chart-feature-text">${fact}</span>
    `;
  });

  $("#factsGrid").innerHTML = html;
};

const createRadialBarSelect = () => {
  const selectedProduct = topProducts[0];
  selectProduct(selectedProduct.id);

  let html = "";

  topProducts.forEach((product) => {
    html += `
      <option value="${product.id}">
        ${product.product_name || "Unknown"}
      </option>
    `;
  });

  $("#productSelect").innerHTML = html;
};

// Get Data From API
const category = "en:chocolate";
const dashboardCategory = "Chocolate";

const getWorldProducts = async () => {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}&json=true&sort_by=additives_n&page_size=6`
    );
    const data = await res.json();
    const { count } = data;

    $("#totalProducts").innerHTML = abbreviateLongNumber(count);
  } catch (error) {
    console.log("error", error);
  }
};

getWorldProducts();

const getUkProducts = async () => {
  try {
    const res = await fetch(
      `https://uk.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}&json=true&sort_by=additives_n&page_size=6`
    );
    const data = await res.json();
    const { count } = data;

    $("#totalUkProducts").innerHTML = abbreviateLongNumber(count);
    $("#preloader").classList.remove("products-loading");
  } catch (error) {
    console.log("error", error);
  }
};

getUkProducts();

const getTopProducts = async () => {
  const res = await axios.get(
    `https://uk.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}&json=true&sort_by=additives_n&page_size=6`
  );

  const { data } = res;
  const { products } = data;

  topProducts = products;

  buildBarChart();
  createRadialBarSelect();
};

getTopProducts();

// Area Table Chart
const data2022 = [
  700000, 1400000, 300000, 2500000, 500000, 1200000, 400000, 1100000, 600000,
];
const data2021 = [
  500000, 1200000, 400000, 900000, 600000, 2300000, 360000, 1800000, 500000,
];

const areaTableOptions = {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        backgroundColor: colorPrimary,
        borderColor: colorPrimary,
        hoverBackgroundColor: colorPrimary,
        label: "",
        fill: true,
        data: data2022,
      },
    ],
  },
  options: {
    ...defaultOptions.options,
    elements: {
      point: {
        radius: 8,
        hoverRadius: 8,
        borderWidth: 0,
      },
    },
    plugins: {
      ...defaultOptions.options.plugins,
      tooltip: {
        ...defaultOptions.options.plugins.tooltip,
        multiKeyBackground: colorPrimary,
      },
    },
    tension: 0.3,
    scales: {
      x: {
        display: false,
      },
      y: {
        suggestedMax: 3500000,
        suggestedMin: 0,
        ticks: {
          font: {
            family: "Sora",
            size: 10,
          },
          callback: (value) => abbreviateLongNumber(value),
        },
        grid: {
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: colorBorder,
          borderColor: "transparent",
          borderDash: [5, 5],
          borderDashOffset: 2,
          tickColor: "transparent",
        },
      },
    },
  },
};

const [areaChartCtx, areaChart] = createChart(
  "areaTableChart",
  areaTableOptions
);

const gradient = areaChartCtx.createLinearGradient(0, 0, 0, 220);
gradient.addColorStop(0, colorChartShade0);
gradient.addColorStop(0.8, colorChartShade1);

areaChart.data.datasets[0].backgroundColor = gradient;
areaChart.update();

const selectYear = (element, year) => {
  // style the buttons
  const buttons = document.querySelectorAll(".card-header button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
  element.classList.add("active");

  // update chart data
  areaChart.data.datasets[0].data = year === 2022 ? data2022 : data2021;
  areaChart.update();
};

// Radial Bar Card

// Get paged table
let page = 1,
  pageCount = 0,
  pageSize = 3;

const gotoFirstPage = (element, newPage) => {
  element.disabled = true;
  getPagedTable(newPage);
};

const buildPagination = (newPage) => {
  const pagesToDisplay = 3;
  let start = 0;
  let end = pagesToDisplay;

  if (newPage - 1 > (pagesToDisplay - 1) / 2) {
    start = newPage - 1 - (pagesToDisplay - 1) / 2;
    end = start + pagesToDisplay;
  }

  if (newPage - 1 > pageCount - (pagesToDisplay + 1) / 2) {
    start = pageCount - pagesToDisplay;
    end = pageCount;
  }

  let html = "";

  html += `
    <button 
      ${newPage === 1 ? "disabled" : ""}
      onclick="gotoFirstPage(this, 1)"
      class="uil uil-previous"
    ></button>
  `;

  for (let i = start; i < end; i++) {
    html += `
      <button 
        type="button"
        class="${i + 1 === newPage ? "active" : ""}" 
        onclick="getPagedTable(${i + 1})">${i + 1}</button>
    `;
  }

  $("#pagination").innerHTML = html;
};

const getPagedTable = async (newPage = page) => {
  $("#pagedTable").classList.add("loading");
  $(".paged-table-spinner").classList.add("loading");

  const res = await axios.get(
    `https://uk.openfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=${category}&json=true&sort_by=additives_n&page_size=${pageSize}&page=${newPage}`
  );

  const { data } = res;
  const { products } = data;

  let html = "";

  products.forEach((product) => {
    html += `
      <tr>
        <td width="3rem">
          <img src="${
            product.image_front_small_url ||
            "../../shared-assets/images/placeholder.jpeg"
          }" />
        </td>
        <td width="200px">
          <span class="title">
            ${product.product_name || "Unknown"}
          </span>
          <span class="brand">
            ${product.brands || ""}
          </span>
        </td>
        <td>
          ${(product.nutriscore_data && product.nutriscore_data.energy) || "-"}
        </td>
      </tr>
    `;
  });

  pageCount = Math.ceil(data.count / pageSize);

  $(".paged-table-count").innerHTML = `
    Page ${newPage} of ${pageCount}
  `;

  buildPagination(newPage);

  $("#pagedTable").innerHTML = html;
  $("#pagedTable").classList.remove("loading");
  $(".paged-table-spinner").classList.remove("loading");
};

getPagedTable();

// Dark Mode Toggle
const toggleDarkMode = (element) => {
  if (!isDarkMode) {
    element.classList.add("uil-sun");
    element.classList.remove("uil-moon");
    $("html").setAttribute("data-dark-mode", "true");
    localStorage.setItem("js_dashboard_dark_mode", "true");
  } else {
    element.classList.add("uil-moon");
    element.classList.remove("uil-sun");
    $("html").setAttribute("data-dark-mode", "false");
    localStorage.setItem("js_dashboard_dark_mode", "false");
  }

  isDarkMode = !isDarkMode;

  // update area chart
  areaChart.options.scales.y.grid.color = getColorVariable("border");

  colorChartShade0 = getColorVariable("chart-shade-0");
  colorChartShade1 = getColorVariable("chart-shade-1");

  const newGradient = areaChartCtx.createLinearGradient(0, 0, 0, 220);
  newGradient.addColorStop(0, colorChartShade0);
  newGradient.addColorStop(0.8, colorChartShade1);

  areaChart.data.datasets[0].backgroundColor = newGradient;
  areaChart.update();

  // update radial bar chart
  radialBarChart.data.datasets[0].backgroundColor = [
    colorPrimary,
    getColorVariable("grey"),
  ];
  radialBarChart.data.datasets[0].hoverBackgroundColor = [
    colorPrimary,
    getColorVariable("grey"),
  ];
  radialBarChart.update("none");
};
