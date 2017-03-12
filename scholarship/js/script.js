$(document).ready(function(){


	function draw(data) {

		'use strict';
		var margin = 50,
			width = 960-margin,
			height = 500-margin;

		d3.select('body')
			.append('svg')
			.attr('width', width+margin)
			.attr('height', height+margin);

		var svg = d3.select('svg')
			.append('g')
				.class('class', 'chart');



	}





	d3.dsv(';')('data/prouni_filter.csv', function(d){
		d['ANO_CONCESSAO_BOLSA'] = +d['ANO_CONCESSAO_BOLSA'];
		return d;
	}, draw);



});