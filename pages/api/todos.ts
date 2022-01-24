/* eslint-disable import/no-anonymous-default-export */
import { Todo } from '../../types/todo';
import { HttpException } from '../../types/http-exception';
import { NextApiRequest, NextApiResponse } from 'next';

const todos: Todo[] = [
  { id: 1, title: 'hoge', completed: false },
  { id: 2, title: 'moge', completed: true },
];

let id = 2;

export default (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      {
        if (!req.query.completed) {
          return res.json(todos);
        }

        const completed = req.query.completed === 'true';
        res.json(todos.filter((todo) => todo.completed === completed));
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

        const todo: Todo = { id: (id += 1), title, completed: false };
        todos.push(todo);

        res.status(201).json(todo);
      }
      break;

    default:
      break;
  }
};
