import { Request } from "express";
import * as core from "express-serve-static-core";

export interface RequestWithUser extends Request {
  user?: any | null;
}

export interface GenericRequestWithUser<
  P extends core.Params = core.ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = core.Query
> extends core.Request<P, ResBody, ReqBody, ReqQuery> {
  user?: any | null;
}
