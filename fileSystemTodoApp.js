const express = require('express');
const fs = require('fs'); // Required for file operations
const path = require('path'); // To ensure we can resolve the file path
const app = express();
const PORT = 3001;

// Middleware to parse JSON body
app.use(express.json());

// File path for todos.json
const todosFilePath = path.join(__dirname, 'todos.json');

// Helper function to read todos from the JSON file
const readTodosFromFile = () => {
    const data = fs.readFileSync(todosFilePath, 'utf-8');
    return JSON.parse(data); // Parse and return the todos as an array
};

// Helper function to write todos to the JSON file
const writeTodosToFile = (todos) => {
    fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2)); // Write to file with formatting
};

// GET route to fetch all todos
app.get('/todos', (req, res) => {
    const todos = readTodosFromFile();
    res.json(todos); // Send the todos as JSON response
});

// POST route to add a new todo
app.post('/todos', (req, res) => {
    const newTodo = req.body;
    let todos = readTodosFromFile();

    // Check if the new todo has an ID, if not, generate a new one
    if (!newTodo.id) {
        const maxId = todos.reduce((max, todo) => (todo.id > max ? todo.id : max), 0);
        newTodo.id = maxId + 1; // Assign the next ID
    }

    // Add the new todo to the array
    todos.push(newTodo);

    // Write the updated list of todos back to the file
    writeTodosToFile(todos);

    // Respond with the newly created todo
    res.status(201).json(newTodo);
});

// PUT route to update a todo
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const updatedTodo = req.body;

    const todos = readTodosFromFile();
    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    // Update the todo
    todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };
    writeTodosToFile(todos); // Write updated todos back to the file

    res.json(todos[todoIndex]); // Return the updated todo
});

// DELETE route to delete a todo
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    const todos = readTodosFromFile();

    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

    if (todoIndex === -1) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    // Remove the todo
    const removedTodo = todos.splice(todoIndex, 1);
    writeTodosToFile(todos); // Write updated todos back to the file

    res.json(removedTodo); // Return the deleted todo
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
