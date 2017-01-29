$(document).ready(function(){

	function draw(data) {

		var margin = 80,
              width = 1300 - margin,
              height = 500 - margin;


		d3.select('body').append('h2').text('Average Monthly Temperatures in 2003');

		var svg = d3.select("body")
		  .append("svg")
		    .attr("width", width + margin)
		    .attr("height", height + margin)
		  .append('g')
		    .attr('class','chart');


		var chart = new dimple.chart(svg, data);
		var x = chart.addCategoryAxis('x', 'month');
		chart.addMeasureAxis('y', 'fahrenheit');
		chart.addSeries('legend', dimple.plot.line);
        chart.addSeries('legend', dimple.plot.scatter);
        chart.addLegend(width-550, 0, 500, 20, 'right');
		chart.draw();
		
	};

	d3.tsv('data/temperature.tsv', draw);

});