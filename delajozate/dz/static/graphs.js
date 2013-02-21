/* glasovanje.html - rezultat glasovanja */

/* pie chart modified from http://bl.ocks.org/enjalot/1203641 */
var width = 300,
    height = 300,
    r = 100,
    color = d3.scale.category20c();

var svg = d3.select('.votesummary-graph')
            .append('svg:svg')
            .data([data.voting_result])
                .attr("width", width)
                .attr("width", height)
            .append("svg:g")
                .attr("transform", "translate(" + r + "," + r + ")")

var arc = d3.svg.arc() 
            .outerRadius(r);
var keys = ['majority', 'minority', 'abstained', 'absent'];

var pie = d3.layout.pie()
            .value(function(d) { 
                if (keys.indexOf(d.label) !== -1) { return d.count; } 
                return null;
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
                    var obj = data.voting_result[i];
                    if (keys.indexOf(obj.label) !== -1 && obj.count > 5) { 
                        return obj.label; 
                    }
                    
                    return '';
                });


