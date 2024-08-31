import { NextFunction, Request, Response } from "express";

const CatchAsync = (func: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    func(req, res, next).catch(next);
  };
};

export { CatchAsync };
