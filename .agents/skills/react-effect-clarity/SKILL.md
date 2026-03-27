---
name: react-effect-clarity
description: Applies React effect discipline—named effects, one responsibility, effects for external synchronization only, derived state and event handlers elsewhere. Use when writing or reviewing React/Expo/React Native hooks (useEffect, subscriptions, timers, DOM/native APIs).
source: https://neciudan.dev/name-your-effects
---

# React: Effect Clarity & Responsibility

Effects are **synchronization**, not general logic. If it does not sync React state/UI with something **outside** React, it probably should not be an effect.

## When to Use

- Writing or refactoring **`useEffect`** (and related patterns: subscriptions, timers, `useLayoutEffect` when appropriate).
- Reviewing React/Expo/React Native components in this repo (`mobile/`, shared UI).
- Deciding between **effect**, **derived value**, **event handler**, or **custom hook**.

## Repository Context

- The app uses **Expo** and **React Native**. “External systems” include **native modules**, **AppState**, **keyboard**, **dimensions/orientation**, **Linking**, **WebSockets**, **timers**, and **imperative APIs**—not only browser DOM.

## Rules (Apply Consistently)

### 1. Name Every Effect

Never use anonymous effect callbacks.

- **Do:** `useEffect(function updateDocumentTitle() { ... }, [deps]);`
- **Don’t:** `useEffect(() => { ... }, [deps]);`

**Why:** Intent, stack traces, reviews, and debugging.

### 2. Name = Responsibility

If the name is vague, the design is wrong.

- **Bad:** `syncState`, `handleStuff`, `updateThings`
- **Good:** `connectToWebSocket`, `fetchInitialStock`, `applyUserTheme`, `trackWindowWidth`

### 3. “AND” Rule — Split Effects

If the name needs “and”, split into separate effects by concern.

### 4. Effect or Not? (Decision Tree)

| Question | Prefer |
|----------|--------|
| Is this **derived** from props/state? | Compute during render (e.g. build `fullName` from `first` and `last` in one expression) |
| Is this triggered by a **user action**? | Do it in the **event handler** (e.g. submit then reset) |
| Is this **syncing with an external system**? | **Effect** (APIs, sockets, DOM/native APIs, timers, subscriptions) |

### 5. Valid vs Invalid Effects

- **Valid:** connect/subscribe, fetch on mount or when external key changes, timers, imperative maps/widgets, theme/document/native sync.
- **Usually invalid:** syncing state to state, reacting only to internal flags, orchestrating business logic across chained effects.

### 6. One Effect, One Responsibility

Multiple small named effects beat one large anonymous effect.

### 7. Symmetrical Cleanup

Name cleanup to match setup:

```ts
useEffect(function pollServer() {
  const id = setInterval(fetchData, 5000);
  return function stopPollingServer() {
    clearInterval(id);
  };
}, []);
```

### 8. Prefer Inline Named Functions

Keep the effect body as a **named function expression** inside `useEffect` so context stays local. Avoid passing a **distant** top-level function unless reuse is clear.

### 9. Custom Hooks

**Extract** when logic is reusable, owns coherent state, or maps to a clear domain concept (e.g. `useWindowWidth`). **Keep inline** for one-off, tightly coupled behavior.

### 10. Anti-Patterns

- `useEffect(() => setX(y), [y])` — derived/sync state (prefer derive or fix data flow).
- Chained effects that ping-pong `a` → `b` → `a`.
- Business orchestration **only** in effects with no clear external system.

### 11. Mental Model

- **Avoid:** “When does this run?”
- **Prefer:** “What **external system** am I synchronizing with?”

## TL;DR

- Name every effect; one responsibility; no “and” in names.
- Prefer **derived state** and **event handlers** over effects when they fit.
- Effects = **external sync** only; use naming to surface bad design.
