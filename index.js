const express = require('express');

const server = express();

server.use(express.json());

let requestCount = 0;

// array de projetos
const projects = [{
    id: "0",
    title: "Projeto Inicial",
    tasks: ["Nova tarefa"]
  }];

//middleware global
server.use((req, res, next)=>{
    requestCount++;
    console.log(`o numero de requisições até agora é igual a: ${requestCount}`);
    next();
});

//middleware para checkar se o id foi passado no parametro
function checkIDParameter(req,res,next){
    const {id} = req.params;
    if(!id){
        return res.status(400).json({message:"please provide an id number for this project"});
    }
    req.id = id;
    next();
}


// rota para criar projetos
server.post('/projects', (req, res)=>{
    const {id, title} = req.body;
    
    if(!id){
        return res.status(400).json({message:"please provide an id number for this project"})
    }

    if(!title){
        return res.status(400).json({message:"please provide a title number for this project"})
    }

    const projectExists = projects.find(project => project.id === id);
    
    if(projectExists){
        return res.status(403).json({message:"project id already exists"});
    }

    const project = { id, title, tasks:[] };
    projects.push(project);

    return res.json(projects);
});

//rota para criar tasks
server.post('/projects/:id/tasks/', checkIDParameter, (req,res )=>{
    const {title} = req.body;
    const id = req.id;

    if(!id){
        return res.status(400).json({message:"please provide the id number for the project"});
    }
    if(!title){
        return res.status(400).json({message:"please provide a title number for this task"});
    }

    const project = projects.find(project => project.id === id);

    if(!project){
        return res.status(404).json({message:"project not found"});
    }

    project.tasks.push(title);

    return res.json(project);
});

// rota para listar os projetos e suas tarefas
server.get('/projects', (req,res)=>{
    res.json(projects);
})

// rota para deletar projetos
server.delete('/projects/:id', checkIDParameter, (req,res) => {
    const id = req.id

    const project = projects.find(project => project.id === id);
    
    if(!project){
        return res.status(404).json({message:"project not found"})
    }
    
    const projectIndex = projects.findIndex(project => project.id === id);

    projects.splice(projectIndex,1);
    
    return res.json(projects);
})

server.listen(3000);