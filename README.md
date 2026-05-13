# 📦 Catálogo de Produtos — Full Stack

Stack: React + Vite • Node.js + Express • PostgreSQL (Neon) • JWT • bcrypt • TailwindCSS

---

## 🚀 Como rodar localmente

### 1. Clone ou abra a pasta no VSCode

### 2. Configure o banco (Neon)
- Acesse [neon.tech](https://neon.tech), crie um projeto
- No SQL Editor, execute o conteúdo de `backend/schema.sql`
- Copie a connection string

### 3. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com sua DATABASE_URL e JWT_SECRET
npm run dev
```

### 4. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Edite VITE_API_URL=http://localhost:3000
npm run dev
```

Acesse: http://localhost:5173

---

## 📁 Estrutura

```
catalogo-produtos/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # Conexão PostgreSQL
│   │   ├── middleware/auth.js     # Middleware JWT
│   │   ├── routes/                # Rotas auth e products
│   │   ├── controllers/           # Lógica de negócio
│   │   └── app.js                 # Entry point Express
│   ├── schema.sql                 # Criação das tabelas
│   └── .env.example
│
└── frontend/
    └── src/
        ├── context/AuthContext.jsx  # Sessão com localStorage
        ├── services/api.js          # Axios + interceptor JWT
        ├── pages/                   # Login, Register, Dashboard
        └── components/              # Navbar, ProductCard, ProductForm
```

---

## 🌐 Deploy

| Serviço | Uso |
|---------|-----|
| **Vercel** | Frontend (conecte o repositório) |
| **Render** | Backend (Web Service, `npm start`) |
| **Neon** | Banco PostgreSQL na nuvem |

No Render, configure as variáveis de ambiente (`DATABASE_URL` e `JWT_SECRET`).  
Na Vercel, configure `VITE_API_URL` com a URL do Render.

---

## 🔐 Endpoints da API

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |

### Produtos (protegidas por JWT)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/products` | Listar todos |
| GET | `/api/products/:id` | Buscar por ID |
| POST | `/api/products` | Criar |
| PUT | `/api/products/:id` | Atualizar |
| DELETE | `/api/products/:id` | Deletar |
