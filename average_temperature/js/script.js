$(document).ready(function(){

	function draw(data) {

		var marging = 75,
			width = 1400-margin,
			height = 600-margin;

		d3.select('body').append('h2').text('World Cup Attendance');

		
	}

	d3.tsv('data/temperature_phoenix.tsv', draw);

});