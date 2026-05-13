const pool = require('../config/db');

// READ — Lista todos os produtos do usuário autenticado
const getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

// READ — Busca um produto pelo ID (verifica se pertence ao usuário)
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

// CREATE — Cria um novo produto vinculado ao usuário
const createProduct = async (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO products (user_id, name, description, price, category, image_url, stock)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.userId, name, description, price, category, image_url, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// UPDATE — Atualiza um produto existente do usuário
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image_url, stock } = req.body;
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, category=$4,
       image_url=$5, stock=$6 WHERE id=$7 AND user_id=$8 RETURNING *`,
      [name, description, price, category, image_url, stock, id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// DELETE — Remove um produto do usuário
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
