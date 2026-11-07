export interface Integrante {
  rm: string
  nome: string
  nomeCurto: string
  turma: string
  funcao: string
  resumo: string
  responsabilidades?: string[]
  github: string
  linkedin: string
}

export const integrantes: Integrante[] = [
  {
    rm: 'RM573777',
    nome: 'Andrew Rodrigues Lima da Silva',
    nomeCurto: 'Andrew',
    turma: '1TDSPF',
    funcao: 'Front-end',
    resumo: 'Responsável pelo front-end da plataforma: interface, rotas, formulários e integração com a API em Java.',
    responsabilidades: [
      'Interface responsiva com React, TypeScript e Tailwind CSS',
      'Integração com a API (GET, POST, PUT e DELETE)',
      'Formulários com validação e feedback ao usuário',
      'Publicação do projeto na Vercel',
    ],
    github: 'https://github.com/AndrewRls',
    linkedin: 'https://www.linkedin.com/in/andrew-rls',
  },
  {
    rm: 'RM569439',
    nome: 'Bryan Costa Silva',
    nomeCurto: 'Bryan',
    turma: '1TDSPF',
    funcao: 'Back-end (Java)',
    resumo: 'Responsável pela API em Java que sustenta a plataforma.',
    responsabilidades: [
      'API para gerenciamento de doações, reservas, disponibilidade e entregas',
      'Regras de negócio e validações no servidor',
      'Publicação da API para uso pelo front-end',
    ],
    github: 'https://github.com/BryanC0staDev',
    linkedin: 'https://www.linkedin.com/in/bryan-costa-silva/',
  },
  {
    rm: 'RM572033',
    nome: 'Igor Blacconaro Santos',
    nomeCurto: 'Igor',
    turma: '1TDSPF',
    funcao: 'Banco de dados e Python',
    resumo: 'Responsável pelo banco de dados relacional da plataforma e pelo desenvolvimento em Python.',
    responsabilidades: [
      'Modelo relacional de usuários, estabelecimentos, alimentos, doações, reservas e entregas',
      'Scripts DDL com chaves e restrições de integridade',
    ],
    github: 'https://github.com/igorblacconaro',
    linkedin: 'https://www.linkedin.com/in/igorblacconaro',
  },
  {
    rm: 'RM569797',
    nome: 'Luis Henrique Rondão Mendonça',
    nomeCurto: 'Luis Henrique',
    turma: '1TDSPO',
    funcao: 'Chatbot e IA',
    resumo: 'Responsável pelo chatbot que orienta doadores, instituições e cidadãos.',
    responsabilidades: [
      'Orientação sobre doações e segurança alimentar',
      'Classificação de alimentos e solicitações',
    ],
    github: 'https://github.com/luishdev0',
    linkedin: 'https://www.linkedin.com/in/luis-rondao',
  },
  {
    rm: 'RM569064',
    nome: 'Luis Felipe Fernandes Esteves',
    nomeCurto: 'Luis Felipe',
    turma: '1TDSPF',
    funcao: 'Engenharia de software e negócio',
    resumo: 'Responsável pela engenharia de software e pelo modelo de negócio da plataforma.',
    responsabilidades: [
      'Modelo de negócio baseado em parcerias com estabelecimentos, instituições e organizações públicas',
      'Organização e documentação do projeto',
    ],
    github: 'https://github.com/dev-luisfernandes',
    linkedin: 'https://www.linkedin.com/in/luis-f-b2a3983b3/',
  },
]