console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");


let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/JaydenHuang8', title: 'GitHub'},
    // add the rest of your pages here
 ];
 
let nav = document.createElement('nav');
nav.classList.add('menu');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    // TODO create link and add it to nav

    console.log('adding to nav');

    if (url.startsWith('https://github.com')) {
        // github page
        url = url
    } else if (!ARE_WE_HOME && !url.startsWith('http')) {
        // non home page
        url = '../' + url;
    } else {
        // home page
        url = 'https://jaydenhuang8.github.io/portfolio_site/' + url
    }

    
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host !== location.host) {
        console.log('outside link:')
        console.log(url)
        a.target = "_blank";
    }

    nav.append(a);
}
console.log('nav done');


export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        console.log(response)
        
        const data = await response.json();
        return data; 

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(project, containerElement, home, headingLevel = 'h2') {
    if (!(containerElement instanceof HTMLElement)) {
        console.error('Invalid container element provided.');
        return;
    }

    if (!/^h[1-6]$/.test(headingLevel)) {
        console.warn(`Invalid heading level "${headingLevel}". Defaulting to h2.`);
        headingLevel = 'h2';
    }

    containerElement.innerHTML = ''; // Clear content

    project.forEach(p => {
        const title = p.title || 'Untitled Project';
        let image = p.image || 'https://vis-society.github.io/labs/2/images/empty.svg';
        const year = p.year || 'unknown';
        const description = p.description || 'No description available.';
        const site = p.site_link;
        const repo = p.repo_link;

        if (!home && !/^https?:\/\//.test(image)) {
            image = `.${image}`;
        }

        let navHTML = '';
        if (site || repo) {
            navHTML = `<nav class="project-link">`;

            if (site) {
                navHTML += `
                    <a href="${site}" target="_blank" rel="noopener noreferrer">
                        View Site
                    </a>`;
            }

            if (repo) {
                navHTML += `
                    <a href="${repo}" target="_blank" rel="noopener noreferrer">
                        View Code
                    </a>`;
            }

            navHTML += `</nav>`;
        }

        const article = document.createElement('article');
        article.classList.add('project-card'); 
        article.innerHTML = `
            <${headingLevel}>${title}</${headingLevel}>
            <div class="image-box">
                <img src="${image}" alt="${title}" onerror="this.src='https://vis-society.github.io/labs/2/images/empty.svg';">
            </div>
            <div>
                <p>${description}</p>
                ${navHTML}
                <br />
                <p>c. ${year}</p>
            </div>
        `;

        containerElement.appendChild(article);

        // Add fade-in transition after DOM paint
        requestAnimationFrame(() => {
            article.classList.add('fade-in');
        });
    });
}





export function countProjects(project, titleElement) {
    // Check if projects is an array
    if (Array.isArray(project)) {
        const projectCount = project.length;
        titleElement.textContent = `${projectCount} Projects`;
    } else {
        console.error('Invalid projects data');
    }
}

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

const profileStats = document.querySelector('#profile-stats');
