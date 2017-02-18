$(document).ready(function() {

	function draw(data) {

		console.log(data);
	}


	var format = d3.time.format('%d-%m-%Y (%H:%M h)');
	d3.tsv('data/world_cup_geo.tsv', function(d) {
		d['date'] = format.parse(d['date']);
		d['attendance'] = +d['attendance'];
		return d;
	}, draw);

});