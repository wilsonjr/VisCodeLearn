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
					.style('fill', 'rgb(9, 157, 217)');

	};



	d3.json('dataset/world_countries.json', draw);
});