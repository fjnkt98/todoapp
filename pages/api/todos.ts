/* eslint-disable import/no-anonymous-default-export */
import { Todo } from '../../types/todo';
import { NextApiRequest, NextApiResponse } from 'next';

const todos: Todo[] = [
  { id: 1, title: 'hoge', completed: false },
  { id: 2, title: 'moge', completed: true },
];

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query.completed) {
    return res.json(todos);
  }

  const completed = req.query.completed === 'true';
  res.json(todos.filter((todo) => todo.completed === completed));
};
