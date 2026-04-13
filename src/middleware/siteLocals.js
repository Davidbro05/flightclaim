const db = require('../db');

let navCache = null;
let navCacheTime = 0;

async function getNavItems() {
  if (navCache && Date.now() - navCacheTime < 60_000) return navCache;
  navCache = await db('nav_items').orderBy('sort_order').select();
  navCacheTime = Date.now();
  return navCache;
}

module.exports = async function siteLocals(req, res, next) {
  res.locals.siteUrl     = process.env.SITE_URL || 'https://flightclaim.se';
  res.locals.siteName    = 'FlightClaim';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.assetVersion = process.env.npm_package_version || '1';
  res.locals.currentPath  = req.path;
  try {
    res.locals.navItems = await getNavItems();
  } catch {
    res.locals.navItems = [];
  }
  next();
};
