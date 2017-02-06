$(document).ready(function() {

	function draw(data) {

		var margin = {top: 20, right: 30, bottom: 30, left: 40}, 
			width = 960 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;


		d3.select('body').append('h2').text('Average World\'s Temperatures from 1880 to 2014');

		var svg = d3.select('body')
		  .append('svg')
		  	.attr('width', width+margin.left)
		  	.attr('height', height+margin.bottom)
		  .append('g')
		  	.attr('class', 'chart');


		var chart = new dimple.chart(svg, data);
		var x = chart.addCategoryAxis('x', ['Description', 'Year']);
		x.addGroupOrderRule("Year");		
		chart.addMeasureAxis('y', 'Temperature');
		var s = chart.addSeries('Description', dimple.plot.line);
		s.barGap = 0.05;
		
		chart.draw();



	};



	d3.tsv('data/world_temperatures2.tsv', draw);


});