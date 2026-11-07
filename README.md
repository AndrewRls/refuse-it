# Refuse It

Plataforma de redistribuição de alimentos. Global Solution 2026/2, FIAP, disciplina Front-end Design Engineering.

## Objetivo

Conectar estabelecimentos comerciais, produtores e instituições sociais para que alimentos que seriam descartados, mas ainda estão próprios para consumo, cheguem a quem precisa. A plataforma também mede o impacto, somando o alimento reaproveitado em cada entrega concluída.

ODS relacionados: 2, 10, 11 e 12.

## Funcionalidades

- Catálogo de doações com busca, filtros e ordenação
- Publicação de doações com validação de formulário
- Reserva de alimentos por instituições
- Agendamento e acompanhamento de entregas e retiradas
- Painel com indicadores de impacto, por perfil (doador, instituição e admin)
- Login, cadastro em etapas e rotas protegidas por perfil
- Páginas institucionais: Home, Sobre, Integrantes, FAQ e Contato

## Tecnologias

React, TypeScript, Vite, Tailwind CSS, React Router, Lucide React, Fetch API e ESLint.

## Estrutura

    src/
      assets/        imagens (fotos, integrantes, logo)
      components/    componentes reutilizáveis
      context/       contexto de autenticação
      data/          conteúdo estático (integrantes, FAQ)
      hooks/         hooks (useFetch, useAuth)
      pages/         páginas da aplicação
      services/      comunicação com a API Java
      types/         tipos TypeScript
      utils/         funções auxiliares

## Integrantes

| Nome | RM | Turma |
|---|---|---|
| Andrew Rodrigues Lima da Silva | RM573777 | 1TDS |
| Bryan Costa Silva | RM569439 | 1TDS |
| Luis Henrique Rondão Mendonça | RM569797 | 1TDS |
| Igor Blacconaro Santos | RM572033 | 1TDS |
| Luis Felipe Fernandes Esteves | RM569064 | 1TDS |

## Como executar

Requisitos: Node.js (versão LTS) e npm.

    npm install
    npm run dev

A aplicação abre em `http://localhost:5173`. Copie `.env.example` para `.env` e ajuste `VITE_API_URL` para a URL da API.

## Links

- GitHub: PREENCHER
- Aplicação (Vercel): PREENCHER
- API Java (Render): PREENCHER
- Vídeo (YouTube): PREENCHER

## Contato

Os integrantes estão na página de Contato da aplicação, com GitHub e LinkedIn de cada um:

| Nome | RM | Turma | Função |
|---|---|---|---|
| Andrew Rodrigues Lima da Silva | RM573777 | 1TDSPF | Front-end |
| Bryan Costa Silva | RM569439 | 1TDSPF | Back-end (Java) |
| Igor Blacconaro Santos | RM572033 | 1TDSPF | Banco de dados e Python |
| Luis Henrique Rondão Mendonça | RM569797 | 1TDSPO | Chatbot e IA |
| Luis Felipe Fernandes Esteves | RM569064 | 1TDSPF | Engenharia de software e negócio |