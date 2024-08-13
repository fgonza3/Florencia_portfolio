mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 3.5, // starting zoom
    minZoom: 2, // minimum zoom level of the map
    center: [-98, 39] // starting center
});
const grades = [100, 5000, 15000, 20000, 30000, 50000];
const colors = [
    'rgb(255, 255, 204)',  // Light yellow
    'rgb(255, 255, 102)',  // Yellow
    'rgb(255, 204, 51)',   // Yellow-orange
    'rgb(255, 153, 51)',   // Orange
    'rgb(255, 102, 0)',    // Orange-red
    'rgb(255, 51, 51)'     // Red
];
const radii = [1, 2, 6, 8, 12, 20];

// Set Albers projection
map.setProjection({
    name: 'albers',
    center: [-98, 39], // Center coordinates for your desired view
    parallels: [29.5, 45] // Specify the parallels
});

//load data to the map as new layers.
//map.on('load', function loadingData() {
map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function
    // when loading a geojson, there are two steps
    // add a source of the data and then add the layer out of the source
    map.addSource('count', {
        type: 'geojson',
        data: 'assets/covidCounts.json'
    });
    map.addLayer({
            'id': 'count-point',
            'type': 'circle',
            'source': 'count',
            'paint': {
                // increase the radii of the circle as the zoom level and dbh value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], radii[0]],
                        [grades[1], radii[1]],
                        [grades[2], radii[2]],
                        [grades[3], radii[3]],
                        [grades[4], radii[4]],
                        [grades[5], radii[5]],
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [grades[0], colors[0]],
                        [grades[1], colors[1]],
                        [grades[2], colors[2]],
                        [grades[3], colors[3]],
                        [grades[4], colors[4]],
                        [grades[5], colors[5]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 0.3,
                'circle-opacity': 0.6
            }
        }
    );
    // click on tree to view counts in a popup
    map.on('click', 'count-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });
});
// create legend
const legend = document.getElementById('legend');
//set up legend grades and labels
var labels = ['<strong>Cases</strong>'],
    vbreak;
//iterate through grades and create a scaled circle and label for each
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radii = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radii +
        'px; height: ' +
        dot_radii + 'px; "></i> <span class="dot-label" style="top: ' + dot_radii / 2 + 'px;">' + vbreak +
        '</span></p>');
}
const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">New York Times</a></p>';
legend.innerHTML = labels.join('') + source;