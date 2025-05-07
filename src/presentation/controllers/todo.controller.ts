import { Request, Response } from 'express';

//* Mock data
const todos: Todo[] = [
  { id: 1, title: 'Todo 1', completed: false, createdAt: new Date(), completedAt: null },
  { id: 2, title: 'Todo 2', completed: false, createdAt: new Date(), completedAt: null },
  { id: 3, title: 'Todo 3', completed: false, createdAt: new Date(), completedAt: null },
];

//* Interfaces
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

//* Controller
export class TodoController {
  //* DI
  constructor() {
  }

  public getTodos = (req: Request, res: Response) => {
    return res.json(todos);
  }

  public getTodoById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: `ID argument is not valid` });
    }

    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }
    return res.json(todo);
  }

  public createTodo = (req: Request, res: Response) => {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const newTodo = {
      id: todos.length + 1,
      title,
      completed: false,
      createdAt: new Date(),
      completedAt: null,
    };
    todos.push(newTodo);
    return res.status(201).json(newTodo);
  }

  public updateTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: `ID argument is not valid` });
    }

    const todo = todos.find(todo => todo.id === id);
    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }

    const { title, completed } = req.body;
    if (title) {
      todo.title = title;
    }
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: `Completed argument is not valid` });
      }
      todo.completed = completed;
      if (completed) {
        todo.completedAt = todo.completedAt || new Date();
      } else {
        todo.completedAt = null;
      }
    }
    return res.json(todo);
  }

  public deleteTodo = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: `ID argument is not valid` });
    }

    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }
    todos.splice(todoIndex, 1);
    return res.status(204).send();
  }
}