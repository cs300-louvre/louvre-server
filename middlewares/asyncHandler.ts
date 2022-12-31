import { Response } from 'express';
import { RequestWithUser } from '../utils/requestWithUser';

// automatically catch errors in async functions
const asyncHandler = (fn: any) => (req: RequestWithUser, res: Response, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
