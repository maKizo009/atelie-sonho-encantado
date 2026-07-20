import React from 'react';

export interface CardProdutoProps {
  nome: string;
  preco: number;
  imagem: string;
  tag3D: boolean;
}

export const CardProduto: React.FC<CardProdutoProps> = ({ nome, preco, imagem, tag3D }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-stone-100/80 flex flex-col h-full relative group">
      {tag3D && (
        <span className="absolute top-4 left-4 bg-musgo-profundo/90 backdrop-blur-sm text-blush-aveia text-xs font-semibold tracking-wide px-3 py-1.5 rounded-full z-10 flex items-center gap-1.5 shadow-sm">
          <span className="text-[10px]">📦</span> 3D Print
        </span>
      )}
      
      <div className="aspect-[4/3] w-full overflow-hidden bg-stone-50 relative">
        <img 
          src={imagem} 
          alt={nome} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-musgo-profundo mb-2 line-clamp-2 leading-snug group-hover:text-abacate-suave-dark transition-colors duration-300">
            {nome}
          </h3>
          <p className="text-xl font-bold text-marrom-cafe">
            R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>

        <button 
          className="mt-5 w-full bg-abacate-suave hover:bg-abacate-suave-dark text-white font-display font-medium py-3 px-4 rounded-2xl transition-all duration-300 shadow-sm shadow-abacate-suave/25 active:scale-[0.98] flex items-center justify-center gap-2"
          onClick={() => alert(`Adicionado ao carrinho: ${nome}`)}
        >
          <span>🛒</span> Comprar
        </button>
      </div>
    </div>
  );
};
