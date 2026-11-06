export interface Integrante {
  rm: string
  nome: string
  turma: string
  funcao: string
  resumo: string
  responsabilidades: string[]
  github?: string
  linkedin?: string
}


export const integrantes: Integrante[] = [
  {
    rm: 'RM573777',
    nome: 'Andrew Rodrigues Lima da Silva',
    turma: '1TDS',
    funcao: 'Front-end',
    resumo: 'Responsável pela interface da plataforma e pela integração com a API em Java.',
    responsabilidades: [
      'Layout responsivo com React, TypeScript e Tailwind CSS',
      'Integração com a API (GET, POST, PUT e DELETE)',
      'Formulários com validação e feedback ao usuário',
      'Publicação do projeto na Vercel',
    ],
    github: 'https://github.com/',
    linkedin: 'https://www.linkedin.com/',
  },
  {
    rm: 'RM000002',
    nome: 'Nome do Integrante 2',
    turma: '1TDS',
    funcao: 'Back-end (Java)',
    resumo: 'Responsável pela API de doações, reservas, disponibilidade e entregas.',
    responsabilidades: [
      'Endpoints REST em Java',
      'Regras de negócio de reservas e entregas',
      'Integração da API com o banco de dados',
    ],
  },
  {
    rm: 'RM000003',
    nome: 'Nome do Integrante 3',
    turma: '1TDS',
    funcao: 'Banco de dados',
    resumo: 'Responsável pela modelagem relacional e pelos scripts do banco.',
    responsabilidades: [
      'Modelo relacional no Oracle',
      'Scripts DDL com restrições de integridade',
      'Carga de dados de exemplo',
    ],
  },
  {
    rm: 'RM000004',
    nome: 'Nome do Integrante 4',
    turma: '1TDS',
    funcao: 'Chatbot e IA',
    resumo: 'Responsável pelo chatbot que orienta doadores, instituições e cidadãos.',
    responsabilidades: [
      'Fluxos de conversa sobre doações e segurança alimentar',
      'Classificação de alimentos e solicitações',
      'Modelo de negócio e apresentação',
    ],
  },
]