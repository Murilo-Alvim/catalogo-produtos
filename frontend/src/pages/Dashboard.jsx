import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';

export default function Dashboard() {
  const [products, setProducts] = useState([]);       // lista de produtos
  const [loading, setLoading] = useState(true);       // loading inicial
  const [formLoading, setFormLoading] = useState(false); // loading do formulário
  const [showForm, setShowForm] = useState(false);    // exibe ou não o modal
  const [editingProduct, setEditingProduct] = useState(null); // produto em edição

  // READ — Busca os produtos ao carregar a página
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/api/products');
      setProducts(data);
    } catch (err) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  // CREATE ou UPDATE — Decide qual operação fazer com base em editingProduct
  const handleSubmit = async (form) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        // UPDATE
        const { data } = await api.put(`/api/products/${editingProduct.id}`, form);
        // Atualiza o produto na lista sem precisar buscar tudo novamente
        setProducts(products.map((p) => (p.id === data.id ? data : p)));
        toast.success('Produto atualizado!');
      } else {
        // CREATE
        const { data } = await api.post('/api/products', form);
        setProducts([data, ...products]); // adiciona no início da lista
        toast.success('Produto criado!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar produto');
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE — Remove o produto pelo ID
  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p.id !== id)); // remove da lista local
      toast.success('Produto deletado!');
    } catch (err) {
      toast.error('Erro ao deletar produto');
    }
  };

  // Abre o formulário em modo de edição
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Fecha e reseta o formulário
  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Cabeçalho da página */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Meus Produtos</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {products.length} produto{products.length !== 1 ? 's' : ''} cadastrado{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition text-sm"
          >
            + Novo Produto
          </button>
        </div>

        {/* Estado de carregamento */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Carregando produtos...</div>
        ) : products.length === 0 ? (
          // Estado vazio
          <div className="text-center text-gray-400 py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg font-medium">Nenhum produto ainda</p>
            <p className="text-sm mt-1">Clique em "Novo Produto" para começar</p>
          </div>
        ) : (
          // Grade de produtos
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal do formulário (create/edit) */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          loading={formLoading}
        />
      )}
    </div>
  );
}
