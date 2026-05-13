// Exibe as informações de um produto e os botões de editar e deletar
export default function ProductCard({ product, onEdit, onDelete }) {
  // Formata o preço em Real brasileiro
  const priceFormatted = Number(product.price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      {/* Imagem do produto (fallback se não tiver URL) */}
      <img
        src={product.image_url || 'https://placehold.co/400x200?text=Sem+Imagem'}
        alt={product.name}
        className="w-full h-44 object-cover"
        onError={(e) => { e.target.src = 'https://placehold.co/400x200?text=Sem+Imagem'; }}
      />

      <div className="p-4">
        {/* Categoria */}
        {product.category && (
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
        )}

        {/* Nome */}
        <h3 className="mt-2 font-semibold text-gray-800 text-base leading-tight">{product.name}</h3>

        {/* Descrição resumida */}
        {product.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        )}

        {/* Preço e estoque */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">{priceFormatted}</span>
          <span className="text-xs text-gray-400">Estoque: {product.stock}</span>
        </div>

        {/* Ações: editar e deletar */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-1.5 rounded-lg transition"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="flex-1 text-sm bg-red-50 hover:bg-red-100 text-red-600 font-medium py-1.5 rounded-lg transition"
          >
            Deletar
          </button>
        </div>
      </div>
    </div>
  );
}
