import { NextFunction as Next, Request, Response } from 'express';

export const catchAsync = (fn: any) => (req: Request, res: Response, next: Next) => {
  fn(req, res, next).catch(next);
};
