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
			
			function agg_year(leaves) {

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

				var teams = d3.set();

				leaves.forEach(function(d) {
					teams.add(d['team1']);
					teams.add(d['team2']);
				});

				return {
					'attendance': total,
					'x': center_x,
					'y': center_y,
					'teams': teams.values()
				};

			};

			var nested = d3.nest()
							.key(function(d) { // grouping
								return d['date'].getUTCFullYear();
							})
							.rollup(agg_year) 
							.entries(data);

			var attendance_extent = d3.extent(nested, function(d) {
				return d.values['attendance'];
			});

			var radius = d3.scale.sqrt().domain(attendance_extent).range([0, 12]);

			function key_func(d) {
				return d['key'];
			};

			svg.append('g')
			  .attr('class', 'bubble')
			  .selectAll('circle')
			  .data(nested.sort(function(a, b) {
			  	  return b.values['attendance'] - a.values['attendance'];
			  }), key_func)
			  .enter()
			  .append('circle')
			  .attr('cx', function(d) { return d.values['x']; })
			  .attr('cy', function(d) { return d.values['y']; })
			  .attr('r', function(d) { return radius(d.values['attendance']); });

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