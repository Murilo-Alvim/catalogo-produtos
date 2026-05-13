// Importa o Pool do driver pg para gerenciar conexões com o banco
const { Pool } = require('pg');
require('dotenv').config();

// Cria o pool de conexões usando a URL do .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // necessário para o Neon
});

module.exports = pool;
