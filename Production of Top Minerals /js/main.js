// function to parse date strings into date objects
const parseTime = d3.timeParse("%Y-%m-%d");

// list of mineral categories to visualize
const mineralCategories = ["Lithium", "Nickel", "Cobalt", "Graphite", "Rare Earths"];

// global variables to store data and chart instances
let data, charts = {}, selectedContinents = new Set();

// color mapping for continents
const continentColor = {
  "Asia": "#1f77b4",
  "North America": "#ff7f0e", 
  "South America": "#2ca02c", 
  "Europe": "#d62728", 
  "Africa": "#9467bd", 
  "Oceania": "#8c564b"
};

// load data from CSV file and render charts
// converts production and reserves values to numbers
// initializes the legend and charts dynamically

d3.csv('data/minerals.csv').then(_data => {
  data = _data;
  data.forEach(d => {
      d.Production = +d.Production;
      d.Reserves = +d.Reserves;
  });

  // create legend container for continent filtering
  const legendContainer = d3.select(".container")
        .insert("div", "h2 + *")  // place after title
        .attr("class", "legend");

  // extract unique minerals and sort alphabetically
  const uniqueMinerals = [...new Set(data.map(d => d.Mineral))].sort();

  // extract unique continents and initialize filtering set
  const uniqueContinents = [...new Set(data.map(d => d.Continent))];
  selectedContinents = new Set(uniqueContinents); 

  // create interactive legend for filtering continents
  const legendItems = legendContainer.selectAll(".legend-item")
      .data(uniqueContinents)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("cursor", "pointer")
      .on("click", function (event, continent) {
          if (selectedContinents.has(continent)) {
              selectedContinents.delete(continent);
          } else {
              selectedContinents.add(continent);
          }
          if (selectedContinents.size === 0) {
              selectedContinents = new Set(uniqueContinents); // reset if empty
          }
          updateCharts();
      });

  // add color boxes to legend
  legendItems.append("div")
      .attr("class", "legend-color")
      .style("width", "15px")
      .style("height", "15px")
      .style("margin-right", "5px")
      .style("border-radius", "3px")
      .style("background-color", d => getContinentColor(d));

  // add continent labels to legend
  legendItems.append("span")
      .attr("class", "legend-text")
      .style("font-size", "14px")
      .text(d => d);

  // create chart containers for each mineral type
  uniqueMinerals.forEach(mineral => {
      const containerId = `${mineral.toLowerCase()}-vis`;

      d3.select(".container")
          .append("div")
          .attr("id", containerId)
          .attr("class", "chart-container");

      // create chart instances for each mineral
      charts[mineral] = new Chart({
          parentElement: `#${containerId}`,
          mineralType: mineral
      }, getFilteredData(mineral));
  });

}).catch(error => console.error("Error loading CSV:", error));

// function to filter data based on selected continents
function getFilteredData(mineral) {
    return data.filter(d => d.Mineral === mineral && selectedContinents.has(d.Continent));
}

// function to update charts when legend is clicked
function updateCharts() {
    Object.keys(charts).forEach(mineral => {
        charts[mineral].data = getFilteredData(mineral);
        charts[mineral].updateVis();
    });

    // update legend appearance to reflect selection
    d3.selectAll(".legend-item")
        .style("opacity", d => selectedContinents.has(d) ? 1 : 0.4);
    
    d3.selectAll(".legend-text")
        .style("color", d => selectedContinents.has(d) ? "black" : "gray");

    d3.selectAll(".legend-color").style("background-color", d=> getContinentColor(d));
}

// function to get color based on continent, defaulting to grey if not found
function getContinentColor(continent) {
    return continentColor[continent] || "#999999";
}
