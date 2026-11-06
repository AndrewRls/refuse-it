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
      'Estabelecimentos cadastrados como restaurante, mercado, padaria, produtor rural ou outra categoria ligada a alimentos. O cadastro pede o CNPJ do estabelecimento.',
  },
  {
    categoria: 'Doar',
    pergunta: 'Como publico uma doação?',
    resposta:
      'Entre com a conta de doador e abra “Publicar doação”. Escolha o alimento e informe a quantidade, a data de validade, o prazo limite de retirada e a condição de armazenamento.',
  },
  {
    categoria: 'Doar',
    pergunta: 'Posso cancelar ou excluir uma doação?',
    resposta:
      'Sim, pelo painel. Uma doação com reservas pendentes ou aprovadas só pode ser cancelada depois que essas reservas forem resolvidas. Doações sem nenhuma reserva também podem ser excluídas.',
  },
  {
    categoria: 'Doar',
    pergunta: 'Como funciona a entrega?',
    resposta:
      'Depois de aprovar uma reserva, você agenda a entrega e escolhe se a instituição retira no local ou se o estabelecimento leva até ela. O painel acompanha cada etapa até a conclusão.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Quem pode reservar alimentos?',
    resposta:
      'Instituições sociais cadastradas, como ONGs, abrigos, cozinhas comunitárias e entidades que atendem pessoas em situação de vulnerabilidade. O CNPJ é opcional no cadastro.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Como reservo um alimento?',
    resposta:
      'No catálogo, abra os detalhes da doação, informe a quantidade desejada e solicite a reserva. O estabelecimento analisa o pedido e aprova ou recusa. Você acompanha tudo pelo painel.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Posso cancelar uma reserva?',
    resposta:
      'Sim, enquanto ela estiver pendente ou aprovada e ainda sem entrega agendada. A quantidade volta a ficar disponível para outras instituições.',
  },
  {
    categoria: 'Receber',
    pergunta: 'Pessoas físicas podem reservar?',
    resposta:
      'No momento, as reservas são feitas por instituições sociais, que distribuem os alimentos a quem precisa. Qualquer pessoa pode consultar o catálogo para ver o que está disponível.',
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
      'O painel soma o peso estimado das entregas concluídas. Litros e mililitros são convertidos considerando 1 litro como cerca de 1 kg, e itens contados por unidade aparecem separados.',
  },
]