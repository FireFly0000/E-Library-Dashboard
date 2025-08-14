import { Request } from "express";

export interface RequestHasLogin extends Request {
  user_id?: number;
}
