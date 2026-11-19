# Refuse It

Plataforma de conexão e redistribuição de alimentos.

Global Solution 2026/2 — FIAP
Disciplina: Front-end Design Engineering.

## Objetivo

Promover a conexão entre comércios, produtores e organizações sociais para evitar o desperdício de alimentos que ainda estão em condições adequadas para consumo, direcionando-os a pessoas em situação de necessidade.

A plataforma também acompanha os resultados gerados, contabilizando a quantidade de alimentos reaproveitados a cada entrega finalizada.

**ODS relacionados:** 2, 10, 11 e 12.

## Funcionalidades

- Listagem de alimentos disponíveis para doação, com pesquisa, filtros e opções de ordenação.
- Cadastro e divulgação de doações com validação dos dados informados.
- Solicitação e reserva de alimentos por instituições cadastradas.
- Programação e monitoramento de entregas e retiradas.
- Dashboard com métricas de impacto específicas para cada tipo de usuário (doador, instituição e administrador).
- Sistema de autenticação, registro por etapas e controle de acesso conforme o perfil.
- Seções institucionais: Home, Sobre, Integrantes, FAQ e Contato.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Lucide React
- Fetch API
- ESLint

## Estrutura

```plaintext
src/
  assets/
  components/
  context/
  data/
  hooks/
  pages/
  services/
  types/
  utils/
```

### Descrição dos diretórios

| Diretório | Descrição |
|---|---|
| `assets/` | Armazena arquivos de imagem, fotos dos integrantes e logotipo. |
| `components/` | Contém componentes reutilizáveis da interface. |
| `context/` | Gerencia estados globais da aplicação, como a autenticação. |
| `data/` | Armazena informações estáticas, como dados dos integrantes e FAQ. |
| `hooks/` | Reúne hooks personalizados, como `useFetch` e `useAuth`. |
| `pages/` | Armazena as páginas e telas que compõem a interface da aplicação. |
| `services/` | Centraliza os serviços responsáveis pela comunicação e integração com a API desenvolvida em Java. |
| `types/` | Reúne as definições de interfaces, tipos e estruturas de dados utilizadas no TypeScript. |
| `utils/` | Contém funções utilitárias e recursos auxiliares para reutilização e organização do código. |

## 🚀 Como executar o projeto

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:
 
- [Node.js](https://nodejs.org/) — versão LTS.
- [npm](https://www.npmjs.com/) — gerenciador de pacotes.
 
### Instalação
 
Clone o repositório e acesse a pasta do projeto:
 
```bash
git clone https://github.com/AndrewRls/refuse-it.git
cd refuse-it
npm install
npm run dev
```
Após iniciar o projeto, acesse http://localhost:5173 pelo navegador. Duplique o arquivo .env.example com o nome .env e configure VITE_API_URL com o endereço da API.


# Integrantes

| Nome | RM | Turma | Função |
|---|---|---|---|
| Andrew Rodrigues Lima da Silva | RM573777 | 1TDSPF | Front-end |
| Bryan Costa Silva | RM569439 | 1TDSPF | Back-end (Java) |
| Igor Blacconaro Santos | RM572033 | 1TDSPF | Banco de dados e Python |
| Luis Henrique Rondão Mendonça | RM569797 | 1TDSPO | Chatbot e IA |
| Luis Felipe Fernandes Esteves | RM569064 | 1TDSPF | Engenharia de software e negócio |




