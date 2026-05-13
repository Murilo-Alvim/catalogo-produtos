const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/product.controller');

// Todas as rotas de produto exigem autenticação (middleware auth)
router.get('/', auth, getProducts);           // GET    /api/products
router.get('/:id', auth, getProductById);     // GET    /api/products/:id
router.post('/', auth, createProduct);        // POST   /api/products
router.put('/:id', auth, updateProduct);      // PUT    /api/products/:id
router.delete('/:id', auth, deleteProduct);   // DELETE /api/products/:id

module.exports = router;
