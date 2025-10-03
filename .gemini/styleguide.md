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
├── css/                    # Look and feel.
├── fonts/                  # Customed fonts.
├── images/                 # Static assets.
├── pages/                  # Web sections such as profile, resume, project, posts, and projects.
├── partials/               # Partials for reusable components.
├── stores/                 # Pinia stores.
├── support/                # Application support libraries.
├── App.vue                 # Main vue compenent.
└── dark-mode.ts            # Dark / Light mode composable.
└── public.ts               # Shared utilities / logic.
└── router.ts               # Application routes.
└── main.ts                 # Application entry point.
