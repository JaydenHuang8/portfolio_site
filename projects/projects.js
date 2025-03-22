import { fetchJSON, renderProjects, countProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const title = document.querySelector('h1');
countProjects(projects, title)

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let filteredProjects = projects
let searchInput = document.querySelector('.searchBar');

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  //clear existing paths and legend items for re-rendering
  let svg = d3.select('svg')
  svg.selectAll('path').remove();  
  d3.select('.legend').selectAll('li').remove();  

  //re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  //re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  // clear up paths and legends
  let legend = d3.select('.legend');

  newArcs.forEach((arc, idx) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) 
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx; // Toggle selection
      
        // Update classes for all paths
        svg.selectAll('path')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'selected' : ''));

        // Update legend to highlight selected item
        d3.select('.legend')
          .selectAll('li')
          .attr('class', (_, idx) => (idx === selectedIndex ? 'legend-selected legend-item' : 'legend-item'));
        
        // re render func
        filterAndRenderProjects(newData);
        });
  })


  // update paths and legends, refer to steps 1.4 and 2.2
  newData.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
          .attr('class', 'legend-item') // Assign a class for styling
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
})
}

renderPieChart(projects);

let query = '';

searchInput.addEventListener('change', (event) => {
//update query value
    query = event.target.value.toLowerCase();
//filter the projects
    filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });
//render updated projects!
    
    renderProjects(filteredProjects, projectsContainer, 'h2'); // Update the project list
    renderPieChart(filteredProjects);
    
});

function filterAndRenderProjects(newData) {
  console.log('clicked and updating')

  filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
    });

  if (selectedIndex === -1) {
      // If no pie slice is selected, show all projects
      renderProjects(filteredProjects, projectsContainer, 'h2');
  } else {
      // Filter projects based on the selected pie slice's year
      let selectedYear = newData[selectedIndex].label; // Get the year label of the selected slice
      
      filteredProjects = filteredProjects.filter((project) => project.year === selectedYear);

      renderProjects(filteredProjects, projectsContainer, 'h2'); // Update the project list
  }
}









// let arc = arcGenerator({
//     startAngle: 0,
//     endAngle: 2 * Math.PI,
//   });


// d3.select('svg').append('path').attr('d', arc).attr('fill', 'red');


// let total = 0;

// for (let d of data) {
//   total += d;
// }

//let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// let arcs = arcData.map((d) => arcGenerator(d));




// let rolledData = d3.rollups(
//   projects,
//   (v) => v.length,
//   (d) => d.year,
// );

// let data = rolledData.map(([year, count]) => {
//     return { value: count, label: year };
//   });

// let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));

// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// arcs.forEach((arc, idx) => {
//     d3.select('svg')
//       .append('path')
//       .attr('d', arc)
//       .attr('fill', colors(idx)) 
// })

// let legend = d3.select('.legend');

// data.forEach((d, idx) => {
//     legend.append('li')
//           .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//           .attr('class', 'legend-item') // Assign a class for styling
//           .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// })