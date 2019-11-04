var svgWidth = 960;
var svgHeight = 500;

var margin ={
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var file = "https://raw.githubusercontent.com/Axioma42/D3-challenge/master/assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

function errorHandle(error){
    throw err;
}

function successHandle(healthData){

    console.log(healthData);

    healthData.forEach(function(data){
        data.poverty = parseFloat(data.poverty);
        data.obesity = parseFloat(data.obesity);
    });

    var xLinearScale = d3.scaleLinear()
        .domain([8, d3.max(healthData, d => d.poverty)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([20, d3.max(healthData, d => d.obesity)])
        .range([height, 0]);

    var bottomAxis = d3. axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "15")
    .attr("opacity", ".5")
    .classed("stateCircle", true);
    
    var circlesText = chartGroup.selectAll("text.stateText")
    .data(healthData)
    .enter()
    .append("text")
    .classed("stateText", true)
    .text(function(d){return d.abbr})
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity));

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .html(function(d) {
            return(`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}%`);});
        

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data){
        toolTip.show(data, event.target)
            .direction("nw");
    }).on("mouseout", function(data, index){
        toolTip.hide(data, event.target);
    });

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("class", "aText")
        .text("Obesity (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "aText")
        .text("Poverty (%)");
   
}