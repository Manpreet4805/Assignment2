/********************************************************************************
* WEB322 – Assignment 02
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Manpreet Singh
* Student ID: 190709238
* Date: 12 November, 2025
*
********************************************************************************/
const express = require("express")
const path = require("path")
const projectData = require("./modules/projects")

const app = express()
const HTTP_PORT = process.env.PORT || 7800

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(express.static("public"))

app.get("/", (req, res) => {
  res.render("home", { page: "/" })
})

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" })
})

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

app.use((req, res) => {
  res.status(404).render("404", {
    message: "Page not found",
    page: "",
  })
})

projectData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Server running on port ${HTTP_PORT}`)
    })
  })
  .catch((err) => {
    console.log("Failed to start server:", err)
  })
