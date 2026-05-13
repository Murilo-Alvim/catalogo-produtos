const jwt = require('jsonwebtoken');

// Middleware que protege rotas privadas
// Verifica se o token JWT é válido antes de permitir o acesso
const authMiddleware = (req, res, next) => {
  // Pega o token do header Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // injeta o id do usuário na requisição
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
