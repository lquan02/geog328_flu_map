// initialize basemmap
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 2, // starting zoom
    center: [-120.6167337421042, 47.37496695075868] // starting center
});


// Declare a variable to store the state data
let weekly_data;

async function state_weekly() {
    const response = await fetch("assests/state-by-weeks-2022_keyed.json");
    weekly_data = await response.json();
    console.log(weekly_data);
    console.log(typeof weekly_data);

    // var parsedData = JSON.parse(weekly_data);

    console.log(weekly_data['Alabama'][0]["WEEK"]);
    console.log(weekly_data['Alabama'][1]["WEEK"]);
    console.log(weekly_data['Alabama'][2]["WEEK"]);

    let week = [];
    let i = 0;

    for(var key in weekly_data['Alabama']){
        week[i] = weekly_data['Alabama'][key]['WEEK'];
        i++;
      }
    console.log(week);

    showLineChartPopup('National');
}
state_weekly()

// Function to create a line chart pop-up
function showLineChartPopup(stateName) {
    // Extract x and y data for the chart
    let xData = [];
    let yData_D = [];
    let yData_A = [];
    let yData_B = [];
    let i = 0;

    for(var key in weekly_data[stateName]){
        xData[i] = weekly_data[stateName][key]['WEEK'];
        yData_D[i] = weekly_data[stateName][key]['DEATHS'];
        yData_A[i] = weekly_data[stateName][key]['TOTAL_A'];
        yData_B[i] = weekly_data[stateName][key]['TOTAL_B'];
        i++;
      }
    
    
    const ctx = document.getElementById('line-chart').getContext('2d');
    if (window.myLineChart) {
        // Destroy the existing chart
        window.myLineChart.destroy();
    }

    window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xData,
            datasets: [
                {
                    label: 'Death cases',
                    data: yData_D,
                    borderColor: 'rgba(207, 8, 8, 0.7)',
                    backgroundColor: 'rgba(207, 8, 8, 0.5)',
                    borderWidth: 1.5,
                },
                {
                    label: 'Type A',
                    data: yData_A,
                    borderColor: 'rgba(8, 207, 135, 1)',
                    backgroundColor: 'rgba(8, 207, 135, 0.5)',
                    borderWidth: 1.5,
                },
                {
                    label: 'Type B',
                    data: yData_B,
                    borderColor: 'rgba(238, 146, 0, 1)',
                    backgroundColor: 'rgba(238, 146, 0, 0.5)',
                    borderWidth: 1.5,
                }
            ],
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: stateName + ' Weekly Data',
                    font: {
                        size: 20,
                      }
                }
            },
            legend: {display: true},
        },
    });
}


document.getElementById('resize-button').addEventListener('click', function() {
    resizeCanvas();
});

// Function to resize the canvas
function resizeCanvas() {
    const chartContainer = document.getElementById('chart-container');

    const button = document.getElementById('resize-button');

    if (button.className === "expand") {
        // Set the new width and height for the canvas
        chartContainer.style.width = '700px';
        button.innerHTML = '<i class="fa fa-compress"></i>';
        button.className = "compress";
    } else {
        chartContainer.style.width = '500px';
        button.innerHTML = '<i class="fa fa-expand"></i>';
        button.className = "expand";
    }

    
    
}


// load data and add as layer
async function geojsonFetch() {
    let response = await fetch('assests/flu_state_data_2022.geojson');
    let state_data = await response.json();

    map.on('load', function loadingData() {
        map.addSource('state_data', {
            type: 'geojson',
            data: state_data
        });

        map.addLayer({
            'id': 'state_data_layer',
            'type': 'fill',
            'source': 'state_data',
            'paint': {
                'fill-color': [
                    'step',      // use step expression to provide fill color based on values
                    
                    ['get', 'PERCENT_POSITIVE'],  // get the density attribute from the data
                    
                    '#FFEDA0',   // use color #FFEDA0
                    5,          // if density < 10
                    
                    '#FED976',   // use color #FED976
                    10,          // if 10 <= density < 20
                    
                    '#FEB24C',   // use color #FEB24C
                    15,          // if 20 <= density < 50
                    
                    '#FD8D3C',   // use color #FD8D3C
                    20,         // if 50 <= density < 100
                    
                    '#FC4E2A',   // use color #FC4E2A
                    25,         // if 100 <= density < 200
                    
                    '#E31A1C',   // use color #E31A1C
                    30,         // if 200 <= density < 500
                    
                    '#BD0026',   // use color #BD0026
                    35,        // if 500 <= density < 1000
                    
                    "#800026"    // use color #800026 if 1000 <= density
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });

        const layers = [
            '0-9',
            '10-19',
            '20-49',
            '50-99',
            '100-199',
            '200-499',
            '500-999',
            '1000 and more'
        ];
        const colors = [
            '#FFEDA070',
            '#FED97670',
            '#FEB24C70',
            '#FD8D3C70',
            '#FC4E2A70',
            '#E31A1C70',
            '#BD002670',
            '#80002670'
        ];

        // create legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Population Density<br>(people/sq.mi.)</b><br><br>";


        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
    });

    map.on('mousemove', ({point}) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['state_data_layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.STATE}</h3><p><strong><em>${state[0].properties.PERCENT_POSITIVE}</strong> people per square mile</em></p>` :
            `<p>Hover over a state!</p>`;
    });
        // const stateName = state[0].properties.STATE;
        // Show the line chart pop-up for the clicked state
        // showLineChartPopup(stateName);

    // Event listener for a click on the map
    map.on('click', 'state_data_layer', (event) => {
        const stateName = event.features[0].properties.STATE;
        // Show the line chart pop-up for the clicked state
        showLineChartPopup(stateName);
    });

}

// Call the function to fetch GeoJSON data and load the map
geojsonFetch();




