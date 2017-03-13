$(document).ready(function(){


	function draw(data) {

		'use strict';
		var margin = 70,
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


		var max_scholarship = d3.max(nested, function(d) {
			return d.values['sc_total'];
		});


		
		var scholarship_scale = d3.scale.linear()
			.range([height/2, margin])
			.domain([0, max_scholarship]);

		var scholarship_axis = d3.svg.axis()
			.scale(scholarship_scale)
			.tickValues([0, max_scholarship/2, max_scholarship])
			.orient('left');

		var svg = d3.select('svg');

		svg.selectAll('years')
			.data(nested)
			.enter()
			.append('g')
				.attr('class', 'years')
				.attr('transform', function(d, i) {
					return 'translate('+(margin + i*50)+',0)';
				})
			.append('g')
				.attr('class', 'y axis')
				.each(function(d) {
					d3.select(this).call(scholarship_axis);
				});
	};


	d3.dsv(';')('data/prouni_filter.csv', function(d){
		d['ANO_CONCESSAO_BOLSA'] = +d['ANO_CONCESSAO_BOLSA'];
		return d;
	}, draw);



});