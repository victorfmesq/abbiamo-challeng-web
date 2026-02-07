# Abbiamo Challenge Web

Dashboard web para monitoramento de entregas logísticas, desenvolvido como desafio técnico frontend.

## Stack

- **React 18** + **Vite** + **TypeScript** (strict)
- **Tailwind CSS**
- **TanStack React Query**
- **React Hook Form** (sem Zod)
- **Vitest** + Testing Library (unit tests)
- **Playwright** (E2E tests)

## Como Rodar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Testes Unitários

```bash
npm run test        # executar testes uma vez
npm run test:watch  # modo watch
```

### Testes E2E

```bash
npm run e2e
```

### Linting e Formatação

```bash
npm run lint        # verificar erros
npm run format      # formatar código
```

## Configuração de Ambiente

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

2. A API mock roda em `http://localhost:4000`

### Variáveis de Ambiente

| Variável            | Descrição       | Padrão (Dev)            |
| ------------------- | --------------- | ----------------------- |
| `VITE_API_BASE_URL` | URL base da API | `http://localhost:4000` |

---

## Documentação do Projeto

Este projeto utiliza uma documentação estruturada em `docs/kilo/` para orientar o desenvolvimento, especialmente agentes de IA stateless.

### Estrutura da Documentação

```
docs/kilo/
├── KILO_MASTER.md        # Ponto de entrada - OBRIGATÓRIO ler primeiro
├── AI_OPERATION_MODE.md  # Regras de operação da IA
├── ARCHITECTURE.md        # Arquitetura oficial do projeto
├── TOOLS_AND_PATTERNS.md # Stack e padrões de código
├── UX_UI_AND_ATOMIC.md   # Guidelines de UI/UX
├── DESIGN_SYSTEM.md      # Sistema de design
├── FLOWS.md              # Fluxos do produto
└── TESTING.md            # Padrões de teste
```

### Regra Importante

**docs/kilo/KILO_MASTER.md** é a **fonte de verdade** do projeto. Antes de implementar qualquer tarefa, agentes de IA DEVEM consultar este arquivo e os documentos referenciados nele.

---

## Como Usar Agentes de IA Stateless

Este projeto foi projetado para ser desenvolvido com auxílio de agentes de IA que não mantêm estado entre sessões.

### Prompt de Ativação (OBRIGATÓRIO)

**Todo novo prompt deve iniciar com:**

```
Use o projeto conforme definido em docs/kilo/KILO_MASTER.md.
Implemente a tarefa abaixo seguindo estritamente essas regras.
```

### Comportamento Esperado do Agente

Ao receber uma tarefa, o agente DEVE:

1. **Ler KILO_MASTER.md** primeiro
2. **Identificar documentos relevantes** para a tarefa
3. **Consultar explicitamente** esses documentos antes de escrever código
4. **Internlizar os arquivos lidos** - ao final de cada resposta, o agente deve mostrar silenciosamente no output os arquivos que leu e processou

### Exemplo de Uso

```
Use o projeto conforme definido em docs/kilo/KILO_MASTER.md.
Implemente a tarefa abaixo seguindo estritamente essas regras.

Tarefa: Criar componente de login
```

### Output Silencioso de Auditoria

Para fins de auditoria e rastreabilidade, o agente deve sempre indicar ao final de cada resposta quais arquivos foram lidos e internalizados:

```
╔══════════════════════════════════════════════════════════════╗
║                    ARQUIVOS INTERNLIZADOS                    ║
╠══════════════════════════════════════════════════════════════╣
║  📄 docs/kilo/KILO_MASTER.md                                 ║
║  📄 docs/kilo/ARCHITECTURE.md                                ║
║  📄 src/features/auth/services/authService.ts                ║
╚══════════════════════════════════════════════════════════════╝
```

Esta informação deve ser exibida de forma discreta ao final da resposta, sem interromper o fluxo principal da comunicação.

### Regras Invioláveis para IA

- ❌ NÃO usar Zod ou validação por schema
- ❌ NÃO criar abstrações genéricas excessivas
- ❌ NÃO misturar regra de negócio com UI
- ❌ NÃO ser arquiteto do sistema
- ❌ NÃO decidir stack
- ❌ NÃO criar padrões novos

- ✅ Criar testes unitários para funções agnósticas
- ✅ Reutilizar componentes do `shared/`
- ✅ Seguir arquitetura definida em `docs/kilo/`
- ✅ Priorizar clareza sobre "arquitetura perfeita"
