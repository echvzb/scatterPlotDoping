import getData from "./getData.js";

const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const render = (data) => {
  const title = "Doping in Professional Bicycle Racing";
  const labelAxisX = "";
  const labelAxisY = "Time in Minutes";
  const svg = d3.select("svg");
  const height = svg.attr("height");
  const width = svg.attr("width");
  const margin = {
    left: 110,
    right: 30,
    top: 80,
    bottom: 100,
  };
  const padding = {
    left: 15,
    bottom: 10,
  };
  const pointRadius = 7;
  const inner = {
    height: height - (margin.top + margin.bottom),
    width: width - (margin.left + margin.right),
  };
  const dataSet = data;

  const xValue = (d) => d.Year,
    yValue = (d) => d.Time;
  const changeColor = (d) => {
    if (d.Doping) return "doping point";
    return "no-doping point";
  };
  const tooltip = (d) => {
    return (
      d.Name +
      ": " +
      d.Nationality +
      "<br>Year: " +
      d3.timeFormat("%Y")(d.Year) +
      ", Time: " +
      d3.timeFormat("%M:%S")(d.Time) +
      "<br>" +
      d.Doping
    );
  };
  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataSet, (d) => xValue(d)))
    .range([0, inner.width]);
  const yScale = d3
    .scaleTime()
    .domain(d3.extent(dataSet, (d) => yValue(d)))
    .range([0, inner.height]);
  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSize(-(inner.height + padding.bottom))
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3
    .axisLeft(yScale)
    .ticks(7)
    .tickFormat(d3.timeFormat("%M:%S"))
    .tickSize(-(inner.width + padding.left));

  g.append("g")
    .call(yAxis)
    .attr("transform", `translate(${-padding.left},0)`)
    .append("text")
    .text(labelAxisY)
    .attr("fill", "#000")
    .attr("y", -50)
    .attr("x", 70 - inner.height / 2)
    .attr("transform", "rotate(270)")
    .attr("class", "info");
  g.append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${inner.height + padding.bottom})`);

  const info = g.append("g");
  const infoColorSize = 12;
  const offsetInfo = 50;
  const marginInfoText = 14;
  info
    .append("rect")
    .attr("class", "no-doping")
    .attr("width", infoColorSize)
    .attr("transform", `translate(0,${inner.height + padding.bottom + offsetInfo-infoColorSize})`)
    .attr("height", infoColorSize);
  info
    .append("text")
    .attr("transform", `translate(${marginInfoText},${inner.height + padding.bottom + offsetInfo})`)
    .text("No doping allegations")
    .attr("class", "info");
  info
    .append("rect")
    .attr("class", "doping")
    .attr("width", infoColorSize)
    .attr("height", infoColorSize)
    .attr(
      "transform",
      `translate(${inner.width / 2},${inner.height + padding.bottom + offsetInfo -infoColorSize})`
    );
  info
    .append("text")
    .attr(
      "transform",
      `translate(${inner.width / 2 + marginInfoText},${inner.height + padding.bottom + offsetInfo})`
    )
    .attr("class", "info")
    .text("Riders with doping allegations");

  const div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  svg
    .append("text")
    .text(title)
    .attr("class", "title")
    .attr("x", 44)
    .attr("y", 50);
  
  g.selectAll("circle")
    .data(dataSet)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("class", (d) => changeColor(d))
    .on("mouseover", (d) => {
      div.transition().duration(200).style("opacity", 0.9);
      div
        .html(tooltip(d))
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
    })
    .on("mouseout", (d) => {
      div.transition().duration(500).style("opacity", 0);
    })
    .transition().duration(1700)
      .attr("r", pointRadius);
    

};
const dateParseYear = d3.timeParse("%Y");
const dateParseTime = d3.timeParse("%M:%S");
getData(url)
  .then((data) => {
    data.forEach((d) => {
      d.Place = +d.Place;
      d.Seconds = +d.Seconds;
      d.Year = dateParseYear(d.Year);
      d.Time = dateParseTime(d.Time);
    });
    console.log(data);
    render(data);
  })
  .catch((err) => console.error(err));
