const fs = require('fs');
const path = require('path');

let projects = []; 


const sectorData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/sectorData.json')));
const projectData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/projectData.json')));


function initialize() {
    return new Promise((resolve, reject) => {
        try {
            projects = [];

            projectData.forEach(project => {
                const sector = sectorData.find(s => s.id === project.sector_id);
                projects.push({
                    ...project,
                    sector: sector ? sector.sector_name : "Unknown"
                });
            });

            resolve();
        } catch (err) {
            reject("Failed to initialize projects: " + err);
        }
    });
}


function getAllProjects() {
    return new Promise((resolve, reject) => {
        if (projects.length === 0) {
            reject("No projects available. Did you call initialize()?");
        } else {
            resolve(projects);
        }
    });
}

function getProjectById(projectId) {
    return new Promise((resolve, reject) => {
        const idNum = Number(projectId); 
        const project = projects.find(p => p.id === idNum);
        if (project) {
            resolve(project);
        } else {
            reject(`Project with id ${projectId} not found.`);
        }
    });
}


function getProjectsBySector(sector) {
    return new Promise((resolve, reject) => {
        const matchedProjects = projects.filter(p => 
            p.sector.toLowerCase() === sector.toLowerCase()
        );

        if (matchedProjects.length > 0) {
            resolve(matchedProjects);
        } else {
            reject(`No projects found for sector: "${sector}".`);
        }
    });
}

module.exports = {
    initialize,
    getAllProjects,
    getProjectById,
    getProjectsBySector
};
