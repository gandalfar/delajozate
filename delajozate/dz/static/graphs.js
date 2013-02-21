/* glasovanje.html - rezultat glasovanja */

/* pie chart modified from http://bl.ocks.org/enjalot/1203641 */


function d3_glasovanje_piechart(url, selector, width, height) {
    var r = 100,
        color = d3.scale.category10();
    
    d3.json(url, function(json){
        data = json.summary;

        var svg = d3.select('.votesummary-graph')
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
                            return data[i].label
                        });
    });
}

if (d3.select('.votesummary-graph').length > 0) {
    var el = d3.select('.votesummary-graph')
    d3_glasovanje_piechart(document.location.href+'ajax/', '.votesummary-graph', 200, 200);
}