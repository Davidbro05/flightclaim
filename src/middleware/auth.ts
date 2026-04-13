import basicAuth from 'basic-auth';
import bcrypt from 'bcryptjs';
import type { Request, Response, NextFunction } from 'express';

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const credentials = basicAuth(req);
  const validUser = process.env.ADMIN_USER ?? 'admin';

  if (!credentials || credentials.name !== validUser) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
    res.status(401).send('Åtkomst nekad – du måste logga in.');
    return;
  }

  const passHash = process.env.ADMIN_PASS_HASH;
  const valid = passHash
    ? await bcrypt.compare(credentials.pass, passHash)
    : credentials.pass === (process.env.ADMIN_PASS ?? 'hemligt');

  if (!valid) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
    res.status(401).send('Åtkomst nekad – du måste logga in.');
    return;
  }

  next();
};

export default authenticate;
