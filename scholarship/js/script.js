$(document).ready(function(){


	function draw(data) {

		'use strict';
		var margin = 20,
			width = 960-margin,
			height = 500-margin;

		var margins = {};
		margins['COUNTRY'] = {x: width/2 - 100, y: 40};
		margins['NORTE'] = {x: 50, y: 300};
		margins['NORDESTE'] = {x: 230, y: 300};
		margins['CENTRO-OESTE'] = {x: 410, y: 300};
		margins['SUDESTE'] = {x: 580, y: 300};
		margins['SUL'] = {x: 760, y: 300};

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
			.tickValues([])
			.orient('left')
			.outerTickSize(0);

		var svg = d3.select('svg');

		svg.selectAll('years')
			.data(nested)
			.enter()
			.append('g')
				.attr('class', 'years')
				.attr('transform', function(d, i) {
					return 'translate('+(margins[d.values['description']].x + i*50)+','+margins[d.values['description']].y+')';
				})
			.append('g')
				.attr('class', 'y axis')
				.each(function(d) {
					d3.select(this).call(scholarship_axis);
				});

		var line_function = d3.svg.line()
								.x(function(d, i) {
									return margins[d.values['description']].x + i*50;
								})
								.y(function(d) {
									return scholarship_scale(d.values['total']) + margins[d.values['description']].y;
								})
								.interpolate('linear');
		
		svg.append('g')
				.attr('class', 'line-country')
			.selectAll('path')
			.data(nested)
			.enter()
			.append('path')
				.attr('d', line_function(nested));

		svg.selectAll('circle')
			.data(nested)
			.enter()
			.append('circle')
				.attr('cy', function(d) {
					return scholarship_scale(d.values['total']) + margins[d.values['description']].y;
				})	
				.attr('cx', function(d, i) {
					return (margins[d.values['description']].x + i*50);
				})
				.attr('r', function(d) {
					return radius(d.values['total']);
				})
				.attr('fill', function(d) {
					return '#fff';
				})
				.attr('stroke', function(d) {
					return '#34f';
				});

		var country_legend = svg.append('g')
			.attr('class', 'legend')
			.attr('transform', 'translate('+0+',0)')
			.selectAll('g')
			.data([0, max_scholarship])
			.enter().append('g')
			.append('text')
				.attr('class', 'legend-text')
				.attr('y', function(d, i) {
					return d3.scale.linear()
						.domain([0, max_scholarship])
						.range([height/2.35 + margins['COUNTRY'].y, margin + margins['COUNTRY'].y - 5])(d);
				}) 
				.attr('x', function(d, i) {
					return margins['COUNTRY'].x + 2*50 - 3*(d+'').length;
				})
				.text(function(d) {
					return d+'';
				});

		var country_legend_name = svg.append('g')
			.attr('class', 'legend')
			.attr('transform', 'translate('+0+',0)')
			.selectAll('g')
			.data(['BRAZIL'])
			.enter().append('g')
			.append('text')
				.attr('class', 'legend-text-name')
				.attr('y', function(d, i) {
					return height/2.2 + margins['COUNTRY'].y;
				}) 
				.attr('x', function(d, i) {
					return margins['COUNTRY'].x + 2*50 - 3.7*(d).length;
				})
				.text(function(d) {
					return d;
				});

		var country_legend_year = svg.append('g')
			.attr('class', 'legend')
			.attr('transform', 'translate(0, 0)')
			.selectAll('g')
			.data(d3.extent(data, function(d) {
				return d['ANO_CONCESSAO_BOLSA'];
			}))
			.enter().append('g')
			.append('text')
				.attr('class', 'legend-year')
				.attr('y', function(d, i) {
					return height/2.5 + margins['COUNTRY'].y;
				})
				.attr('x', function(d, i) {
					return d3.scale.linear()
						.domain([0, 1])
						.range([margins['COUNTRY'].x - 7*(d+'').length, margins['COUNTRY'].x + (max_year-min_year)*51])(i);
				})
				.text(function(d) {
					return d+'';
				})



		var nested_region = d3.nest()
			.key(function(d) {
				return d['REGIAO_BENEFICIARIO_BOLSA'];
			})	
			.rollup(agg_region)
			.entries(data);
	

		var values = nested_region.map(function(d) { 
			return d.values;
		});

		var max_value = d3.max(values, function(d) {return d.max;});
		
		svg.selectAll('region')
			.data(values)
			.enter()
			.append('g')
				.attr('class', 'region')
				.each(function(d, i) {
					var description = d.description;
					var max = max_value;

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
									.tickValues([])
									.orient('left')
									.outerTickSize(0);

								d3.select(this).call(axis);
							});


					var legend = d3.select(this).append('g')
						.attr('class', 'legend')
						.attr('transform', 'translate(0,0)')
						.selectAll('g')
						.data([0, max])
						.enter().append('g')
						.append('text')
							.attr('class', 'legend-text')
							.attr('y', function(d, i) {
								return d3.scale.linear()
									.domain([0, max])
									.range([height/2.8 + margins[description].y, margin + margins[description].y - 5])(d);
							}) 
							.attr('x', function(d, i) {
								return margins[description].x + 2*30 - 3*(d+'').length;
							})
							.text(function(d) {
								return d+'';
							});

					var country_legend_name = svg.append('g')
						.attr('class', 'legend')
						.attr('transform', 'translate('+0+',0)')
						.selectAll('g')
						.data([description])
						.enter().append('g')
						.append('text')
							.attr('class', 'legend-text-name')
							.attr('y', function(d, i) {
								return d3.scale.linear()
									.domain([0, max])
									.range([height/2.6 + margins[description].y, margin + margins[description].y - 5])(0);
							}) 
							.attr('x', function(d, i) {
								return margins[description].x + 2*30 - 4.5*(d).length;
							})
							.text(function(d) {
								return d;
							});
				});


		svg.selectAll('region')
			.data(values)
			.enter()
			.append('g')
				.attr('class', 'region')
				.each(function(d, i) {
					var description = d.description;
					var max = max_value;//d.max;
					var arr = new Array();
					for( var i = min_year; i <= max_year; ++i )
						arr.push(d[i+'']);

					var line_regions = d3.svg.line()
								.x(function(d, i) {
									return margins[description].x + i*30;
								})
								.y(function(d) {
									var scale = d3.scale.linear()
										.domain([0, max])
										.range([height/3 + margins[description].y, margin + margins[description].y]);

									return scale(d);
								})
								.interpolate('linear');
		
					d3.select(this).append('g')
							.attr('class', 'line-regions')
						.selectAll('path')
						.data(arr)
						.enter()
						.append('path')
							.attr('d', line_regions(arr));
					

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
								return '#fff';
							})
							.attr('stroke', function(d) {
								return '#f43';
							});

					

				});
	

		var legend = svg.append('g')
		    .attr('class', 'legend')
		    .attr('transform', 'translate('+(width-200)+','+100+')')
		    .selectAll('g')
		    .data(['Whole Country', 'Regions'])
		    .enter().append('g');

		  legend.append('circle')
		  	.attr('cy', function(d, i) {
		  		return i*30;
		  	})
		  	.attr('r', 5)
		  	.attr('fill', function(d) {
		  		return '#fff';
		  	})
		  	.attr('stroke', function(d) {
		  		if( d == 'Whole Country' )
		  			return '#34f';
		  		return '#f43';
		  	});

		  legend.append('text')
		  	.attr('y', function(d, i) {
		  		return i*30 + 5;
		  	})
		  	.attr('x', 10)
		  	.text(function(d) {
		  		return d;
		  	});


		var title = svg.append('g')
			.attr('class', 'title')
			.attr('transform', 'translate('+width/2+','+margin+')')
			.selectAll('g')
			.data(['Scholarships given from 2012 to 2016'])
			.enter().append('g')
			.append('text')
				.attr('y', 0)
				.attr('x', function(d) {
					return -7.5*d.length/2;
				})
				.text(function(d) {
					return d;
				})
		
	};


	d3.dsv(';')('data/prouni_filter.csv', function(d){
		d['ANO_CONCESSAO_BOLSA'] = +d['ANO_CONCESSAO_BOLSA'];
		return d;
	}, draw);



});