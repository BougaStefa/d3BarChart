const width = 800,
  height = 400,
  barWidth = width / 275;
//tooltip, starts invisible
const tooltip = d3
  .select(".chartContainer")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const svgContainer = d3
  .select(".chartContainer")
  .append("svg")
  .attr("width", width + 100)
  .attr("height", height + 60);

d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
)
  .then((data) => {
    // Y Axis positioning
    svgContainer
      .append("text")
      .attr("x", -200)
      .attr("y", 80)
      .attr("transform", "rotate(-90)")
      .text("Gross Domestic Product");
    //X Axis footer
    svgContainer
      .append("text")
      .attr("x", width / 2 + 80)
      .attr("y", height + 55)
      .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");
    // Y AXIS SCALING
    const GDP = data.data.map(function (i) {
      return i[1];
    });

    const maxGDP = d3.max(GDP);

    let linearScale = d3.scaleLinear().domain([0, maxGDP]).range([0, height]);
    let scaledGDP = GDP.map(function (i) {
      return linearScale(i);
    });

    let yScale = d3.scaleLinear().domain([0, maxGDP]).range([height, 0]);

    const yAxis = d3.axisLeft(yScale);

    svgContainer
      .append("g")
      .call(yAxis)
      .attr("transform", `translate(60,0)`)
      .attr("id", "y-axis");

    // X AXIS SCALING
    const dateObjects = data.data.map(function (i) {
      return new Date(i[0]);
    });

    const maxDate = new Date(d3.max(dateObjects));
    maxDate.setMonth(maxDate.getMonth() + 3);

    console.log(maxDate);

    const xScale = d3
      .scaleTime()
      .domain([d3.min(dateObjects), maxDate])
      .range([0, width]);

    const xAxis = d3.axisBottom(xScale);

    svgContainer
      .append("g")
      .call(xAxis)
      .attr("transform", `translate(60,400)`)
      .attr("id", "x-axis");

    d3.select("svg")
      .selectAll("rect")
      .data(scaledGDP)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("index", (d, i) => i)
      .attr("width", barWidth)
      .attr("height", function (d) {
        return d;
      })
      .attr("x", function (d, i) {
        return xScale(dateObjects[i]);
      })
      .attr("y", function (d, i) {
        return height - d;
      })
      .attr("fill", "#508D4E")
      .attr("transform", "translate(60,0)")
      .attr("data-date", function (d, i) {
        return data.data[i][0];
      })
      .attr("data-gdp", function (d, i) {
        return data.data[i][1];
      })
      .on("mouseover", function (d, event) {
        let i = this.getAttribute("index");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`${data.data[i][0]} <br> $${GDP[i]} Billion`);
        tooltip
          .style("left", i * barWidth + 30 + "px")
          .style("top", height - 100 + "px")
          .style("transform", "translateX(60px)");
        tooltip.attr("data-date", data.data[i][0]);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(200).style("opacity", 0);
      });
  })
  .catch((e) => console.log(e));
