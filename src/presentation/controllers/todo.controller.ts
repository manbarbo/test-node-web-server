import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import {CreateTodoDto, UpdateTodoDto} from '../../domain/dtos';

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

  public getTodos = async (req: Request, res: Response) => {
    const todos = await prisma.todo.findMany();
    return res.json(todos);
  }

  public getTodoById = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: `ID argument is not valid` });
    }

    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }
    return res.json(todo);
  }

  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const todo = await prisma.todo.create({
      data: createTodoDto!
    });

    return res.status(201).json(todo);
  }

  public updateTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if ( isNaN(id) || id <= 0 ) {
      return res.status(400).json({ message: `ID argument is not valid` });
    }

    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }

    const completedAt = todo.completedAt;
    const [ error, updateTodoDto ] = UpdateTodoDto.create( { ...req.body, id, completedAt } );

    if (error) {
      return res.status(400).json({ error });
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: updateTodoDto!.values
    });

    return res.json(updatedTodo);
  }

  public deleteTodo = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ message: `ID argument is not valid` });
    }

    const todo = await prisma.todo.findFirst({ where: { id } });
    if (!todo) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }
    const deleted = await prisma.todo.delete({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ message: `Todo with id ${id} not found` });
    }
    return res.status(204).json({ todo, deleted });
  }
}