import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.headers['access-token'] as string;

  if (!accessToken) {
    return res.status(401).json({ auth: false, error: 'User is not Authenticated' });
  }

  try {
    const verifiedJWT = verify(accessToken, process.env.JWT_SECRET as string);
    if (verifiedJWT) {
      return next();
    }
  } catch (error) {
    return res.status(400).json({ auth: false, error: error });
  }
};
