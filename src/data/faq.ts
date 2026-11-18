export type CategoriaFaq = 'Doar' | 'Receber' | 'Segurança alimentar' | 'Plataforma'

export interface Pergunta {
  categoria: CategoriaFaq
  pergunta: string
  resposta: string
}

export const categoriasFaq: CategoriaFaq[] = ['Doar', 'Receber', 'Segurança alimentar', 'Plataforma']

export const perguntas: Pergunta[] = [
  {
    categoria: 'Doar',
    pergunta: 'Quem pode doar alimentos?',
    resposta:
      'Empresas (restaurante, mercado, padaria, produtor rural ou outra categoria ligada a alimentos) e pessoas físicas. O cadastro pede o CNPJ ou o CPF, e os dados são conferidos automaticamente.',
  },
  {
    categoria: 'Doar',
    pergunta: 'Como publico uma doação?',
    resposta:
      'Entre com uma conta de empresa ou de pessoa física e abra “Publicar doação”. Escolha o alimento (ou cadastre um novo) e informe a quantidade, a data de validade, o prazo limite de retirada e a condição de armazenamento.',
  },
  {
    categoria: 'Doar',
    pergunta: 'Posso cancelar uma doação?',
    resposta:
      'Sim, pelo painel, enquanto nenhuma ONG tiver reservado. Depois da primeira reserva a doação não pode mais ser cancelada.',
  },
  {
    categoria: 'Doar',
    pergunta: 'Como funciona a retirada?',
    resposta:
      'A ONG reserva a quantidade que precisa pelo site e retira o alimento até o prazo limite informado na doação. A quantidade disponível se atualiza a cada reserva.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Quem pode reservar alimentos?',
    resposta: 'Contas de ONG. O cadastro pede o CNPJ da organização, e os dados dela são buscados automaticamente.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Como reservo um alimento?',
    resposta:
      'No catálogo, abra os detalhes da doação, informe a quantidade desejada e confirme. A reserva aparece no seu painel e a quantidade disponível da doação é atualizada na hora.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Posso cancelar uma reserva?',
    resposta:
      'Sim, pelo painel, enquanto a reserva estiver em andamento. A quantidade volta a ficar disponível para outras ONGs.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Pessoas físicas podem reservar?',
    resposta:
      'No momento, as reservas são feitas por ONGs, que distribuem os alimentos a quem precisa. Qualquer pessoa pode consultar o catálogo para ver o que está disponível.',
  },
  {
    categoria: 'Segurança alimentar',
    pergunta: 'Que alimentos podem ser doados?',
    resposta:
      'Apenas alimentos próprios para consumo: dentro da validade, bem conservados, sem sinais de deterioração e em embalagens íntegras. Na dúvida, não doe.',
  },
  {
    categoria: 'Segurança alimentar',
    pergunta: 'Como armazenar e transportar?',
    resposta:
      'Informe a condição de armazenamento ao publicar. Alimentos refrigerados ou congelados devem permanecer na temperatura adequada até a retirada, e todos devem estar embalados e higienizados.',
  },
  {
    categoria: 'Segurança alimentar',
    pergunta: 'O que conferir ao receber?',
    resposta:
      'Confira a validade, o aspecto e a embalagem. Guarde o alimento do jeito indicado e consuma ou distribua rapidamente. Se algo parecer estranho, descarte. Estas orientações são gerais: siga também as normas da vigilância sanitária da sua cidade.',
  },
  {
    categoria: 'Plataforma',
    pergunta: 'Preciso de conta para ver o catálogo?',
    resposta: 'Não. O catálogo é aberto a todos. A conta é necessária para publicar doações, reservar e acessar o painel.',
  },
  {
    categoria: 'Plataforma',
    pergunta: 'Como o impacto é medido?',
    resposta:
      'O painel soma o peso estimado do alimento já reservado por ONGs. Litros e mililitros são convertidos considerando 1 litro como cerca de 1 kg, e itens contados por unidade aparecem separados.',
  },
]