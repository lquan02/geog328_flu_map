// initialize basemmap
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 2.3, // starting zoom
    center: [-120.1, 49.0] // starting center
});

map.addControl(new mapboxgl.NavigationControl(), 'top-left');

// Declare a variable to store the state data
let weekly_data;

async function state_weekly() {
    const response = await fetch("assests/state-by-weeks-2022_keyed.json");
    weekly_data = await response.json();
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

    for(let key in weekly_data[stateName]){
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
            scales: {
                xAxes: {
                    title: {
                        display: true,
                        text: 'Week',
                        font: {
                            size: 12,
                        }
                    }
                },
                y: {
                    min: 0,
                }
            },
            stacked: false,
            plugins: {
                title: {
                    display: true,
                    text: stateName + ' Weekly Data',
                    font: {
                        size: 18,
                      }
                }
            },
            legend: {display: true},
        },
    });
}

let nationalFeature;
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
                    
                    ['+', ['get', 'TOTAL_A'], ['get', 'TOTAL_B']],  // get the total positive cases from the data
                    
                    '#888888',   
                    0.01,          // if total cases < 0.01 (which means 0 cases or N/A)
                    
                    '#FED976',   
                    1000,          // if total cases 1-1000 (which means 0 cases or N/A)
                    
                    '#FEB24C',   
                    5000,          // if total cases 1000-5000 (which means 0 cases or N/A)
                    
                    '#FD8D3C',   
                    10000,         // if total cases 5000-10000 (which means 0 cases or N/A)
                    
                    '#FC4E2A',   
                    20000,         // if total cases 10000-20000 (which means 0 cases or N/A)
                    
                    '#E31A1C',   
                    50000,         // if total cases 20000-50000 (which means 0 cases or N/A)
                    
                    "#800026"    // use color #800026 if total cases >= 50000
                ],
                'fill-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    0.8,
                    0.5
                ]
            }
        });
        map.addLayer({
            'id': 'state_borders',
            'type': 'line',
            'source': 'state_data',
            'layout': {},
            'paint': {
                'line-color': "#000000",
                'line-width': [
                    'case',
                    ['boolean', ['feature-state', 'clicked'], false],
                    2.5,
                    1
                ],
                'line-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'clicked'], false],
                    0.5,
                    0.1
                ]
            }
        });
        const layers = [
            '0',
            '<1000',
            '1,000',
            '5,000',
            '10,000',
            '20,000',
            '50,000+'
        ];
        const colors = [
            '#888888',
            '#FED97670',
            '#FEB24C70',
            '#FD8D3C70',
            '#FC4E2A70',
            '#E31A1C70',
            '#80002670'
        ];
        // create legend
        const legend = document.getElementById('legend');

        // Loop through layers to create legend items
        layers.forEach((layer, i) => {
        // Create a container for each legend item
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        // Create the color block
        const key = document.createElement('div');
        key.className = 'legend-key';
        key.style.backgroundColor = colors[i];

        // Create the label text
        const label = document.createElement('span');
        label.innerText = layer;
        key.appendChild(label);

        // Append the color block to the legend item container
        legendItem.appendChild(key);

        // Append the legend item to the legend
        legend.appendChild(legendItem);

        nationalFeature = state_data.features.find(feature => feature.properties.STATE === 'National');
        document.getElementById('text-description').innerHTML = `<h3>${nationalFeature.properties.STATE}</h3>`;
        document.getElementById('text-description').innerHTML += `<p><strong><em>${nationalFeature.properties.TOTAL_A + nationalFeature.properties.TOTAL_B}</strong> positive cases</em> | <strong><em>${nationalFeature.properties.DEATH}</strong> deaths</em></p>`;    });
});
    let hoveredPolygonId = null;
    map.on('mousemove', 'state_data_layer', (e) => {
        if (e.features.length > 0) {
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: 'state_data', id: hoveredPolygonId },
                    { hover: false }
                );
            }
            hoveredPolygonId = e.features[0].id;
            map.setFeatureState(
                { source: 'state_data', id: hoveredPolygonId },
                { hover: true }
            );
        }
    });
    
    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    map.on('mouseleave', 'state_data_layer', () => {
        if (hoveredPolygonId !== null) {
            map.setFeatureState(
                { source: 'state_data', id: hoveredPolygonId },
                { hover: false }
            );
        }
        hoveredPolygonId = null;
    });

    let polygonID = null;
    map.on('click', ({point}) => {
      
        const state = map.queryRenderedFeatures(point, {
            layers: ['state_data_layer']
        });
        if (state.length) {
            // If a state is clicked, show information for that state
            document.getElementById('text-description').innerHTML = `<h3>${state[0].properties.STATE}</h3>`;
            document.getElementById('text-description').innerHTML += `<p><strong><em>${state[0].properties.TOTAL_A + state[0].properties.TOTAL_B}</strong> positive cases</em> | <strong><em>${state[0].properties.DEATH}</strong> deaths</em></p>`;
            showLineChartPopup(state[0].properties.STATE);
            
            if (polygonID) {
                map.removeFeatureState({
                    source: "state_data",
                    id: polygonID
                });
            }

            polygonID = state[0].id;

            map.setFeatureState({
                    source: 'state_data',
                    id: polygonID,
                }, {
                clicked: true
            });
        } else {
            // If clicked outside of a state, show national data
            document.getElementById('text-description').innerHTML = `<h3>${nationalFeature.properties.STATE}</h3>`;
            document.getElementById('text-description').innerHTML += `<p><strong><em>${nationalFeature.properties.TOTAL_A + nationalFeature.properties.TOTAL_B}</strong> positive cases</em> | <strong><em>${nationalFeature.properties.DEATH}</strong> deaths</em></p>`;
            showLineChartPopup('National');
            
            map.setFeatureState({
                    source: 'state_data',
                    id: polygonID,
                }, {
                clicked: false
            }); 
        }
    });
    
    let table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3, cell4;
    for (let i = 0; i < state_data.features.length-1; i++) {
        row = table.insertRow(-1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);
        cell4 = row.insertCell(3);
        cell1.innerHTML = state_data.features[i].properties.STATE;
        cell2.innerHTML = state_data.features[i].properties.DEATH;
        cell3.innerHTML = state_data.features[i].properties.TOTAL_A;
        cell4.innerHTML = state_data.features[i].properties.TOTAL_B;
    }
  
    let clicked = [false, false, false, false];
    document.getElementById('name-button').addEventListener('click', function(){
        sortToggle(clicked, 0);
    });
    document.getElementById('deaths-button').addEventListener('click', function(){
        sortToggle(clicked, 1);
    });
    document.getElementById('type-a-button').addEventListener('click', function(){
        sortToggle(clicked, 2);
    });
    document.getElementById('type-b-button').addEventListener('click', function(){
        sortToggle(clicked, 3);
    });
}
// Call the function to fetch GeoJSON data and load the map
geojsonFetch();

function sortToggle(arr, num){
    if(!arr[num]){
        sortTable(num, true);
        arr[num] = true;
    }else{
        sortTable(num, false);
        arr[num] = false;
    }
}

function sortTable(idx, isAsc) {
    let table = document.getElementsByTagName("table")[0];
    let tbody = table.getElementsByTagName('tbody')[0];
    //convert to arr for sorting
    let arr = Array.from(table.rows);

    //preserve top row so it doesn't get sorted
    let toprow = arr[0];
    arr.shift();
    arr = quickSort(arr, idx, isAsc);
    arr.unshift(toprow);

    while (tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
    }
    arr.forEach(row => tbody.appendChild(row));
}

const quickSort = (arr, idx, isAsc) => {
    if (arr.length <= 1) {
      return arr;
    }
    let pivot = arr[0];
    let leftArr = [];
    let rightArr = [];
    for (let i = 1; i < arr.length; i++) {
        let x;
        let y;
        if(idx === 0){
            x = arr[i].getElementsByTagName("td")[idx].innerHTML;
            y = pivot.getElementsByTagName("td")[idx].innerHTML;
        }else{
            x = parseFloat(arr[i].getElementsByTagName("td")[idx].innerHTML);
            y = parseFloat(pivot.getElementsByTagName("td")[idx].innerHTML);
        }
        if(isAsc){
            if (x < y) {
                leftArr.push(arr[i]);
            } else {
                rightArr.push(arr[i]);
            }
        }else{
            if (x > y) {
                leftArr.push(arr[i]);
            } else {
                rightArr.push(arr[i]);
            } 
        } 
    }
    return [...quickSort(leftArr, idx, isAsc), pivot, ...quickSort(rightArr, idx, isAsc)];
};

function openNav() {
    document.getElementById("side-container").style.display = "block";
    document.getElementById("openbtn").style.display = "none";
}

function closeNav() {
    document.getElementById("side-container").style.display = "none";
    document.getElementById("openbtn").style.display = "block";
}

function openPopup(n) {
    if (n == 1) {
        if (document.getElementById("description-popup").style.display == "block") {
            closePopup(1);
        } else {
        closePopup(2);
        document.getElementById("description-popup").style.display = "block";
        }
    }
    else if (n==2) {
        if (document.getElementById("acknowledge-popup").style.display == "block") {
            closePopup(2);
        } else {
            closePopup(1);
            document.getElementById("acknowledge-popup").style.display = "block";
        }
    }
}

function closePopup(n) {
    if (n==1) {
        document.getElementById("description-popup").style.display = "none";
    }
    else if (n==2) {
        document.getElementById("acknowledge-popup").style.display = "none";
    }
}
