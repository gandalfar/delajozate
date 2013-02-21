/* glasovanje.html - rezultat glasovanja */

/* pie chart modified from http://bl.ocks.org/enjalot/1203641 */


function d3_glasovanje_piechart(url, selector, width, height) {
    var r = 100,
        color = d3.scale.category10();
    
    d3.json(url, function(json){
        data = json.summary;

        var svg = d3.select(selector)
                    .append('svg:svg')
                    .data([data])
                        .attr("width", width)
                        .attr("width", height)
                    .append("svg:g")
                        .attr("transform", "translate(" + r + "," + r + ")")

        var arc = d3.svg.arc() 
                    .outerRadius(r);

        var pie = d3.layout.pie()
                    .value(function(d) { 
                        return d.count;
                    });

        var arcs = svg.selectAll("g.slice")
                    .data(pie)
                    .enter()
                        .append("svg:g")
                            .attr("class", "slice");

                    arcs.append("svg:path")
                        .attr("fill", function(d, i) { return color(i); } )
                        .attr("d", arc);

                    arcs.append("svg:text") 
                        .attr("transform", function(d) { 
                            d.innerRadius = 0;
                            d.outerRadius = r;
                            return "translate(" + arc.centroid(d) + ")"; 
                        })
                        .attr("text-anchor", "middle")
                        .text(function(d, i) {
                            if (data[i].count > 3) { return data[i].count }
                            return '';
                        });

        var legend = d3.select(selector).append("svg")
              .attr("class", "legend")
              .attr("width", r * 2)
              .attr("height", r * 2)
            .selectAll("g")
              .data(color.domain().slice().reverse())
            .enter().append("g")
              .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", color);

            legend.append("text")
              .attr("x", 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .text(function(d,i) { return data[i].label; });
    });
}

if (d3.select('.vote-summary-graph').length > 0) {
    d3_glasovanje_piechart(document.location.href+'ajax/', '.vote-summary-graph', 200, 200);
}