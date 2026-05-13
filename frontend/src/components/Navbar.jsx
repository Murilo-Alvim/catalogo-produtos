import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Você saiu da conta');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* Ícone simples de produto */}
        <span className="text-indigo-600 text-xl">📦</span>
        <h1 className="text-lg font-bold text-gray-800">Catálogo de Produtos</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Nome do usuário logado */}
        <span className="text-sm text-gray-500 hidden sm:block">
          Olá, <span className="font-medium text-gray-700">{user?.name}</span>
        </span>

        <button
          onClick={handleLogout}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition"
        >
          Sair
        </button>
      </div>
    </nav>
  );
}
