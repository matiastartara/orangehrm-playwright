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

### Tests

- Tests live in `tests/e2e/` and use the `e2e-chromium` project (storageState is loaded automatically).
- **Do not add login steps inside test files** — authentication is handled by `auth.setup.ts`.
- Each spec file tests a single feature or page section.
- Use `expect` assertions on Page Object locators or return values, not raw `page` locators.

### Naming

| What | Convention |
|---|---|
| Page Object files | `PascalCase` + `Page.ts` suffix (e.g., `AdminPage.ts`) |
| Spec files | `camelCase` + `.spec.ts` suffix (e.g., `userSearch.spec.ts`) |
| Locator properties | `camelCase` noun (e.g., `searchButton`, `cardResult`) |
| Action methods | `camelCase` verb (e.g., `search()`, `setJobTitle()`) |
| Query methods | `camelCase` with `get` prefix (e.g., `getRowByUsername()`) |

### Locator strategy

- Prefer **role-based locators** (`getByRole`, `getByText`) over CSS selectors.
- Use CSS selectors only when role-based alternatives are not available (e.g., `DirectoryPage`'s dropdowns).
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
4. Create `tests/e2e/newSectionFeature.spec.ts` importing the new Page Object.
5. Update `README.md` → **Project Structure** and **Page Objects** sections.
