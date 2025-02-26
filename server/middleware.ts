
import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];
  
  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: "Forbidden" });
  }

  next();
}
