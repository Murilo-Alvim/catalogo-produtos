import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import ConfirmModal from '../components/ConfirmModal';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmId, setConfirmId] = useState(null); // id do produto a deletar

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

  const handleSubmit = async (form) => {
    setFormLoading(true);
    try {
      if (editingProduct) {
        const { data } = await api.put(`/api/products/${editingProduct.id}`, form);
        setProducts(products.map((p) => (p.id === data.id ? data : p)));
        toast.success('Produto atualizado!');
      } else {
        const { data } = await api.post('/api/products', form);
        setProducts([data, ...products]);
        toast.success('Produto criado!');
      }
      closeForm();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao salvar produto');
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE — chamado após confirmação no modal
  const handleDelete = async () => {
    try {
      await api.delete(`/api/products/${confirmId}`);
      setProducts(products.filter((p) => p.id !== confirmId));
      toast.success('Produto deletado!');
    } catch (err) {
      toast.error('Erro ao deletar produto');
    } finally {
      setConfirmId(null); // fecha o modal
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
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

        {loading ? (
          <div className="text-center text-gray-400 py-20">Carregando produtos...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-5xl mb-4">📦</p>
            <p className="text-lg font-medium">Nenhum produto ainda</p>
            <p className="text-sm mt-1">Clique em "Novo Produto" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={(id) => setConfirmId(id)} // abre o modal de confirmação
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal de criar/editar produto */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          loading={formLoading}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {confirmId && (
        <ConfirmModal
          message="Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  );
}