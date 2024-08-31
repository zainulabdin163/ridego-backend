import { IUserDocument } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument;
    }
  }
}
