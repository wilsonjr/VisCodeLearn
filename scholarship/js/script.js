$(document).ready(function(){


	function draw(data) {

		'use strict';
		var margin = 20,
			width = 960-margin,
			height = 500-margin;

		var margins = {};
		margins['COUNTRY'] = {x: width/2 - 100, y: 0};
		margins['NORTE'] = {x: 50, y: 200};
		margins['NORDESTE'] = {x: 230, y: 200};
		margins['CENTRO-OESTE'] = {x: 410, y: 200};
		margins['SUDESTE'] = {x: 580, y: 200};
		margins['SUL'] = {x: 760, y: 200};

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
				'description': 'COUNTRY',
				'total': norte+nordeste+centro+sudeste+sul,
				'norte': norte,
				'nordeste': nordeste,
				'centro': centro,
				'sudeste': sudeste,
				'sul': sul
			};
		};

		function agg_region(leaves) {

			var years = new Set(leaves.map(function(d) {
				return d['ANO_CONCESSAO_BOLSA'];
			}));

			var region_scholarship = {};
			var max = -1;
			for( let item of years ) {
				region_scholarship[item] = leaves.filter(function(d) {
					return d['ANO_CONCESSAO_BOLSA'] == item;
				}).length;
				if( region_scholarship[item] > max )
					max = region_scholarship[item];
			}


			region_scholarship['description'] = leaves[0]['REGIAO_BENEFICIARIO_BOLSA'];
			region_scholarship['max'] = max;

			return region_scholarship; 
		};


		var nested = d3.nest()
			.key(function(d) {
				return d['ANO_CONCESSAO_BOLSA'];
			})
			.rollup(agg_year)
			.entries(data);

		var min_year = d3.min(nested, function(d) {
			return d.key;
		});

		var max_year = d3.max(nested, function(d) {
			return d.key;
		});

		var max_scholarship = d3.max(nested, function(d) {
			return d.values['total'];
		});

		var radius = d3.scale.sqrt().domain([0, max_scholarship]).range([0, 5]);
		
		var scholarship_scale = d3.scale.linear()
			.domain([0, max_scholarship])			
			.range([height/2.5, margin]);

		var scholarship_axis = d3.svg.axis()
			.scale(scholarship_scale)
			.tickValues([0,  max_scholarship/2, max_scholarship])
			.orient('left')
			.outerTickSize(0);

		var svg = d3.select('svg');

		svg.selectAll('years')
			.data(nested)
			.enter()
			.append('g')
				.attr('class', 'years')
				.attr('transform', function(d, i) {
					return 'translate('+(margins[d.values['description']].x + i*50)+',0)';
				})
			.append('g')
				.attr('class', 'y axis')
				.each(function(d) {
					d3.select(this).call(scholarship_axis);
				});

		svg.selectAll('circle')
			.data(nested)
			.enter()
			.append('circle')
				.attr('cy', function(d) {
					return scholarship_scale(d.values['total']);
				})	
				.attr('cx', function(d, i) {
					return (margins[d.values['description']].x + i*50);
				})
				.attr('r', function(d) {
					return radius(d.values['total']);
				})
				.attr('fill', function(d) {
					return 'blue';
				});



		var nested_region = d3.nest()
			.key(function(d) {
				return d['REGIAO_BENEFICIARIO_BOLSA'];
			})	
			.rollup(agg_region)
			.entries(data);
	

		var values = nested_region.map(function(d) { 
			return d.values;
		});
		
		svg.selectAll('region')
			.data(values)
			.enter()
			.append('g')
				.attr('class', 'region')
				.each(function(d, i) {
					var description = d.description;
					var max = d.max;

					var arr = new Array();
					for( var i = min_year; i <= max_year; ++i )
						arr.push(d[i+'']);

					d3.select(this)
						.selectAll('years')
						.data(arr)
						.enter()
						.append('g')
							.attr('class', 'years')
							.attr('transform', function(d, i) {
								return 'translate('+( (margins[description].x + i*30) )+', '+margins[description].y+')';
							})
						.append('g')
							.attr('class', 'y axis')
							.each(function(d, i) {

								var scale = d3.scale.linear()
									.domain([0, max])
									.range([height/3, margin]);

								var axis = d3.svg.axis()
									.scale(scale)
									.tickValues([0, max])
									.orient('left')
									.outerTickSize(0);

								d3.select(this).call(axis);
							});
				});


		svg.selectAll('region')
			.data(values)
			.enter()
			.append('g')
				.attr('class', 'region')
				.each(function(d, i) {
					var description = d.description;
					var max = d.max;
					var arr = new Array();
					for( var i = min_year; i <= max_year; ++i )
						arr.push(d[i+'']);

					d3.select(this)
						.selectAll('circle')
						.data(arr)
						.enter()
						.append('circle')
							.attr('cy', function(d) {
								var scale = d3.scale.linear()
									.domain([0, max])
									.range([height/3 + margins[description].y, margin + margins[description].y]);

								return scale(d);
							})
							.attr('cx', function(d, i) {
								return (margins[description].x + i*30);
							})
							.attr('r', function(d) {
								return d3.scale.sqrt().domain([0, max]).range([0, 5])(d);
							})
							.attr('fill', function(d) {
								return 'red';
							});

				});


		
		
	};


	d3.dsv(';')('data/prouni_filter.csv', function(d){
		d['ANO_CONCESSAO_BOLSA'] = +d['ANO_CONCESSAO_BOLSA'];
		return d;
	}, draw);



});