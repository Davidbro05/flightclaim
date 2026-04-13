declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds: string | number): Promise<string>;
  export function compare(data: string, encrypted: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
  export function hashSync(data: string, saltOrRounds: string | number): string;
  export function compareSync(data: string, encrypted: string): boolean;
}

declare module 'express-ejs-layouts' {
  import type { RequestHandler } from 'express';
  const ejsLayouts: RequestHandler;
  export = ejsLayouts;
}
