var mapa;
document.getElementById('generate').addEventListener('click', function() {
	var island_size = document.getElementById('island-size').value;
	var map_size = document.getElementById('map-size').value;
	var land = document.getElementById('land').value;
	mapa = new map(map_size, 'map');
	mapa.generate(island_size);
	mapa.setLandPercent(land);
	mapa.drawHipsometric();
});