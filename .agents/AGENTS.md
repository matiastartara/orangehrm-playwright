# AGENTS.md — Project Context for AI Coding Agents

This file provides context and conventions for AI coding agents working in this repository.

## Project Overview

**storage-login-playwright** is an E2E test automation suite for [OrangeHRM Live Demo](https://opensource-demo.orangehrmlive.com/) built with Playwright + TypeScript.

The key architectural decision is **Storage State**: authentication runs once in a `setup` project and saves cookies/localStorage to `.auth/user.json`. All E2E tests in `e2e-chromium` load this state, so they never perform a login themselves.

---

## Tech Stack

- **Playwright** `^1.61.1` — test runner and browser automation
- **TypeScript** `^6.0.3`
- **Node.js** `>=18`

---

## Project Structure

```
pages/            → Page Object Model classes (BasePage, AdminPage, DirectoryPage)
tests/
  auth.setup.ts   → login + saves .auth/user.json
  e2e/            → actual test specs (always use storageState, never log in manually)
playwright.config.ts
```

---

## Conventions and Rules

### Page Object Model (POM)

- **Every page or section gets its own Page Object** in `pages/`.
- All Page Objects must **extend `BasePage`**.
- Locators are declared as `readonly` properties in the constructor.
- Methods should be **async** and represent user actions (e.g., `search()`, `setJobTitle()`).
- Methods that wait for network responses should use `page.waitForResponse()` — see `DirectoryPage.search()` and `AdminPage.completeEmployeeName()` as reference.
- **NO assertions (`expect`) in Page Objects**: Keep assertions strictly inside test spec files (`tests/e2e/*.spec.ts`). Page Objects encapsulate structure and actions, while tests perform validations.

### Tests

- Tests live in `tests/e2e/` and use the `e2e-chromium` project (storageState is loaded automatically).
- **Do not add login steps inside test files** — authentication is handled by `auth.setup.ts`.
- Each spec file tests a single feature or page section.
- Inspect `pages/` to **reuse existing Page Objects** and methods before creating duplicates.
- Use `expect` assertions in the spec file on Page Object locators or return values, not inside Page Object methods.
- **AAA Pattern (Arrange-Act-Assert)**: Always structure tests with explicit comments:
  - `// Arrange`: Page Object initialization, navigation, and initial state setup.
  - `// Act`: Executing user interactions (filling forms, selecting dropdowns, clicking buttons).
  - `// Assert`: Performing validations (`expect`) on final state.

### Naming

| What | Convention |
|---|---|
| Page Object files | `PascalCase` + `Page.ts` suffix (e.g., `AdminPage.ts`) |
| Spec files | `kebab-case` + `.spec.ts` suffix (e.g., `user-search.spec.ts`) |
| Locator properties | `camelCase` noun (e.g., `searchButton`, `cardResult`) |
| Action methods | `camelCase` verb (e.g., `search()`, `setJobTitle()`) |
| Query methods | `camelCase` with `get` prefix (e.g., `getRowByUsername()`) |

### Locator Strategy (Playwright Priority Hierarchy)

Prefer user-facing and resilient locators in the following strict order of priority:
1. `getByRole()` — **Gold Standard** (e.g., `getByRole('button', { name: 'Save' })`).
2. `getByLabel()` — Ideal for form fields with associated `<label>`.
3. `getByPlaceholder()` — Useful for inputs with placeholder text.
4. `getByText()` / `getByTitle()` / `getByAltText()` — For static UI text, titles, or image alt text.
5. `getByTestId()` — **Dedicated escape hatch** when accessible attributes are unavailable (`data-testid`).
6. **CSS / XPath**: Use only as a last resort when no role-based or test-id locators are available (e.g., custom framework dropdowns), and document why.
- Avoid `nth()` unless strictly necessary — and document why.

---

## Playwright Projects

| Project name | Purpose |
|---|---|
| `setup` | Runs `auth.setup.ts`, saves session to `.auth/user.json` |
| `e2e-chromium` | Runs all specs in `tests/e2e/` with pre-loaded session |

The `e2e-chromium` project **depends on** `setup`, so running `npx playwright test` always runs setup first.

---

## Files to Never Modify

- `.auth/user.json` — auto-generated, gitignored
- `playwright-report/` — auto-generated
- `test-results/` — auto-generated

---

## Adding a New Page Object

1. Create `pages/NewSectionPage.ts` extending `BasePage`.
2. Declare locators as `readonly` in the constructor.
3. Implement action and query methods following the naming conventions above.
4. Create `tests/e2e/new-section-feature.spec.ts` importing the new Page Object.
5. Update `README.md` → **Project Structure** and **Page Objects** sections.
