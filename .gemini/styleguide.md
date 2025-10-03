# Vue & TypeScript Style Guide (v2)

This guide provides a set of conventions and best practices for building robust, scalable, and maintainable Vue.js applications with TypeScript. It reflects modern patterns and tooling.

---

## 📜 General Principles

* **Clarity over cleverness**: Code should be self-explanatory. Prioritise readability for the long-term health of the codebase.
* **Consistency is key**: A consistent style makes the code predictable, reducing a cognitive load. Automate this with linters and formatters.
* **Embrace TypeScript**: Use TypeScript's `strict` mode. Let the compiler be your first line of defence against bugs.
* **Composition API First**: All new components and logic must use the Composition API with `<script setup>`.
* **Single Responsibility Principle (SRP)**: Components should handle presentation, while composable encapsulate business logic and services handle data fetching.

---

## 📁 File & Folder Structure

A feature-based structure is recommended for scalability.

```bash
src/
├── images/                 # Static assets
├── pages/
├── partials/               # Partials for reusable components
├── stores/                 # Pinia stores
├── support/                # Share logic
├── App.vue
└── dark-mode.ts
└── public.ts
└── router.ts
└── main.ts
