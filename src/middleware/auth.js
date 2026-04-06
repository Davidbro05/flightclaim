const basicAuth = require('basic-auth');
const bcrypt = require('bcryptjs');

const authenticate = async (req, res, next) => {
  const credentials = basicAuth(req);
  const validUser = process.env.ADMIN_USER || 'admin';

  if (!credentials || credentials.name !== validUser) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Åtkomst nekad – du måste logga in.');
  }

  const passHash = process.env.ADMIN_PASS_HASH;
  const valid = passHash
    ? await bcrypt.compare(credentials.pass, passHash)
    : credentials.pass === (process.env.ADMIN_PASS || 'hemligt');

  if (!valid) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin"');
    return res.status(401).send('Åtkomst nekad – du måste logga in.');
  }

  next();
};

module.exports = authenticate;
