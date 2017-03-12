$(document).ready(function(){


	function draw(data) {

		

	}





	d3.dsv(';')('data/prouni_filter.csv', function(d){
		d['ANO_CONCESSAO_BOLSA'] = +d['ANO_CONCESSAO_BOLSA'];
		return d;
	}, draw);



});