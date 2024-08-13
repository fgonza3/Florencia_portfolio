// Assuming you're using Node.js or a similar environment where you can require modules
const turf = require('@turf/turf');
const fs = require('fs');

// Load your GeoJSON file. This is a synchronous operation for simplicity, but you might want to do this asynchronously in a real app.
const hospitalsGeoJSON = JSON.parse(fs.readFileSync('assets/Hospitals.geojson'));

// Generate Voronoi polygons. You might need to adjust the options depending on your specific needs.
const voronoiPolygons = turf.voronoi(hospitalsGeoJSON, {bbox: turf.bbox(hospitalsGeoJSON)});

// Save the generated Voronoi polygons to a new GeoJSON file
fs.writeFileSync('assets/VoronoiPolygons.geojson', JSON.stringify(voronoiPolygons));
