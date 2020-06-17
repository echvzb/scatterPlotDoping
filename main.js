import getData from './getData.js'

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

const render = data => {
    const title = 'United States GDP'
    const svg = d3.select('svg');
    const height = svg.attr('height');
    const width = svg.attr('width');
    const margin = {
        left: 110,
        right: 30,
        top: 100,
        bottom: 90
    };
    const inner={
        height: height -(margin.top+margin.bottom),
        width: width -(margin.left+margin.right)
    }
    const dataSet = data.data;

    const xValue = d => d[0], yValue = d => d[1];

    const maxValue = d3.max(dataSet, d => yValue(d));

    const xScale = d3.scaleTime()
        .domain([d3.min(dataSet, d=> xValue(d)),d3.max(dataSet, d=> xValue(d))])
        .range([0,inner.width])
    const yScale = d3.scaleLinear()
        .domain([0,maxValue])
        .range([inner.height,0]);
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-inner.width);

    g.append('g').call(yAxis).append('text')
        .text('Gross Domestic Product')
        .attr('fill','#000')
        .attr('y',-70)
        .attr('x', 80-inner.height/2)
        .attr('transform','rotate(270)')
        .attr('class','info');
    g.append('g').call(xAxis)
        .attr('transform', `translate(0,${inner.height})`).append('text')
            .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
            .attr('fill','black')
            .attr('x',inner.width-200)
            .attr('y',60)
            .attr('class','info');

    const div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    g.selectAll('rect').data(dataSet)
        .enter().append('rect')
            .attr('x', d => xScale(xValue(d)))
            .attr('width', inner.width/dataSet.length)
            .attr('height', d => inner.height-yScale(yValue(d)))
            .attr('y', d => yScale(yValue(d)))
            .attr('class', 'bar')
            .on('mouseover', d=>{
                div.transition()
                    .duration(200)
                    .style('opacity', 0.9);
                div.html('<strong>'+d3.timeFormat('%Y')(xValue(d))+'</strong><br>$'+yValue(d).toLocaleString('en')+' Billion')
                    .style('left', (d3.event.pageX)+'px')
                    .style('top', (d3.event.pageY)+'px');
            })
            .on('mouseout', d=>{
                div.transition()
                    .duration(500)
                    .style('opacity',0)
            })
    
    svg.append('text')
        .text(title)
        .attr('class','title')
        .attr('x', 44)
        .attr('y', 50);
}
const dateParse = d3.timeParse('%Y-%m-%d');
getData(url).then(data =>{
    data.data.forEach(d =>{
        d[0] = dateParse(d[0])
        d[1] = +d[1];
    })
    render(data);
}).catch(err => console.error(err));