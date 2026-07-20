# [PROJECT_NAME] Constitution
<!-- Example: Spec Constitution, TaskFlow Constitution, etc. -->

## Core Principles
# 📜 Constituição do Projeto (Ateliê Sonho Encantado)

Esta constituição define as leis imutáveis de arquitetura, segurança e desenvolvimento deste repositório. Qualquer pull request ou refatoração deve obediência irrestrita a estes princípios.

---

## I. Filosofia de Desenvolvimento & Stack

### 1. Independência de Frameworks Monolíticos
A arquitetura deve permanecer enxuta. O ecossistema é centrado em ferramentas de alta performance e baixo overhead: **Fastify** para o motor de API, **Astro** para entrega de conteúdo estático, **React** estritamente para componentização e **Tailwind CSS** para estilização utilitária. O ecossistema roda sob o runtime **Bun**.

### 2. Performance é Métrica de UX
O frontend não deve penalizar o cliente com pacotes massivos de JavaScript. O Astro deve gerar HTML estático por padrão (SSG/ISR) para garantir carregamento instantâneo e indexação impecável de SEO. Componentes interativos (React) são tratados como "Ilhas" isoladas e só carregam JavaScript sob demanda explícita.

---

## II. Leis Inabaláveis de Segurança (Backend-Centric)

### 3. Postura Zero Trust (Desconfiança Absoluta)
O backend assume que **absolutamente tudo** vindo do frontend ou do cliente é malicioso, corrompido ou hostil. Nenhuma validação visual feita no lado do cliente substitui a checagem rigorosa do servidor.

### 4. Validação na Entrada, Limpeza na Saída
Toda e qualquer rota mutável ou de consulta deve possuir um esquema estrito via **Zod**:
*   **Input (Request Body/Query):** Deve passar por validação estrita, tipagem forçada e sanitização contra injeções antes de alcançar a lógica de negócio.
*   **Output (Response JSON):** Deve ser explicitamente serializado pelo Fastify. Dados não mapeados no esquema de resposta são purgados automaticamente, garantindo payloads limpos e impedindo vazamento de dados internos ou sensíveis.

### 5. Blindagem de Sessão e Estado
Autenticações e tokens de estado crítico devem ser trafegados via **Cookies HTTP-Only**. Para neutralizar vulnerabilidades intrínsecas a esse modelo, é obrigatória a configuração dos atributos `SameSite=Strict` (ou `Lax`) associada a validações rigorosas de cabeçalho anti-CSRF.

---

## III. Engenharia de Código & Manutenção

### 6. Aversão ao Caos do Frontend
O código visual deve ser previsível. Não é permitida a criação de arquivos CSS customizados caóticos ou estruturas complexas de manipulação de DOM. A estilização deve ser resolvida via classes do Tailwind diretamente nos componentes React reaproveitáveis, mantendo a manutenibilidade limpa e purificada para desenvolvedores focados em lógica de backend.

### 7. Resiliência e Idempotência
Processamentos críticos (como requisições de checkout, integrações de pagamento ou comunicação com APIs terceiras de frete) devem ser protegidos por travas de *Rate Limiting* no backend e chaves de idempotência, impedindo gargalos por requisições duplicadas ou ataques de negação de serviço.

## [SECTION_2_NAME]
<!-- Example: Additional Constraints, Security Requirements, Performance Standards, etc. -->

[SECTION_2_CONTENT]
<!-- Example: Technology stack requirements, compliance standards, deployment policies, etc. -->

## [SECTION_3_NAME]
<!-- Example: Development Workflow, Review Process, Quality Gates, etc. -->

[SECTION_3_CONTENT]
<!-- Example: Code review requirements, testing gates, deployment approval process, etc. -->

## Governance
<!-- Example: Constitution supersedes all other practices; Amendments require documentation, approval, migration plan -->

[GOVERNANCE_RULES]
<!-- Example: All PRs/reviews must verify compliance; Complexity must be justified; Use [GUIDANCE_FILE] for runtime development guidance -->

**Version**: [CONSTITUTION_VERSION] | **Ratified**: [RATIFICATION_DATE] | **Last Amended**: [LAST_AMENDED_DATE]
<!-- Example: Version: 2.1.1 | Ratified: 2025-06-13 | Last Amended: 2025-07-16 -->
