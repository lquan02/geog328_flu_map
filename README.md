# Title: 2022 Interactive Influenza Disease Map


## Project link

[https://lquan02.github.io/geog382_flu_map/index.html](https://lquan02.github.io/geog382_flu_map/index.html) 


## Project Description

The 2022 Interactive Influenza Disease Map project stands as a comprehensive initiative driven by primary data sources extracted from the CDC Weekly U.S. Influenza Surveillance Report, covering all 52 weeks of 2022. Our team meticulously curated two datasets, the first detailing flu cases categorized by Influenza types A and B reported by U.S. Clinical Laboratories, and the second documenting influenza-related deaths by state, sourced from the NCHS Mortality Surveillance. These two weekly datasets were combined as a single file and then aggregated by state, providing a robust foundation for a comprehensive annual influenza dataset for the year 2022.


## Project Goals

The primary goal of our project is to create a user-friendly and interactive map with a comprehensive visual representation of flu cases and related deaths in the United States for the year 2022. Building on the enriched datasets derived from the CDC, merged seamlessly with state geometries, our objective is to offer users not just a visual representation but a deeper understanding of the patterns and implications of flu activity across the nation.

**Enhanced User Engagement:** Beyond the surface level of presenting data, our project aspires to captivate users, fostering a high degree of engagement. The interactive map is designed not only to be visually appealing but also to encourage users to actively explore and interact with the data.

**Spatial and Temporal Analysis:** The interactive map is not merely a snapshot but a dynamic tool for spatial and temporal analysis. Users can delve into the ebb and flow of flu activity over the course of the year, discerning patterns and trends that might be obscured in static representations.

**Empowering Informed Decision-Making:** The ultimate goal is to empower users with the knowledge to make informed decisions. Whether it's a public health official devising targeted interventions, a policymaker allocating resources, or an individual taking personal precautions, our project aims to equip users with the information necessary for proactive decision-making.


## Project Features

At the core of our project lies an intricately designed interactive choropleth map, skillfully implemented through the Mapbox GL JS library. This dynamic map serves as a compelling visual representation, portraying the distribution of reported flu cases and influenza-related deaths with vibrant detail across each state in the United States. Users are granted a flexible and seamless navigation experience, empowered by built-in interactive features that facilitate an in-depth exploration of specific states.

An intuitive hover effect enhances user orientation by dynamically altering the style of a state when hovered over, providing a visual cue of the user's current location on the map. Upon clicking individual states, the web map unfolds a wealth of information, presenting annual statistics detailing the total positive cases. Additionally, the map also features a dynamic line chart that vividly illustrates weekly data for each state. This chart is a powerful tool, spotlighting crucial metrics such as death cases, Type A, and Type B cases over time, allowing users to explore the temporal factors of the Influenza disease within a year. 

The integration of geospatial and temporal data visualization into a single platform offers users a comprehensive and interactive experience. This web map facilitates exploration and deeper understanding of influenza disease statistics, not only at the national level but also with a granular focus on individual states. In essence, our map provides a sophisticated yet user-friendly tool for unraveling the complexities of flu-related data, fostering a nuanced comprehension of the impact of influenza across different regions and timeframes.

Our project is designed with a responsive layout, ensuring a smooth experience across various devices, including desktops, tablets, and smartphones. The responsive design enhances accessibility, allowing users to explore flu-related data anytime and anywhere. To promote a deeper understanding of influenza and its impact, the project incorporates resources from the CDC. This includes data from individual states categorized in a single data file.


## Main Functions

`state_weekly`: This function asynchronously fetches and processes weekly state-related JSON data from the **state-by-weeks-2022_keyed.json** file in the *assets* folder. It converts the response into a JavaScript object, known as **weekly_data**, likely organized by states. Following this, the function triggers the display of a line chart popup for the national level using `showLineChartPopup('National')`. This chart likely illustrates key metrics like death cases, Type A, and Type B data over 52 weeks, offering a comprehensive overview of nationwide trends in 2022.

`showLineChartPopup`: This function takes a stateName and generates a dynamic line chart using preloaded **weekly_data**. Extracting week and data metrics, it creates or updates a **Chart.js** chart on the HTML canvas *'line-chart'*. The chart includes death cases and influenza type A and type B datasets with distinct styles and labels. The function ensures a clean update, offering customization options like responsiveness, interaction, and titles, presenting a visually appealing representation of weekly data for the specified state with a legend for dataset interpretation.

`geojsonFetch`: This function fetches the GeoJSON data related to flu statistics for each state in 2022. With the `loadingData()` function, it adds this data as a source to a Mapbox map and creates visualizations, including a fill layer representing positive cases with a color scale, state borders, and a legend for intuitive interpretation. The function also dynamically updates an HTML description of national or state-specific data based on mouse interactions, such as hover and click events on map features. Additionally, the function populates an HTML table with state-specific flu statistics and allows users to sort the table by state name, death cases, Type A cases, and Type B cases. 

`sortToggle`: A function that enables switching between ascending and descending sorting on the sorting panel.

`sortTable`: A function that turns the data from the table element into a sortable array, passes it to `quickSort()`, and then turns it back into the original format.

`quickSort`: An implementation of the recursive quicksort algorithm that works for ascending and descending as well as for string and float data for the purposes of the four types of sorting in the sorting panel.

`openPopup`: This function is responsible for triggering the display of popup windows in response to user actions. When a user clicks on a specific state, this function will generate and display a popup containing relevant data for visualization. Similarly, if a user clicks on an icon, the function will present a popup with pertinent information for the user to view.

`closePopup`: This function serves the purpose of closing any open popup windows. When invoked, it effectively dismisses the currently displayed popup, removing the information or data visualization from the screen. This is typically triggered when the user clicks on a close button within the popup or clicks outside the popup area, signaling that they have finished viewing the information.

`openNav`: A function that changes the displays of two HTML elements when called. It makes the element side-container visible, while hiding the element openbtn.

`closeNav`: The closeNav function hides the sidebar when the user interacts with the close button. Once the function is called, the element side-container is hidden, and the element openbtn is visible.



## Screenshots

![Picture of Map](https://lh3.googleusercontent.com/pw/ADCreHc-kIJprZln1bVRQyExJXWyqxr_ndMmdG-d9JosHhlUh-QVYzn6NrY48M8qLfKdSGDRnKjeCgIHxrw30BN2dSU1od-RauztdztxoLgswEpU12FlwBA=w2400)

![Picture of data](https://lh3.googleusercontent.com/pw/ADCreHdfVDB7PzD_7uAregjXlef6UpGmHY9W9QP267_Ih8gn_ygtpXIMqn2if-mTNgAE7h9c7YZIc7VSQI0T8Rs2jJbAPm9te7sAuPp1g44aBNId3vnsMrw=w2400)



## Data Sources

All the influenza statistics are sourced from the Weekly U.S. Influenza Surveillance Report: [https://www.cdc.gov/flu/weekly/index.htm](https://www.cdc.gov/flu/weekly/index.htm)

 * The positive cases by type are the results of tests performed by clinical laboratories nationwide
 * The Influenza-death related case sourced from the National Center for Health Statistics (NCHS) Mortality Surveillance


The state geometry GeoJSON file is sourced from the data from GEOG 328 Lab 4: [https://github.com/jakobzhao/geog328/blob/main/labs/lab04/assets/state_data.geojson](https://github.com/jakobzhao/geog328/blob/main/labs/lab04/assets/state_data.geojson) 

 

## Applied Libraries

[MapboxGL CSS](https://api.mapbox.com/mapbox-gl-js/v2.5.0/mapbox-gl.css),

[MapboxGL JS](https://docs.mapbox.com/mapbox-gl-js/api/),

Mapbox [style overlay](https://docs.mapbox.com/api/maps/styles/) for the base map,

[ChartJS](https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.0/chart.min.js) for interactive charts,

[Font Awesome](https://fontawesome.com/) for icons, and 

[Github](https://github.com/) for static site hosting service



## Acknowledgment

This project would not be possible without the contribution of our group members:

* Jolie Tran
* Luong Quan
* Zach Wu
* Reginald R Asplet
* Coby Daniel Williams-Gurian

Together with the data sources, as well as the applied libraries mentioned above.
