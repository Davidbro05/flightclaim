import type { Request, Response, NextFunction } from 'express';
import db from '../db';
import type { NavItem } from '../types';

let navCache: NavItem[] | null = null;
let navCacheTime = 0;

async function getNavItems(): Promise<NavItem[]> {
  if (navCache && Date.now() - navCacheTime < 60_000) return navCache;
  navCache = await db('nav_items').orderBy('sort_order').select<NavItem[]>();
  navCacheTime = Date.now();
  return navCache;
}

export default async function siteLocals(req: Request, res: Response, next: NextFunction): Promise<void> {
  res.locals.siteUrl      = process.env.SITE_URL ?? 'https://flightclaim.se';
  res.locals.siteName     = 'FlightClaim';
  res.locals.currentYear  = new Date().getFullYear();
  res.locals.assetVersion = process.env.npm_package_version ?? '1';
  res.locals.currentPath  = req.path;
  try {
    res.locals.navItems = await getNavItems();
  } catch {
    res.locals.navItems = [];
  }
  next();
}
