$(document).ready(function() {

	function draw(geo_data) {

		'use strict';
		var margin = 75,
			width = 1920-margin,
			height = 1080-margin;

		var svg = d3.select('body')
			.append('svg')
			.attr('width', width+margin)
			.attr('height', height+margin)
			.append('g')
			.attr('class', 'map');

		var projection = d3.geo.mercator()
							.scale(170)
							.translate([width/2, height/2]);
		var path = d3.geo.path().projection(projection);

		var map = svg.selectAll('path')
					.data(geo_data.features)
					.enter()
					.append('path')
					.attr('d', path)
					.style('fill', 'rgb(9, 157, 217)')
					.style('stroke', 'black')
					.style('stroke-width', 0.5);


		function plot_points(data) {
			// draw circles 
			var nested = d3.nest()
							.key(function(d) { // grouping
								return d['date'].getUTCFullYear();
							})
							.rollup(function(leaves) { // aggregation
								var total = d3.sum(leaves, function(d) {
									return d['attendance'];
								});

								var coords = leaves.map(function(d) {
									return projection([+d.long, +d.lat]);
								});

								var center_x = d3.mean(coords, function(d) {
									return d[0];
								});

								var center_y = d3.mean(coords, function(d) {
									return d[1];
								});

								return {
									'attendance': total,
									'x': center_x,
									'y': center_y
								}
							}) 
							.entries(data);

			svg.append('g')
			  .attr('class', 'bubble')
			  .selectAll('circle')
			  .data(nested)
			  .enter()
			  .append('circle')
			  .attr('cx', function(d) { return d.values['x']; })
			  .attr('cy', function(d) { return d.values['y']; })
			  .attr('r', 5);

		};

		var format = d3.time.format('%d-%m-%Y (%H:%M h)');

		d3.tsv('dataset/world_cup_geo.tsv', function(d) {
			d['attendance'] = +d['attendance'];
			d['date'] = format.parse(d['date']);
			return d;
		}, plot_points);

	};



	d3.json('dataset/world_countries.json', draw);
});