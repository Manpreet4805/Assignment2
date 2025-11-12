/********************************************************************************
* WEB322 – Assignment 02
*
* Name: Manpreet Singh
* Student ID: 190709238
* Date: 12 November, 2025
*
********************************************************************************/

const express = require("express");
const path = require("path");
const projectData = require("./modules/projects");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Home and About pages
app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

// Projects listing
app.get("/solutions/projects", (req, res) => {
  const sector = req.query.sector;
  if (sector) {
    projectData.getProjectsBySector(sector)
      .then(projects => {
        if (projects.length === 0) {
          res.status(404).render("404", { message: `No projects found for sector: ${sector}`, page: "" });
        } else {
          res.render("projects", { projects, page: "/solutions/projects" });
        }
      })
      .catch(err => res.status(404).render("404", { message: err, page: "" }));
  } else {
    projectData.getAllProjects()
      .then(projects => res.render("projects", { projects, page: "/solutions/projects" }))
      .catch(err => res.status(404).render("404", { message: err, page: "" }));
  }
});

// Project detail
app.get("/solutions/projects/:id", (req, res) => {
  const id = req.params.id;
  projectData.getProjectById(id)
    .then(project => {
      if (!project) {
        res.status(404).render("404", { message: `No project found with id: ${id}`, page: "" });
      } else {
        res.render("project", { project, page: "" });
      }
    })
    .catch(err => res.status(404).render("404", { message: err, page: "" }));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render("404", { message: "Page not found", page: "" });
});

// Initialize projects and export app for Vercel
projectData.initialize()
  .then(() => console.log("Project data initialized"))
  .catch(err => console.log("Failed to initialize project data:", err));

module.exports = app;
