import { IUserDocument } from "../models/userModel"; // Adjust the import path if necessary

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument; // Add the user property
    }
  }
}
