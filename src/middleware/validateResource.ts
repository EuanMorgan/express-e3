import {z, type AnyZodObject} from 'zod';
import type {Request, Response, NextFunction} from 'express';
const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).send(error.errors);
      }

      return res.status(500).send('Something went wrong');
    }
  };

export default validate;
