# Graph Report - atelie-sonho-encantado  (2026-07-20)

## Corpus Check
- 66 files · ~37,292 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 469 nodes · 469 edges · 44 communities (37 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bf5fe11d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- dependencies
- Tasks: [FEATURE NAME]
- package.json
- 📜 Constituição do Projeto (Ateliê Sonho Encantado)
- common.sh
- Execution Steps
- compilerOptions
- compilerOptions
- SKILL.md
- 4. Detection Passes (Token-Efficient Analysis)
- Feature Specification: [FEATURE NAME]
- SKILL.md
- SKILL.md
- SKILL.md
- produtos.ts
- Core Principles
- Implementation Plan: [FEATURE]
- SKILL.md
- SKILL.md
- SKILL.md
- index.astro
- SKILL.md
- SKILL.md
- create-new-feature.sh
- [CHECKLIST TYPE] Checklist: [FEATURE NAME]
- graphify.md
- graphify.md
- check-prerequisites.sh
- setup-plan.sh
- setup-tasks.sh
- compilerOptions
- package.json
- package.json
- compilerOptions
- devDependencies
- React + TypeScript + Vite
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 18 edges
2. `compilerOptions` - 15 edges
3. `Tasks: [FEATURE NAME]` - 13 edges
4. `compilerOptions` - 12 edges
5. `compilerOptions` - 8 edges
6. `Execution Steps` - 7 edges
7. `4. Detection Passes (Token-Efficient Analysis)` - 7 edges
8. `Execution Steps` - 7 edges
9. `📜 Constituição do Projeto (Ateliê Sonho Encantado)` - 7 edges
10. `rotasAdmin()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `seed()` --calls--> `rodarMigracoes()`  [EXTRACTED]
  backend/src/config/seed.ts → backend/src/config/migrate.ts
- `run()` --calls--> `rodarMigracoes()`  [EXTRACTED]
  backend/src/server.ts → backend/src/config/migrate.ts
- `rotasAdmin()` --indirect_call--> `validarJWT()`  [INFERRED]
  backend/src/routes/admin.ts → backend/src/middleware/auth.ts
- `rotasAdmin()` --calls--> `verificarRole()`  [EXTRACTED]
  backend/src/routes/admin.ts → backend/src/middleware/auth.ts
- `rotasAdmin()` --calls--> `sanitizarObjeto()`  [EXTRACTED]
  backend/src/routes/admin.ts → backend/src/utils/sanitize.ts

## Import Cycles
- None detected.

## Communities (44 total, 7 thin omitted)

### Community 0 - "dependencies"
Cohesion: 0.07
Nodes (27): astro, @astrojs/react, @astrojs/tailwind, dependencies, astro, @astrojs/react, @astrojs/tailwind, react (+19 more)

### Community 1 - "Tasks: [FEATURE NAME]"
Cohesion: 0.07
Nodes (26): Dependencies & Execution Order, Format: `[ID] [P?] [Story] Description`, Implementation for User Story 1, Implementation for User Story 2, Implementation for User Story 3, Implementation Strategy, Incremental Delivery, MVP First (User Story 1 Only) (+18 more)

### Community 2 - "package.json"
Cohesion: 0.10
Nodes (21): argon2, dependencies, argon2, drizzle-orm, fastify, @fastify/cors, @fastify/helmet, @fastify/jwt (+13 more)

### Community 3 - "📜 Constituição do Projeto (Ateliê Sonho Encantado)"
Cohesion: 0.12
Nodes (16): 1. Independência de Frameworks Monolíticos, 2. Performance é Métrica de UX, 3. Postura Zero Trust (Desconfiança Absoluta), 4. Validação na Entrada, Limpeza na Saída, 5. Blindagem de Sessão e Estado, 6. Aversão ao Caos do Frontend, 7. Resiliência e Idempotência, 📜 Constituição do Projeto (Ateliê Sonho Encantado) (+8 more)

### Community 4 - "common.sh"
Cohesion: 0.13
Nodes (5): get_feature_paths(), get_repo_root(), _persist_feature_json(), resolve_specify_init_dir(), common.sh script

### Community 5 - "Execution Steps"
Cohesion: 0.12
Nodes (15): 1. Initialize Convergence Context, 2. Load Artifacts (Progressive Disclosure), 3. Build the Intent Inventory, 4. Assess the Codebase and Classify Findings, 5. Assign Severity, 6. Present the In-Session Findings Summary, 7. Append Convergence Tasks (or report converged), 8. Provide Next Actions (Handoff) (+7 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, allowImportingTsExtensions, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, module, moduleResolution, noEmit (+6 more)

### Community 7 - "compilerOptions"
Cohesion: 0.13
Nodes (14): compilerOptions, jsx, jsxImportSource, module, moduleResolution, paths, strict, target (+6 more)

### Community 8 - "SKILL.md"
Cohesion: 0.08
Nodes (25): 1. Initialize Analysis Context, 2. Load Artifacts (Progressive Disclosure), 3. Build Semantic Models, 4. Detection Passes (Token-Efficient Analysis), 5. Severity Assignment, 6. Produce Compact Analysis Report, 7. Provide Next Actions, 8. Offer Remediation (+17 more)

### Community 9 - "4. Detection Passes (Token-Efficient Analysis)"
Cohesion: 0.15
Nodes (19): db, sqlite, rodarMigracoes(), seed(), validarJWT(), verificarRole(), validarCSRF(), rotasAdmin() (+11 more)

### Community 10 - "Feature Specification: [FEATURE NAME]"
Cohesion: 0.15
Nodes (12): Assumptions, Edge Cases, Feature Specification: [FEATURE NAME], Functional Requirements, Key Entities *(include if feature involves data)*, Measurable Outcomes, Requirements *(mandatory)*, Success Criteria *(mandatory)* (+4 more)

### Community 11 - "SKILL.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, Key rules, Mandatory Post-Execution Hooks, Outline, Phase 0: Outline & Research, Phase 1: Design & Contracts, Phases (+2 more)

### Community 12 - "SKILL.md"
Cohesion: 0.18
Nodes (10): Completion Report, Done When, For AI Generation, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, Quick Guidelines, Section Requirements (+2 more)

### Community 13 - "SKILL.md"
Cohesion: 0.18
Nodes (10): Checklist Format (REQUIRED), Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Phase Structure, Pre-Execution Checks, Task Generation Rules (+2 more)

### Community 14 - "produtos.ts"
Cohesion: 0.38
Nodes (5): produtosDb, CriarProdutoInput, CriarProdutoSchema, RespostaProduto, RespostaProdutoSchema

### Community 15 - "Core Principles"
Cohesion: 0.18
Nodes (10): Core Principles, Governance, [PRINCIPLE_1_NAME], [PRINCIPLE_2_NAME], [PRINCIPLE_3_NAME], [PRINCIPLE_4_NAME], [PRINCIPLE_5_NAME], [PROJECT_NAME] Constitution (+2 more)

### Community 16 - "Implementation Plan: [FEATURE]"
Cohesion: 0.22
Nodes (8): Complexity Tracking, Constitution Check, Documentation (this feature), Implementation Plan: [FEATURE], Project Structure, Source Code (repository root), Summary, Technical Context

### Community 17 - "SKILL.md"
Cohesion: 0.25
Nodes (7): Anti-Examples: What NOT To Do, Checklist Purpose: "Unit Tests for English", Example Checklist Types & Sample Items, Execution Steps, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 18 - "SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 19 - "SKILL.md"
Cohesion: 0.29
Nodes (6): Completion Report, Done When, Mandatory Post-Execution Hooks, Outline, Pre-Execution Checks, User Input

### Community 20 - "index.astro"
Cohesion: 0.09
Nodes (16): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, DashboardMetrics, Pedido, Produto (+8 more)

### Community 21 - "SKILL.md"
Cohesion: 0.40
Nodes (4): Outline, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 22 - "SKILL.md"
Cohesion: 0.40
Nodes (4): Outline, Post-Execution Checks, Pre-Execution Checks, User Input

### Community 24 - "[CHECKLIST TYPE] Checklist: [FEATURE NAME]"
Cohesion: 0.40
Nodes (4): [Category 1], [Category 2], [CHECKLIST TYPE] Checklist: [FEATURE NAME], Notes

### Community 31 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 34 - "package.json"
Cohesion: 0.14
Nodes (13): devDependencies, drizzle-kit, @types/node, typescript, @types/node, typescript, name, scripts (+5 more)

### Community 36 - "package.json"
Cohesion: 0.09
Nodes (22): dependencies, autoprefixer, lucide-react, postcss, react, react-dom, tailwindcss, react (+14 more)

### Community 37 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 38 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, oxlint, @types/node, @types/react, @types/react-dom, typescript, vite, @vitejs/plugin-react (+7 more)

### Community 39 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **280 isolated node(s):** `check-prerequisites.sh script`, `common.sh script`, `create-new-feature.sh script`, `setup-plan.sh script`, `setup-tasks.sh script` (+275 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `package.json` to `package.json`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `check-prerequisites.sh script`, `common.sh script`, `create-new-feature.sh script` to the rest of the system?**
  _280 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Should `Tasks: [FEATURE NAME]` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `📜 Constituição do Projeto (Ateliê Sonho Encantado)` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._