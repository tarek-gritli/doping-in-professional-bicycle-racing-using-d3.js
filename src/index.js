const url="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
const w=900;
const h=500;
const padding=50;
d3.select("main")
  .append("h1")
  .attr("id","title")
  .text("Doping in Professional Bicycle Racing")
fetch(url)
.then(response=>response.json())
.then(data =>{
    const years=[];
    const seconds=[];
    data.map((obj)=>{
        years.push(obj.Year);
        seconds.push(obj.Seconds);
    });
    const tooltip=d3.select("main")
                    .append("div")
                    .attr("id", "tooltip");
    const xScale=d3.scaleLinear()
                   .domain([d3.min(years)-1,d3.max(years)])
                   .range([padding,w-padding]);
    const yScale=d3.scaleTime()
                   .domain([d3.min(seconds,s=>new Date(s*1000)),d3.max(seconds,s=>new Date(s*1000))])
                   .range([padding,h-padding]);
    const xAxis=d3.axisBottom(xScale)
                  .tickFormat(d3.format('d')); //format as integer
    const yAxis=d3.axisLeft(yScale)
                  .tickFormat(d3.timeFormat("%M:%S"));
    let svg=d3.select("main")
              .append("svg")
              .attr("class","graph")
              .attr("width",w)
              .attr("height",h);
    svg.append("g")
       .attr("transform","translate(0,"+(h-padding)+")")
       .attr("id","x-axis")
       .call(xAxis);
    svg.append("g")
       .attr("transform","translate("+padding+",0)")
       .attr("id","y-axis")
       .call(yAxis);
    const handleMouseOut = ()=>{
        return d3.select("#tooltip")
                 .style("opacity",0)
    }
    const handleMouseOver = (d)=>{
        const doping= d.Doping!="" ? "<br><br>"+d.Doping : "";
        return d3.select("#tooltip")
                 .attr("data-year",d.Year)
                 .html(d.Name+": "+d.Nationality+"<br>Year: "+d.Year+", Time: "+d.Time+doping)
                 .style("opacity",0.9)
                 .style("left",(d3.event.pageX+5)+"px")
                 .style("top",(d3.event.pageY)+"px");
    }
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("class","dot")
       .attr("cx",(d,i)=>xScale(d.Year))
       .attr("cy",d=>yScale(d.Seconds*1000))
       .attr("r",5)
       .attr("data-xvalue",d=>d.Year)
       .attr("data-yvalue",(d)=>new Date(d.Seconds*1000))
       .style("fill",(d)=>d.Doping=="" ? "darkseagreen" : "crimson")
       .on("mouseover",handleMouseOver)
       .on("mouseout",handleMouseOut);
    const legend = svg.append("g")
                      .attr("id", "legend")
                      .attr("transform", "translate(" + (w - 200) + "," + (h / 2 - 50) + ")");
    legend.append("rect")
          .attr("class", "normal")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", "darkseagreen");
    
    legend.append("text")
          .attr("x", 30)
          .attr("y", 15)
          .text("No doping allegations")
          .style("font-size","12px");

    legend.append("rect")
          .attr("class", "doping")
          .attr("y",25)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", "crimson");

    legend.append("text")
          .attr("x", 30)
          .attr("y", 35)
          .text("Riders with doping allegations")
          .style("font-size","12px");
});