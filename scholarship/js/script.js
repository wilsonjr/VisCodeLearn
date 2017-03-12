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
				.attr('class', 'chart');


		function agg_year(leaves) {

			var norte = leaves.filter(function(d) { 
				return d['REGIAO_BENEFICIARIO_BOLSA'] == 'NORTE';
			}).length;

			var nordeste = leaves.filter(function(d) {
				return d['REGIAO_BENEFICIARIO_BOLSA'] == 'NORDESTE';
			}).length;

			var centro = leaves.filter(function(d) {
				return d['REGIAO_BENEFICIARIO_BOLSA'] == 'CENTRO-OESTE';
			}).length;

			var sudeste = leaves.filter(function(d) {
				return d['REGIAO_BENEFICIARIO_BOLSA'] == 'SUDESTE';
			}).length;

			var sul = leaves.filter(function(d) {
				return d['REGIAO_BENEFICIARIO_BOLSA'] == 'SUL';
			}).length;


			return {
				'sc_total': norte+nordeste+centro+sudeste+sul,
				'sc_norte': norte,
				'sc_nordeste': nordeste,
				'sc_centro': centro,
				'sc_sudeste': sudeste,
				'sc_sul': sul
			};
		};


		var nested = d3.nest()
			.key(function(d) {
				return d['ANO_CONCESSAO_BOLSA'];
			})
			.rollup(agg_year)
			.entries(data);


	};


	d3.dsv(';')('data/prouni_filter.csv', function(d){
		d['ANO_CONCESSAO_BOLSA'] = +d['ANO_CONCESSAO_BOLSA'];
		return d;
	}, draw);



});