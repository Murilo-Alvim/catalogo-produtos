const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

const app = express();

// Permite requisições do frontend (ajuste a origem no deploy)
app.use(cors());

// Interpreta JSON no corpo das requisições
app.use(express.json());

// Registra as rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota de healthcheck (útil pro Render saber que o servidor está vivo)
app.get('/', (req, res) => res.send('API rodando!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
