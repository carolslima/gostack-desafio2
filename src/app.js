const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const { v4 } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories)
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body

  if (!title && !url && !techs){
    return response.status(400).json({error: 'Fields not match!'})
  }

  const repository = {
    id: v4(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const{title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found!'})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex >= 0){
    repositories.splice(repositoryIndex, 1);
  } else {
  return response.status(400).json({error: 'Repository not found!'})

  }  

  return response.status(204).send()

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found!'})
  }

  const repository = repositories[repositoryIndex];

  const result = repository.likes + 1;

  repository.likes = result;

  return response.status(200).json(repository)
});

module.exports = app;
