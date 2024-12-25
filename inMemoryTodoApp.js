const express = require("express");
const app = express();
const PORT = 3000;

//middleware to parse JSON
app.use(express.json());

// in-memory storage for todos
let todos = [];

//routes

//1. get all todos

app.get("/todos",(req, res) => {
    res.json(todos);
})

//2. add a new todo

app.post("/todos", (req, res) => {
    const {title} = req.body;
    if (!title) {
        return res.status(400).json({error: "Title is required"});
    }
    const newTodo = { id: todos.length + 1, title, completed: false};
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

//3. update a todo
app.put("/todos/:id", (req, res) =>{
    const {id} = req.params;
    const {title, completed} = req.body;

    const todo = todos.find((todo) => todo.id === parseInt(id));
    if (!todo){
        return res.status(404).json({ error: "Todo not found"});
    }
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;

    res.json(todo);
});

//4. Delete a todo

app.delete("/todos/:id", (req, res) =>{
    const {id } = req.params;
    const index = todos.findIndex((todo) => todo.id === parseInt(id));
    
    if (index === -1) {
        return res.status(404).json({ error: "Todo not found"});
    }
    todos.splice(index,1);
    res.status(204).send();
});

//start the server
app.listen(PORT, () =>{
    console.log('Server is running on http://localhost:$(PORT');
});
