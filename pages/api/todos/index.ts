/* eslint-disable import/no-anonymous-default-export */
import { Todo } from '../../../types/todo';
import { HttpException } from '../../../types/http-exception';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      {
        if (!req.query.completed) {
          const todos: Todo[] = await prisma.todo.findMany();
          return res.json(todos);
        }

        const completed: boolean = req.query.completed === 'true';
        const todos: Todo[] = await prisma.todo.findMany({
          where: {
            completed: completed,
          },
        });
        res.json(todos);
      }
      break;

    case 'POST':
      {
        const { title } = req.body;
        if (typeof title !== 'string' || !title) {
          const err = new HttpException(400, 'title is required');
          console.error(err);
          throw err;
        }

        const todo = await prisma.todo.create({
          data: {
            title: title,
            completed: false,
          },
        });

        res.status(201).json(todo);
      }
      break;

    default:
      break;
  }
};
