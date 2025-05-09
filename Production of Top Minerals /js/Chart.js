class Chart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 900,
      containerHeight: 350,
      margin: {top: 90, right: 20, bottom: 50, left: 100},
      legendWidth: 170,
      legendHeight: 8,
      legendRadius: 5,
      mineralType: _config.mineralType
    };
    this.data = _data;
    this.selectedContinents = [];
    this.initVis();
  }
  // initializes the visualization, scales, and svg elements
  initVis() {
    let vis = this;

    // Calculate chart width and height
    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    // Define scales for x-axis, size, and color mapping
    vis.xScale = d3.scaleBand().range([0, vis.width]).padding(0.3);
    vis.radiusScale = d3.scaleSqrt().range([4, 80]);
    vis.colorScale = d3.scaleOrdinal().domain(["Asia", "North America", "South America", "Europe", "Africa", "Oceania"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"]);

    // create svg container
    vis.svg = d3.select(vis.config.parentElement).append('svg')
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight);

    // create chart area inside svg
    vis.chartArea = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);
    
    // Append dynamic title label based on mineral type
    vis.chartArea.append('text')
    .attr('x', vis.width / 2)
    .attr('y', -30)
    .attr('text-anchor', 'middle')
    .attr('font-size', '15px')
    .attr('font-weight', 'bold')
    .text(`${vis.config.mineralType} Production & Reserves (Thousands of Tonnes)`);

    vis.updateVis();
  }

  // updates the visualization when data or filters change
  updateVis() {
    let vis = this;

    // Filter data based on selected continents
    let filteredData = vis.selectedContinents.length > 0 ?
        vis.data.filter(d => vis.selectedContinents.includes(d.Continent)) :
        vis.data;
    
    // Sort data by production value and extract country names in sorted order
    let sortedData = filteredData.sort((a, b) => b.Production - a.Production);
    let countries = [...new Set(sortedData.map(d => d.Country))];
    
    // Set domain for x scale and radius scale
    vis.xScale.domain(countries);
    let maxProduction = d3.max(filteredData, d => d.Production);
    let maxReserves = d3.max(filteredData, d => d.Reserves);
    vis.radiusScale.domain([0, Math.max(maxProduction, maxReserves)]);

    vis.renderVis(filteredData);
}
   // initializes the legend for continent filtering and chart interaction
  initLegend() {
    let vis = this;

    // List of unique continents
    vis.continents = [...new Set(vis.data.map(d => d.Continent))];

    // Create a legend container
    vis.legend = d3.select(vis.config.parentElement)
        .append("div")
        .attr("class", "legend");

    // Add legend items
    let legendItems = vis.legend.selectAll(".legend-item")
        .data(vis.continents)
        .enter()
        .append("div")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("cursor", "pointer")
        .on("click", function(event, d) {
            // Toggle active state
            if (vis.selectedContinents.includes(d)) {
                vis.selectedContinents = vis.selectedContinents.filter(c => c !== d);
            } else {
                vis.selectedContinents.push(d);
            }

            // If no continents are active, reset to show all
            if (vis.selectedContinents.length === 0) {
                vis.selectedContinents = [...vis.continents];
            }

            // Update legend appearance
            vis.updateLegend();
            vis.updateVis();
        });

    // Add color squares
    legendItems.append("div")
        .attr("class", "legend-color")
        .style("width", "15px")
        .style("height", "15px")
        .style("margin-right", "5px")
        .style("background-color", d => vis.colorScale(d));

    // Add text labels
    legendItems.append("span")
        .attr("class", "legend-text")
        .style("font-size", "12px")
        .text(d => d);

    // Initial legend update
    vis.updateLegend();
}

  updateLegend() {
      let vis = this;
      
      vis.legend.selectAll(".legend-item")
          .style("opacity", d => vis.selectedContinents.includes(d) ? 1 : 0.4);

      vis.legend.selectAll(".legend-text")
          .style("color", d => vis.selectedContinents.includes(d) ? "black" : "gray");
}

  // renders the visualization using the filtered and sorted data
  renderVis(data) {
    let vis = this;

    let countries = vis.chartArea.selectAll('.country-group')
        .data(data, d => d.Country);

    let countryEnter = countries.enter().append('g')
        .attr('class', 'country-group')
        .attr('transform', d => `translate(${vis.xScale(d.Country)}, ${vis.height / 2})`);

    // Add a light grey background if country is "Canada"
    countryEnter.append('rect')
        .attr('class', 'highlight-box')
        .attr('x', -30)
        .attr('y', -50)
        .attr('width', 60)
        .attr('height', 170)
        .attr('fill', '#eeeeee')
        .attr('opacity', d => d.Country === 'Canada' ? 1 : 0); // Only visible for Canada

    // Connecting line between production and reserves
    countryEnter.append('line')
        .attr('x1', 0).attr('y1', -40)
        .attr('x2', 0).attr('y2', 40)
        .attr('stroke', '#333').attr('stroke-width', 1);

    // Production semicircle (top)
    countryEnter.append('path')
        .attr('d', d => {
            if (!d.Production || isNaN(d.Production)) return null;
            return d3.arc()
                .outerRadius(vis.radiusScale(d.Production))
                .innerRadius(0)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2)();
        })
        .attr('fill', d => vis.colorScale(d.Continent))
        .attr('stroke', '#333')
        .attr('transform', `translate(0, 40)`);

    // Reserves semicircle (bottom)
    countryEnter.append('path')
        .attr('d', d => {
            if (!d.Reserves || isNaN(d.Reserves)) return null;
            return d3.arc()
                .outerRadius(vis.radiusScale(d.Reserves))
                .innerRadius(0)
                .startAngle(Math.PI / 2)
                .endAngle(3 * Math.PI / 2)();
        })
        .attr('fill', d => vis.colorScale(d.Continent))
        .attr('opacity', 0.4)
        .attr('stroke', '#333')
        .attr('transform', `translate(0, 40)`);

    // Country labels
    countryEnter.append('text')
        .attr('x', 0)
        .attr('y', -vis.radiusScale(d3.max(data, d => d.Production)) - 60)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(d => d.Country);

    // Production values
    countryEnter.append('text')
        .attr('x', 0)
        .attr('y', -vis.radiusScale(d3.max(data, d => d.Production)) - 40)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#000')
        .text(d => isNaN(d.Production) || d.Production === "N/A" ? "N/A" : d3.format(",.0f")(d.Production / 1000));

    // Reserves values
    countryEnter.append('text')
        .attr('x',4)
        .attr('y', vis.radiusScale(d3.max(data, d => d.Reserves)) + 55)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', 'bold')
        .attr('fill', '#000')
        .text(d => isNaN(d.Reserves) || d.Reserves === "N/A" ? "N/A" : d3.format(",.0f")(d.Reserves / 1000));


    // Create tooltip
    let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("display", "none")
    .style("background", "#fff")
    .style("border", "1px solid #ddd")
    .style("padding", "8px")
    .style("font-size", "12px")
    .style("pointer-events", "none");

    // Add interaction
    countryEnter.selectAll("path")
    .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
            .html(`
                <strong>${d.Country}</strong><br>
                Production: ${d3.format(",")(d.Production)} tonnes<br>
                Reserves: ${d3.format(",")(d.Reserves)} tonnes
            `)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px");
    })
    .on("mouseout", () => {
        tooltip.style("display", "none");
    });

    countries.exit().remove();
  }
}
