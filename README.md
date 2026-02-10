# Abbiamo Challenge Web

## 📦 Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- TanStack React Query
- React Hook Form
- Vitest + Testing Library
- Playwright

---

## ▶️ Como rodar o projeto localmente

### Pré-requisitos

- Node.js
- npm (gerenciador utilizado no projeto)
- **API backend do desafio rodando localmente**

> ⚠️ Este projeto depende de uma API backend para funcionar corretamente.
> Certifique-se de clonar e rodar a API conforme instruções fornecidas no desafio antes de iniciar o front-end.

### Instalação de dependências

```bash
npm install
```

### Subir a aplicação em modo desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em `http://localhost:5173` (porta padrão do Vite).

---

## 🌐 Aplicação em produção (deploy)

- Front-end: [https://abbiamo-challeng-web.vercel.app/dashboard](https://abbiamo-challeng-web.vercel.app/dashboard)
- API: [https://abbiamo-challenge-api.onrender.com/](https://abbiamo-challenge-api.onrender.com/)

> ℹ️ **Observação sobre disponibilidade da API**
> A API está hospedada no plano free do Render. Após períodos de inatividade, o primeiro acesso pode levar **30–60 segundos** para responder devido ao cold start.
> Caso o login falhe inicialmente no front-end, aguarde alguns segundos e tente novamente.

---

## 🧪 Como rodar os testes

### Testes unitários / integração (Vitest)

```bash
npm run test
```

Modo watch:

```bash
npm run test:watch
```

### Testes E2E (Playwright)

```bash
npm run e2e
```

#### Observações sobre os testes E2E

- Apenas o **smoke test** utiliza login real contra a API.
- Os demais testes utilizam **mocks determinísticos via `page.route`**, garantindo:
  - estabilidade em CI
  - previsibilidade de dados
  - menor flakiness em fluxos de UI

Essa abordagem equilibra validação de integração com confiabilidade dos testes.

---

## ⚠️ Observações importantes sobre a implementação

- Arquitetura organizada por **feature**, com separação entre `app/`, `features/`, `shared/`, `services/` e `storage/`.
- A camada `services/` global concentra infraestrutura (HTTP, auth, storage), enquanto regras de domínio permanecem nas services/hooks de cada feature.
- Em alguns pontos há **redundâncias pontuais** ou arquivos que concentram mais de uma responsabilidade (lógica, renderização, constantes e tipagem).
- Em um cenário de evolução contínua, esses pontos seriam naturalmente refinados com:
  - extração de constantes
  - separação mais rígida entre lógica e UI
  - consolidação de padrões de componentes

### Sobre decisões práticas

- O projeto prioriza **fluxos funcionais completos**, previsibilidade de comportamento e testes estáveis.
- Em alguns trechos, o design system não é seguido de forma absolutamente rigorosa.
- Essa escolha foi consciente para garantir uma entrega funcional e navegável dentro do escopo proposto, mantendo clareza de arquitetura e testes confiáveis.
