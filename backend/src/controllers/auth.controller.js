const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// CADASTRO de novo usuário
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o e-mail já existe
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    // Criptografa a senha com bcrypt (custo 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o usuário no banco
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Gera o token JWT com validade de 7 dias
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar usuário' });
  }
};

// LOGIN de usuário existente
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Busca o usuário pelo e-mail
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Compara a senha enviada com o hash salvo
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

module.exports = { register, login };
