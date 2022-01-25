import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const idNumber = parseInt(String(id));

  switch (req.method) {
    case 'PUT': {
      const targetTodo = await prisma.todo.findUnique({
        where: {
          id: idNumber,
        },
      });

      const updatedTodo = await prisma.todo.update({
        where: {
          id: idNumber,
        },
        data: {
          completed: !targetTodo?.completed,
        },
      });

      res.status(201).json(updatedTodo);

      break;
    }
    case 'DELETE': {
      await prisma.todo.delete({
        where: {
          id: idNumber,
        },
      });

      res.status(204);
      res.end();

      break;
    }
  }
}
