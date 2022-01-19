const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = getUserByUsername(username);

  if (user) {
    request.user = user;
    return next();
  } else {
    return response.json({ message: "username doesn't exist" });
  }
}

function checksExistsUserAccountForAddUser(request, response, next) {
  const { username } = request.body;
  const usernameExists = !!getUserByUsername(username);

  if (usernameExists) {
    return response.status(400).json({ error: "username already exists" });
  } else {
    return next();
  }
}

function createNewUser() {
  return {
    id: uuidv4(),
    name: this.name,
    username: this.username,
    todos: [],
  };
}

function getUserByUsername(username) {
  return users.find((user) => user.username === username);
}

function createNewTodo() {
  return {
    id: uuidv4(),
    title: this.title,
    done: false,
    deadline: new Date(this.deadline),
    created_at: new Date(),
  };
}

function updateTodo(currentTodo) {
  currentTodo.title = this.newTitle;
  currentTodo.deadline = new Date(this.newDeadline);
  return currentTodo;
}

function findUserTodoById(id) {
  return this.todos.find((todo) => todo.id === id);
}

function removeUserTodo(userTodoToBeRemoved) {
  indexOfUserTodo = this.todos.indexOf(userTodoToBeRemoved);
  this.todos.splice(indexOfUserTodo, 1);
  return userTodoToBeRemoved;
}

// ----Cria novo usuário----
app.post("/users", checksExistsUserAccountForAddUser, (request, response) => {
  const newUser = createNewUser.call(request.body);
  users.push(newUser);

  return response.status(201).json(newUser);
});
// -------------------------

// ----Retorna as tarefas de um usuário----
app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const userTodos = user.todos;

  return response.json(userTodos);
});
// ----------------------------------------

// ----Adiciona um tarefa ao usuário----
app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const userNewTodo = createNewTodo.call({ title, deadline });
  user.todos.push(userNewTodo);

  return response.status(201).json(userNewTodo);
});
// -------------------------------------

// ----Altera a tarefa do usuário----
app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title: newTitle, deadline: newDeadline } = request.body;
  const { id } = request.params;

  const currentTodo = findUserTodoById.call(user, id);
  if (currentTodo) {
    const updatedTodo = updateTodo.call({ newTitle, newDeadline }, currentTodo);

    return response.json({
      deadline: updatedTodo.deadline,
      done: updatedTodo.done,
      title: updatedTodo.title,
    });
  } else {
    return response.status(404).json({ error: "Todo not found" });
  }
});
// ----------------------------------

// ----Altera a tarefa de um usuário para 'done:true'----
app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const userTodo = findUserTodoById.call(user, id);
  const userTodoExists = !!userTodo;

  if (userTodoExists) {
    userTodo.done = true;
    return response.json(userTodo);
  } else {
    return response.status(404).json({ error: "Todo not found" });
  }
});
// ------------------------------------------------------

// ----Exclui a tarefa do usuário----
app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const userTodoToBeRemoved = findUserTodoById.call(user, id);
  const userTodoToBeRemovedExists = !!userTodoToBeRemoved;

  if (userTodoToBeRemovedExists) {
    removeUserTodo.call(user, userTodoToBeRemoved);
    return response.status(204).json();
  } else {
    return response.status(404).json({ error: "Todo not found" });
  }
});
// ----------------------------------

module.exports = app;
