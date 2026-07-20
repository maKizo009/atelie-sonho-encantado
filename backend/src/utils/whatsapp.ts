/**
 * Gera um link direto para o WhatsApp do cliente com uma mensagem pré-formatada
 * baseada no status de produção atual do pedido.
 */
export function gerarLinkWhatsApp(
  telefone: string,
  nomeCliente: string,
  idPedido: string,
  statusProducao: 'rascunho' | 'aguardando_sinal' | 'em_producao' | 'pronto' | 'entregue' | 'cancelado'
): string {
  // Mantém apenas os números do telefone (DDI + DDD + Número)
  const telefoneLimpo = telefone.replace(/\D/g, '');

  // Formata o número inicial com DDI padrão do Brasil (55) caso não tenha
  const destinatario = telefoneLimpo.length <= 11 ? `55${telefoneLimpo}` : telefoneLimpo;

  let mensagem = '';

  switch (statusProducao) {
    case 'aguardando_sinal':
      mensagem = `Oi ${nomeCliente}! Seu pedido no Ateliê Sonho Encantado foi registrado. Aguardamos o pagamento do sinal para iniciarmos a produção. ✨`;
      break;
    case 'em_producao':
      mensagem = `Oi ${nomeCliente}! Sinal confirmado. Seu pedido já está em fase de produção com todo amor e cuidado! 🧶🛠️`;
      break;
    case 'pronto':
      mensagem = `Oi ${nomeCliente}! Boas notícias: seu pedido está prontinho e embalado! 🎁 Pronto para entrega ou retirada.`;
      break;
    case 'entregue':
      mensagem = `Oi ${nomeCliente}! Passando para confirmar que seu pedido foi entregue. Esperamos que você adore! Muito obrigado pela confiança! ❤️`;
      break;
    case 'cancelado':
      mensagem = `Olá ${nomeCliente}, informamos que o seu pedido foi cancelado no nosso sistema. Qualquer dúvida, estamos por aqui.`;
      break;
    default:
      mensagem = `Oi ${nomeCliente}! Passando para atualizar você sobre o andamento do seu pedido no Ateliê Sonho Encantado.`;
      break;
  }

  return `https://api.whatsapp.com/send?phone=${destinatario}&text=${encodeURIComponent(mensagem)}`;
}
