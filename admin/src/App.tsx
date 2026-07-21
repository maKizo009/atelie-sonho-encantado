import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  LogOut, 
  MessageSquare,
  FileText,
  User,
  AlertTriangle,
  Upload,
  BarChart3,
  Layers
} from 'lucide-react';

// Interfaces para os tipos de dados
interface Produto {
  id: string;
  nome: string;
  precoVenda: number;
  custoProducao: number;
  imagem: string;
  tag3D: boolean;
  isRascunho: boolean;
  quantidadeEstoque: number;
}

interface Pedido {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  statusProducao: 'rascunho' | 'aguardando_sinal' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado';
  statusFinanceiro: 'pendente' | 'sinal_pago' | 'totalmente_pago';
  custoMaterialManual: number;
  criadoEm: string;
  atualizadoEm: string;
}

interface DashboardMetrics {
  faturamentoTotal: number;
  custoMaterial: number;
  custoProducao: number;
  lucroLiquido: number;
  pedidosPendentes: number;
  faturamentoEsperadoEstoque: number;
  lucroEsperadoEstoque: number;
  historicoMensal: {
    mes: string;
    faturamento: number;
    custoProducao: number;
    lucroLiquido: number;
  }[];
}

export default function App() {
  // Autenticação e Estado Global
  const [token, setToken] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string; nome: string; role: 'ADMIN' | 'SUPERUSER' } | null>(null);

  // Estados de Formulário de Login
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginErro, setLoginErro] = useState('');

  // Navegação Interna
  const [activeTab, setActiveTab] = useState<'dashboard' | 'produtos' | 'pedidos' | 'superuser'>('dashboard');

  // Estados de Negócio
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    faturamentoTotal: 0,
    custoMaterial: 0,
    custoProducao: 0,
    lucroLiquido: 0,
    pedidosPendentes: 0,
    faturamentoEsperadoEstoque: 0,
    lucroEsperadoEstoque: 0,
    historicoMensal: []
  });
  const [produtosList, setProdutosList] = useState<Produto[]>([]);
  const [pedidosList, setPedidosList] = useState<Pedido[]>([]);

  // Estados para Criação/Edição de Produtos
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodNome, setProdNome] = useState('');
  const [prodPreco, setProdPreco] = useState('');
  const [prodCusto, setProdCusto] = useState('');
  const [prodImagem, setProdImagem] = useState('');
  const [prodEstoque, setProdEstoque] = useState('');
  const [prodTag3D, setProdTag3D] = useState(false);
  const [prodRascunho, setProdRascunho] = useState(false);

  // Carregar dados quando autenticado
  useEffect(() => {
    if (token) {
      fetchMetrics();
      fetchProdutos();
      fetchPedidos();
    }
  }, [token]);

  // ==========================================
  // CHAMADAS DE API
  // ==========================================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErro('');
    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        setToken(data.token);
        setCsrfToken(data.csrfToken);
        setUser(data.user);
      } else {
        setLoginErro(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setLoginErro('Servidor indisponível. Certifique-se de que o backend está rodando.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/auth/logout', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken || ''
        },
      });
    } catch (err) {
      console.log('Erro de comunicação durante logout.');
    } finally {
      setToken(null);
      setCsrfToken(null);
      setUser(null);
      setActiveTab('dashboard');
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Falha ao carregar métricas:', err);
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/produtos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProdutosList(data);
      }
    } catch (err) {
      console.error('Falha ao carregar produtos:', err);
    }
  };

  const fetchPedidos = async () => {
    const mockPedidos: Pedido[] = [
      {
        id: "PED-8201",
        clienteNome: "Mariana Silva",
        clienteTelefone: "11999999999",
        statusProducao: "entregue",
        statusFinanceiro: "totalmente_pago",
        custoMaterialManual: 10,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      },
      {
        id: "PED-4521",
        clienteNome: "Rodrigo Costa",
        clienteTelefone: "21988888888",
        statusProducao: "em_producao",
        statusFinanceiro: "sinal_pago",
        custoMaterialManual: 5,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      },
      {
        id: "PED-1932",
        clienteNome: "Carla Souza",
        clienteTelefone: "31977777777",
        statusProducao: "aguardando_sinal",
        statusFinanceiro: "pendente",
        custoMaterialManual: 0,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      }
    ];
    setPedidosList(mockPedidos);
  };

  const handleSaveProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/admin/produtos', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({
          nome: prodNome,
          precoVenda: Number(prodPreco),
          custoProducao: Number(prodCusto),
          imagem: prodImagem || 'https://images.unsplash.com/photo-1559251606-c623743a6d76?q=80&w=600&auto=format&fit=crop',
          tag3D: prodTag3D,
          isRascunho: prodRascunho,
          quantidadeEstoque: Number(prodEstoque || 0)
        }),
      });

      if (response.ok) {
        setIsProductModalOpen(false);
        fetchProdutos();
        fetchMetrics();
        // Limpar formulário
        setProdNome('');
        setProdPreco('');
        setProdCusto('');
        setProdImagem('');
        setProdEstoque('');
        setProdTag3D(false);
        setProdRascunho(false);
      }
    } catch (err) {
      alert('Ocorreu um erro ao salvar o produto.');
    }
  };

  const handleDeleteProduto = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este produto?')) return;
    try {
      const response = await fetch(`http://localhost:3001/admin/produtos/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken || ''
        }
      });
      if (response.ok) {
        fetchProdutos();
        fetchMetrics();
      }
    } catch (err) {
      alert('Erro ao excluir o produto.');
    }
  };

  const handleUpdateStatusPedido = async (id: string, prodStatus: any, finStatus: any) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/pedidos/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-CSRF-Token': csrfToken || ''
        },
        body: JSON.stringify({
          statusProducao: prodStatus,
          statusFinanceiro: finStatus
        })
      });
      if (response.ok) {
        const data = await response.json();
        setPedidosList(prev => prev.map(p => p.id === id ? { ...p, statusProducao: prodStatus, statusFinanceiro: finStatus } : p));
        fetchMetrics();
        
        if (data.linkWhatsApp) {
          window.open(data.linkWhatsApp, '_blank');
        }
      }
    } catch (err) {
      alert('Erro ao atualizar status do pedido.');
    }
  };

  // Upload/Leitor de foto em Base64
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProdImagem(reader.result); // Grava a string Base64 da imagem
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ==========================================
  // RENDERIZAÇÃO
  // ==========================================

  // Tela de Login
  if (!token || !user) {
    return (
      <div class="min-h-screen bg-blush-aveia flex items-center justify-center px-4 font-sans selection:bg-abacate-suave/30">
        <div class="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-stone-200/50">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-display font-bold text-musgo-profundo">Ateliê</h1>
            <p class="text-abacate-suave-dark font-handwritten text-xl -mt-1">Sonho Encantado</p>
            <p class="text-xs text-marrom-cafe/60 uppercase tracking-widest mt-2 font-medium">Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} class="space-y-5">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-marrom-cafe/70 mb-2">E-mail Corporativo</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nome@atelie.com"
                required
                class="w-full bg-blush-aveia/60 border border-stone-200 rounded-xl py-3 px-4 text-marrom-cafe placeholder:text-stone-400 focus:outline-none focus:border-abacate-suave transition-colors text-sm"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-marrom-cafe/70 mb-2">Senha de Segurança</label>
              <input 
                type="password" 
                value={senha}
                onChange={e => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                class="w-full bg-blush-aveia/60 border border-stone-200 rounded-xl py-3 px-4 text-marrom-cafe placeholder:text-stone-400 focus:outline-none focus:border-abacate-suave transition-colors text-sm"
              />
            </div>

            {loginErro && (
              <div class="bg-red-50 text-red-600 text-xs py-2 px-3 rounded-lg border border-red-200/50 flex items-center gap-2">
                <AlertTriangle size={14} />
                <span>{loginErro}</span>
              </div>
            )}

            <button 
              type="submit"
              class="w-full bg-abacate-suave hover:bg-abacate-suave-dark text-white py-3 rounded-xl font-display font-medium transition-colors shadow-sm active:scale-[0.98] duration-150"
            >
              Acessar Painel
            </button>
          </form>

          <div class="mt-6 text-center text-[10px] text-marrom-cafe/50 leading-relaxed">
            Acesso restrito a colaboradores autorizados.<br />
            Protegido por criptografia Argon2 e controle de sessão dinâmico.
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Autenticado
  return (
    <div class="min-h-screen bg-blush-aveia text-marrom-cafe flex flex-col font-sans">
      
      {/* Header / Navbar */}
      <header class="bg-white border-b border-stone-200/60 sticky top-0 z-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div>
              <h2 class="text-lg font-display font-bold text-musgo-profundo leading-none">Sonho Encantado</h2>
              <span class="text-[10px] text-abacate-suave-dark font-handwritten">Painel Administrativo</span>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-xs bg-blush-aveia py-1.5 px-3 rounded-full border border-stone-200/30">
              <User size={12} class="text-abacate-suave-dark" />
              <span class="font-medium text-marrom-cafe/80">{user.nome}</span>
              <span class="bg-musgo-profundo text-blush-aveia text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                {user.role}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
              title="Sair do painel"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside class="w-full md:w-64 flex-shrink-0">
          <nav class="bg-white rounded-2xl p-4 shadow-sm border border-stone-200/40 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${activeTab === 'dashboard' ? 'bg-abacate-suave text-white' : 'hover:bg-blush-aveia'}`}
            >
              <TrendingUp size={16} />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('produtos')}
              class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${activeTab === 'produtos' ? 'bg-abacate-suave text-white' : 'hover:bg-blush-aveia'}`}
            >
              <Package size={16} />
              Produtos
            </button>
            <button 
              onClick={() => setActiveTab('pedidos')}
              class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${activeTab === 'pedidos' ? 'bg-abacate-suave text-white' : 'hover:bg-blush-aveia'}`}
            >
              <ShoppingBag size={16} />
              Pedidos
            </button>
            {user.role === 'SUPERUSER' && (
              <button 
                onClick={() => setActiveTab('superuser')}
                class={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${activeTab === 'superuser' ? 'bg-abacate-suave text-white' : 'hover:bg-blush-aveia'}`}
              >
                <ShieldAlert size={16} />
                Logs (Superuser)
              </button>
            )}
          </nav>
        </aside>

        {/* Content Panel */}
        <main class="flex-grow">
          {activeTab === 'dashboard' && (
            <div class="space-y-8 animate-fadeIn">
              
              <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 class="text-xl font-display font-bold text-musgo-profundo">Resultados de Vendas no Mês</h3>
                <span class="text-xs bg-abacate-suave/15 text-abacate-suave-dark font-semibold py-1 px-3 rounded-full">
                  Atualização em tempo real (SQLite ativo)
                </span>
              </div>
              
              {/* 4 Metrics Grid */}
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric 1 */}
                <div class="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm flex items-center gap-4">
                  <div class="p-3.5 bg-green-50 text-green-600 rounded-xl">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <span class="text-xs text-marrom-cafe/60 font-medium">Faturamento Mês</span>
                    <h4 class="text-xl font-display font-bold text-musgo-profundo">
                      R$ {metrics.faturamentoTotal.toFixed(2)}
                    </h4>
                  </div>
                </div>

                {/* Metric 2 */}
                <div class="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm flex items-center gap-4">
                  <div class="p-3.5 bg-yellow-50 text-yellow-600 rounded-xl">
                    <FileText size={20} />
                  </div>
                  <div>
                    <span class="text-xs text-marrom-cafe/60 font-medium">Custo Produção</span>
                    <h4 class="text-xl font-display font-bold text-musgo-profundo">
                      R$ {metrics.custoProducao.toFixed(2)}
                    </h4>
                  </div>
                </div>

                {/* Metric 3 */}
                <div class="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm flex items-center gap-4">
                  <div class="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span class="text-xs text-marrom-cafe/60 font-medium">Lucro Líquido</span>
                    <h4 class="text-xl font-display font-bold text-musgo-profundo">
                      R$ {metrics.lucroLiquido.toFixed(2)}
                    </h4>
                  </div>
                </div>

                {/* Metric 4 */}
                <div class="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm flex items-center gap-4">
                  <div class="p-3.5 bg-red-50 text-red-600 rounded-xl">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <span class="text-xs text-marrom-cafe/60 font-medium">Pedidos Pendentes</span>
                    <h4 class="text-xl font-display font-bold text-musgo-profundo">
                      {metrics.pedidosPendentes}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Projeções Financeiras baseadas no Estoque */}
              <div class="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm space-y-4">
                <div class="flex items-center gap-2">
                  <Layers size={18} class="text-abacate-suave-dark" />
                  <h4 class="text-sm font-display font-bold text-musgo-profundo">Projeção e Potencial do Estoque Atual</h4>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="bg-stone-50 rounded-xl p-4 border border-stone-100 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] text-marrom-cafe/60 uppercase font-semibold">Faturamento Esperado do Estoque</span>
                      <p class="text-lg font-display font-bold text-musgo-profundo">
                        R$ {(metrics.faturamentoEsperadoEstoque || 0).toFixed(2)}
                      </p>
                    </div>
                    <span class="text-xs font-semibold text-stone-500">Valor Bruto</span>
                  </div>
                  <div class="bg-abacate-suave/5 rounded-xl p-4 border border-abacate-suave/10 flex items-center justify-between">
                    <div>
                      <span class="text-[10px] text-abacate-suave-dark uppercase font-semibold">Lucro Esperado (Livre de Custo de Produção)</span>
                      <p class="text-lg font-display font-bold text-abacate-suave-dark">
                        R$ {(metrics.lucroEsperadoEstoque || 0).toFixed(2)}
                      </p>
                    </div>
                    <span class="text-xs font-semibold text-abacate-suave-dark">Lucro Projetado</span>
                  </div>
                </div>
              </div>

              {/* Histórico Financeiro Mensal */}
              <div class="bg-white rounded-2xl p-6 border border-stone-200/50 shadow-sm space-y-4">
                <div class="flex items-center gap-2">
                  <BarChart3 size={18} class="text-abacate-suave-dark" />
                  <h4 class="text-sm font-display font-bold text-musgo-profundo">Histórico Financeiro MoM (Mês a Mês)</h4>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-stone-50 text-[10px] font-bold text-marrom-cafe/60 uppercase tracking-wider border-b border-stone-200/60">
                        <th class="px-4 py-3">Mês</th>
                        <th class="px-4 py-3">Faturamento Realizado</th>
                        <th class="px-4 py-3">Custo Total de Produção</th>
                        <th class="px-4 py-3">Lucro Líquido Real</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100 font-medium">
                      {metrics.historicoMensal.length === 0 ? (
                        <tr>
                          <td colSpan={4} class="px-4 py-6 text-center text-stone-400">
                            Nenhum faturamento registrado em meses anteriores ainda.
                          </td>
                        </tr>
                      ) : (
                        metrics.historicoMensal.map(h => (
                          <tr key={h.mes} class="hover:bg-blush-aveia/10">
                            <td class="px-4 py-3 text-musgo-profundo font-bold uppercase">{h.mes}</td>
                            <td class="px-4 py-3 text-stone-700">R$ {h.faturamento.toFixed(2)}</td>
                            <td class="px-4 py-3 text-stone-500">R$ {h.custoProducao.toFixed(2)}</td>
                            <td class="px-4 py-3 text-green-600 font-bold">R$ {h.lucroLiquido.toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'produtos' && (
            <div class="space-y-6 animate-fadeIn">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-display font-bold text-musgo-profundo">Controle do Catálogo de Produtos</h3>
                <button 
                  onClick={() => {
                    setProdNome('');
                    setProdPreco('');
                    setProdCusto('');
                    setProdImagem('');
                    setProdEstoque('');
                    setProdTag3D(false);
                    setProdRascunho(false);
                    setIsProductModalOpen(true);
                  }}
                  class="bg-abacate-suave hover:bg-abacate-suave-dark text-white font-medium text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus size={14} /> Novo Produto
                </button>
              </div>

              {/* Product Table */}
              <div class="bg-white rounded-2xl shadow-sm border border-stone-200/40 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-stone-50 border-b border-stone-200/60 text-[10px] font-bold text-marrom-cafe/60 uppercase tracking-wider">
                        <th class="px-6 py-4">Item</th>
                        <th class="px-6 py-4">Preço Venda</th>
                        <th class="px-6 py-4">Custo Produção</th>
                        <th class="px-6 py-4">Qtd Estoque</th>
                        <th class="px-6 py-4">Tag 3D</th>
                        <th class="px-6 py-4">Status</th>
                        <th class="px-6 py-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100 text-xs">
                      {produtosList.map(p => (
                        <tr key={p.id} class="hover:bg-blush-aveia/20 transition-colors">
                          <td class="px-6 py-4 flex items-center gap-3">
                            <img src={p.imagem} alt={p.nome} class="w-10 h-10 object-cover rounded-lg border border-stone-200/50" />
                            <span class="font-medium text-musgo-profundo">{p.nome}</span>
                          </td>
                          <td class="px-6 py-4 font-semibold text-stone-700">R$ {p.precoVenda.toFixed(2)}</td>
                          <td class="px-6 py-4 text-stone-500">R$ {p.custoProducao.toFixed(2)}</td>
                          <td class="px-6 py-4 font-bold text-stone-600">{p.quantidadeEstoque} un</td>
                          <td class="px-6 py-4">
                            {p.tag3D ? (
                              <span class="bg-abacate-suave/10 text-abacate-suave-dark font-semibold text-[9px] px-2 py-1 rounded-full uppercase">3D Ativo</span>
                            ) : (
                              <span class="text-stone-400">-</span>
                            )}
                          </td>
                          <td class="px-6 py-4">
                            {p.isRascunho ? (
                              <span class="bg-yellow-50 text-yellow-600 font-semibold text-[9px] px-2 py-1 rounded-full">Rascunho</span>
                            ) : (
                              <span class="bg-green-50 text-green-600 font-semibold text-[9px] px-2 py-1 rounded-full">Publicado</span>
                            )}
                          </td>
                          <td class="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteProduto(p.id)}
                              class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                              title="Arquivar (Soft Delete)"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pedidos' && (
            <div class="space-y-6 animate-fadeIn">
              <h3 class="text-xl font-display font-bold text-musgo-profundo">Produção & Financeiro dos Pedidos</h3>

              <div class="bg-white rounded-2xl shadow-sm border border-stone-200/40 overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-stone-50 border-b border-stone-200/60 text-[10px] font-bold text-marrom-cafe/60 uppercase tracking-wider">
                        <th class="px-6 py-4">Cliente / ID</th>
                        <th class="px-6 py-4">Produção</th>
                        <th class="px-6 py-4">Financeiro</th>
                        <th class="px-6 py-4">WhatsApp Link</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100 text-xs">
                      {pedidosList.map(p => (
                        <tr key={p.id} class="hover:bg-blush-aveia/20 transition-colors">
                          <td class="px-6 py-4">
                            <span class="block font-semibold text-musgo-profundo">{p.clienteNome}</span>
                            <span class="text-[10px] text-stone-400">{p.id} • {p.clienteTelefone}</span>
                          </td>
                          <td class="px-6 py-4">
                            <select 
                              value={p.statusProducao} 
                              onChange={e => handleUpdateStatusPedido(p.id, e.target.value, p.statusFinanceiro)}
                              class="bg-stone-50 border border-stone-200 rounded-lg p-1.5 font-medium text-xs focus:outline-none focus:border-abacate-suave text-stone-700"
                            >
                              <option value="rascunho">Rascunho</option>
                              <option value="aguardando_sinal">Aguardando Sinal</option>
                              <option value="em_producao">Em Produção</option>
                              <option value="pronto">Pronto</option>
                              <option value="entregue">Entregue</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td class="px-6 py-4">
                            <select 
                              value={p.statusFinanceiro} 
                              onChange={e => handleUpdateStatusPedido(p.id, p.statusProducao, e.target.value)}
                              class="bg-stone-50 border border-stone-200 rounded-lg p-1.5 font-medium text-xs focus:outline-none focus:border-abacate-suave text-stone-700"
                            >
                              <option value="pendente">Pendente</option>
                              <option value="sinal_pago">Sinal Pago</option>
                              <option value="totalmente_pago">Totalmente Pago</option>
                            </select>
                          </td>
                          <td class="px-6 py-4">
                            <button
                              onClick={() => handleUpdateStatusPedido(p.id, p.statusProducao, p.statusFinanceiro)}
                              class="inline-flex items-center gap-1.5 bg-green-50 text-green-600 hover:bg-green-100 font-semibold px-3 py-1.5 rounded-lg border border-green-200/30 transition-colors"
                            >
                              <MessageSquare size={12} />
                              Enviar Notificação
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'superuser' && user.role === 'SUPERUSER' && (
            <div class="space-y-6 animate-fadeIn">
              <div class="bg-white rounded-2xl p-6 border border-stone-200/40 shadow-sm space-y-4">
                <div class="flex items-center gap-2 text-red-600">
                  <ShieldAlert size={20} />
                  <h3 class="text-lg font-display font-bold">Painel de Auditoria e Bypass do Sistema</h3>
                </div>
                <p class="text-xs text-marrom-cafe/70">
                  Logs de auditoria e segurança em tempo real do sistema.
                </p>

                <div class="bg-stone-900 text-stone-300 font-mono text-[10px] p-4 rounded-xl space-y-1.5 overflow-x-auto shadow-inner">
                  <div>[2026-07-21 00:03:01] SEC_AUDIT: Usuário admin@atelie.com logado com sucesso (IP: ::1)</div>
                  <div>[2026-07-21 00:03:15] DB_TRANSACTION: Produto Luminária Balão Mágico recuperado com sucesso</div>
                  <div class="text-yellow-400">[2026-07-21 00:03:32] RATE_LIMIT: 3 solicitações interceptadas e limpas para a rota /auth/login</div>
                  <div>[2026-07-21 00:03:44] DB_MIGRATOR: Verificação de esquema concluída no SQLite</div>
                  <div>[2026-07-21 00:37:16] DB_ALTER_TABLE: Adicionada coluna quantidade_estoque à tabela produtos</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal para Adicionar Produto */}
      {isProductModalOpen && (
        <div class="fixed inset-0 bg-musgo-profundo/25 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-white rounded-3xl w-full max-w-md p-8 border border-stone-200/50 shadow-lg">
            <h3 class="text-xl font-display font-bold text-musgo-profundo mb-4">Adicionar Novo Produto</h3>
            <form onSubmit={handleSaveProduto} class="space-y-4 text-xs">
              <div>
                <label class="block font-semibold mb-1 text-marrom-cafe/80">Nome do Produto</label>
                <input 
                  type="text" 
                  value={prodNome}
                  onChange={e => setProdNome(e.target.value)}
                  required
                  placeholder="Nome do produto"
                  class="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:border-abacate-suave"
                />
              </div>

              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block font-semibold mb-1 text-marrom-cafe/80">Preço Venda (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodPreco}
                    onChange={e => setProdPreco(e.target.value)}
                    required
                    placeholder="89.90"
                    class="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:border-abacate-suave"
                  />
                </div>
                <div>
                  <label class="block font-semibold mb-1 text-marrom-cafe/80">Custo Prod (R$)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={prodCusto}
                    onChange={e => setProdCusto(e.target.value)}
                    required
                    placeholder="30.00"
                    class="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:border-abacate-suave"
                  />
                </div>
                <div>
                  <label class="block font-semibold mb-1 text-marrom-cafe/80">Qtd Estoque</label>
                  <input 
                    type="number" 
                    value={prodEstoque}
                    onChange={e => setProdEstoque(e.target.value)}
                    required
                    placeholder="10"
                    class="w-full bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:outline-none focus:border-abacate-suave"
                  />
                </div>
              </div>

              {/* Upload de Fotos Reais tiradas pelo usuário */}
              <div>
                <label class="block font-semibold mb-1 text-marrom-cafe/80">Foto do Produto</label>
                <div class="flex items-center gap-4">
                  <label class="flex-grow flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 hover:border-abacate-suave rounded-xl py-3 px-4 cursor-pointer text-stone-500 hover:text-abacate-suave-dark transition-colors bg-stone-50">
                    <Upload size={16} />
                    <span>Upload de Foto Real</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload} 
                      class="hidden" 
                    />
                  </label>
                </div>
                {prodImagem && (
                  <div class="mt-2 relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200">
                    <img src={prodImagem} alt="Preview" class="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div class="flex items-center gap-6 py-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={prodTag3D}
                    onChange={e => setProdTag3D(e.target.checked)}
                    class="accent-abacate-suave w-4 h-4"
                  />
                  <span class="font-medium text-marrom-cafe/80">Possui Tag 3D</span>
                </label>

                <label class="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={prodRascunho}
                    onChange={e => setProdRascunho(e.target.checked)}
                    class="accent-abacate-suave w-4 h-4"
                  />
                  <span class="font-medium text-marrom-cafe/80">Salvar Rascunho</span>
                </label>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button 
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  class="bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium px-4 py-2.5 rounded-xl"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  class="bg-abacate-suave hover:bg-abacate-suave-dark text-white font-medium px-4 py-2.5 rounded-xl shadow-sm"
                >
                  Adicionar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
