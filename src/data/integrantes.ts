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

const RESUMO_PADRAO = 'Integrante da equipe Refuse It, projeto da Global Solution 2026/2 da FIAP.'

export const integrantes: Integrante[] = [
  {
    rm: 'RM573777',
    nome: 'Andrew Rodrigues Lima da Silva',
    nomeCurto: 'Andrew',
    turma: '1TDS',
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
    turma: '1TDS',
    funcao: 'Desenvolvedor',
    resumo: RESUMO_PADRAO,
    github: 'https://github.com/BryanC0staDev',
    linkedin: 'https://www.linkedin.com/in/bryan-costa-silva/',
  },
  {
    rm: 'RM569797',
    nome: 'Luis Henrique Rondão Mendonça',
    nomeCurto: 'Luis Henrique',
    turma: '1TDS',
    funcao: 'Desenvolvedor',
    resumo: RESUMO_PADRAO,
    github: 'https://github.com/luishdev0',
    linkedin: 'https://www.linkedin.com/in/luis-rondao',
  },
  {
    rm: 'RM572033',
    nome: 'Igor Blacconaro Santos',
    nomeCurto: 'Igor',
    turma: '1TDS',
    funcao: 'Desenvolvedor',
    resumo: RESUMO_PADRAO,
    github: 'https://github.com/igorblacconaro',
    linkedin: 'https://www.linkedin.com/in/igorblacconaro',
  },
  {
    rm: 'RM569064',
    nome: 'Luis Felipe Fernandes Esteves',
    nomeCurto: 'Luis Felipe',
    turma: '1TDS',
    funcao: 'Desenvolvedor',
    resumo: RESUMO_PADRAO,
    github: 'https://github.com/dev-luisfernandes',
    linkedin: 'https://www.linkedin.com/in/luis-f-b2a3983b3/',
  },
]