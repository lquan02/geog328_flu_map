// initialize basemmap
mapboxgl.accessToken =
    'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    zoom: 3, // starting zoom
    center: [-120.6167337421042, 47.37496695075868] // starting center
});

// map.addControl(new mapboxgl.NavigationControl());

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
  
    for(let key in weekly_data['Alabama']){
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
        chartContainer.style.width = '400px';
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
            '0 or N/A',
            'Less than 1000',
            '1,000-5,000',
            '5,000-10,000',
            '10,000-20,000',
            '20,000-50,000',
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
        legend.innerHTML = "<b>Total Positive Cases<br></b>(Both Type A and Type B)<br>";

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
    var polygonID = null;
    map.on('click', ({point}) => {
      
        const state = map.queryRenderedFeatures(point, {
            layers: ['state_data_layer']
        });
        if (state.length) {
            // If a state is clicked, show information for that state
            document.getElementById('text-description').innerHTML = `<h3>${state[0].properties.STATE}</h3><p><strong><em>${state[0].properties.TOTAL_A + state[0].properties.TOTAL_B}</strong> positive cases</em></p>`;
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
            document.getElementById('text-description').innerHTML = `<p>Click on a state!</p>`;
            showLineChartPopup('National');
            
            map.setFeatureState({
                    source: 'state_data',
                    id: polygonID,
                }, {
                clicked: false
            }); 

        }
    });
  
    table = document.getElementsByTagName("table")[0];
    let row, cell1, cell2, cell3, cell4;
    for (let i = 0; i < state_data.features.length; i++) {
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