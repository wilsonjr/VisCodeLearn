$(document).ready(function() {

	function draw(data) {

		'use strict';
		var margin = 75, 
			width = 1400-margin, 
			height = 600-margin;

		var radius = 3;
		var color = 'blue';
		var multiplier = 1.5;

		var svg = d3.select('body')
		  .append('svg')
		  	.attr('width', width+margin)
		  	.attr('height', height+margin)
		  .append('g')
		  	.attr('class', 'chart');


		d3.select('svg')
		  .selectAll('circle')
		  .data(data)
		  .enter()
		  .append('circle');


		var time_extent = d3.extent(data, function(d) {
			return d['date'];
		});

		var count_extent = d3.extent(data, function(d) {
			return d['attendance'];
		});

		var time_scale = d3.time.scale()
		  .range([margin, width])
		  .domain(time_extent);

		var count_scale = d3.scale.linear()
		  .range([height, margin])
		  .domain(count_extent);

		var time_axis = d3.svg.axis()
		  .scale(time_scale)
		  .ticks(d3.time.years, 2);

		var count_axis = d3.svg.axis()
		  .scale(count_scale)
		  .orient('left');

		d3.select('svg')
		  .append('g')
		  .attr('class', 'x axis')
		  .attr('transform', 'translate(0,'+height+')')
		  .call(time_axis);

		d3.select('svg')
		  .append('g')
		  .attr('class', 'y axis')
		  .attr('transform', 'translate('+margin+',0)')
		  .call(count_axis);

		d3.selectAll('circle')
		  .attr('cx', function(d) {
		  	  return time_scale(d['date']);
		  })
		  .attr('cy', function(d) {
		  	  return count_scale(d['attendance']);
		  })
		  .attr('r', function(d) {
		  	  return radius;
		  })
		  .attr('fill', function(d) {
		  	  return 'blue';
		  });


	}


	var format = d3.time.format('%d-%m-%Y (%H:%M h)');
	d3.tsv('data/world_cup_geo.tsv', function(d) {
		d['date'] = format.parse(d['date']);
		d['attendance'] = +d['attendance'];
		return d;
	}, draw);

});