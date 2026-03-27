---
name: java-code-review
description: Systematically reviews Java source code for correctness, security, performance, maintainability, and dependency/license risk. Use when the user asks to review Java code, Java diffs, or Java files/directories for potential bugs, vulnerabilities, performance issues, or design problems.
---

# Java Code Review

This skill guides a thorough, structured review of Java code. It defines how to gather input, which review phases to run (in order), how to classify severities, and the exact output format.

## When to Use

Use this skill whenever:

- The user asks to **review Java code**, **review a Java PR/changeset**, or **audit Java classes or packages**.
- The user provides **`.java` files**, **Java directories**, or **diff/patch content**.
- The user wants feedback on **correctness, security, performance, maintainability**, or **dependency/license risks** in a Java codebase.

If the code is not Java, do not apply this skill.

## Input Handling

First, determine what the user provided and gather the code accordingly:

- **Direct code in the conversation**
  - Treat the provided Java snippets or files as the full review target.
  - If multiple snippets clearly belong to different files or classes, track them separately by a synthetic file name (e.g., `Snippet 1 (User message)`).

- **File path or list of file paths**
  - Read the specified `.java` files.
  - If non-Java files are included, only review Java files, but you may read build files (`pom.xml`, `build.gradle`, `build.gradle.kts`) when relevant for dependency/license review.

- **Directory path**
  - Recursively find all `.java` files under the directory.
  - If the set is **large (more than ~50 Java files)**:
    - Explain briefly that a full review may be too large for a single pass.
    - Ask the user which **packages**, **modules**, or **specific files** to prioritize.
    - Until they respond, choose reasonable focus areas like:
      - Files that appear in **diffs** or are newly added.
      - Files with names like `*Controller`, `*Service`, `*Repository`, `*Manager`, `*Util`, or security/auth-related names.

- **Diff or patch content**
  - Parse the diff and focus on the **changed lines plus small surrounding context** (e.g., the containing method and nearby related logic).
  - Consider pre-existing surrounding code only insofar as it interacts with the changes (e.g., a new call site into an unsafe method).
  - In findings, be explicit that the issue is in **new or modified code**, unless it clearly predates the change.

If a mix of these input types appears, prioritize:

1. Explicit file/directory paths mentioned by the user
2. Diff/patch content
3. Inline code snippets

## Review Phases (Run in Order)

Always execute the phases in this order. You may skip a phase only if it is clearly not applicable (e.g., no external dependencies for license review), but state that it was skipped and why.

### Phase 1: Correctness and Bug Detection

Examine code for:

- **Null safety**
  - Nullable parameters without checks.
  - Potential `NullPointerException` paths (including chained calls).
  - Misuse of `Optional` (e.g., calling `get()` without checking presence, or using `Optional` as a field type where not appropriate).
  - Whenever dealing with a potential null value that requires a default value, prefer `Objects.requireNonNullElse(...)` for clarity and safety.
- **Resource leaks**
  - Unclosed streams, files, sockets, database connections, or locks.
  - Missing `try-with-resources` for `AutoCloseable` resources where applicable.
- **Error handling**
  - Empty `catch` blocks or blocks that only comment/log without acting when action is clearly needed.
  - Catching overly broad exceptions (e.g., `Exception`, `Throwable`) when more specific types are available.
  - Swallowed exceptions (logged but not surfaced when necessary, or ignored entirely).
  - Missing `finally` or equivalent cleanup when resources must be released or state reset.
- **Concurrency**
  - Unsynchronized access to shared mutable state.
  - Race conditions due to unsafe publication or double-checked locking **without** `volatile`.
  - Misuse of `volatile` (e.g., expecting it to provide atomic compound operations).
  - `ConcurrentModificationException` risks from modifying collections during iteration.
- **Logic errors**
  - Off-by-one errors in loops or index usage.
  - Incorrect operator precedence or missing parentheses in complex expressions.
  - Unreachable code or dead branches.
  - Broken `equals`/`hashCode` contracts (e.g., using mutable fields, not including all equality-defining fields).
- **API misuse**
  - Incorrect use of Java Collections or Streams (e.g., modifying collections while streaming, misuse of terminal operations).
  - Misuse of Date/Time API (e.g., using legacy `Date`/`Calendar` incorrectly when `java.time` is available).
  - Using `==` for `String` or boxed types comparison instead of `.equals()` / `.equalsIgnoreCase()`.

### Phase 2: Security Review

Before this phase, **read** `references/security-checklist.md` in the skill directory to recall any project-specific or additional security considerations.

Check for:

- **Injection**
  - SQL injection via string concatenation in queries (including JPQL/HQL and native queries).
  - Command injection (e.g., building shell commands from untrusted input).
  - LDAP, XPath, or other injection vectors caused by building query strings from untrusted input.
  - Log injection (e.g., logging untrusted input without sanitization when logs are security-relevant).
- **Authentication and authorization**
  - Hardcoded credentials, tokens, or API keys.
  - Missing authorization checks on sensitive operations (e.g., admin-only endpoints).
  - Insecure token handling (e.g., storing tokens in logs, weak token generation).
- **Data exposure**
  - Sensitive data (passwords, tokens, PII, financial data) in logs, exceptions, or error messages.
  - Unmasked PII in serialized responses or error payloads.
- **Cryptography**
  - Use of weak algorithms (`MD5`, `SHA-1`) for security purposes (as opposed to non-security checksums).
  - Hardcoded cryptographic keys, IVs, or salts.
  - Insecure randomness (`Math.random()` or `Random` used for security tokens instead of `SecureRandom`).
- **Deserialization**
  - Untrusted `ObjectInputStream` usage without type validation.
  - Custom serialization that accepts data from untrusted sources without validation.
- **Input validation**
  - Missing or insufficient validation of external input (HTTP parameters, JSON payloads, environment variables, config, etc.).
  - Path traversal risks (e.g., accepting user-controlled file paths and using them directly).
  - Lack of size/range bounds on potentially large or unbounded inputs.

### Phase 3: Performance Analysis

Before this phase, **read** `references/performance-patterns.md` in the skill directory for patterns, trade-offs, and common pitfalls.

Check for:

- **Algorithmic complexity**
  - Clear \(O(n^2)\) or worse patterns in hot paths (nested loops over large collections, repeated linear scans).
  - Repeated expensive lookups that could be cached or indexed.
- **Memory**
  - Excessive object creation inside tight loops (e.g., new `StringBuilder` or temporary objects per iteration).
  - Large collections held longer than necessary.
  - Missing initial capacities for collections when size is known or easily estimated.
  - Look out for memory leaks where objects are no longer needed but still referenced, preventing garbage collection and potentially leading to `OutOfMemoryError` or hard-to-diagnose performance degradation.

#### Look out for memory leaks

Memory leaks happen when objects are no longer being used but are still referenced by the program. This means they cannot be garbage collected and will stay in memory until the program exits, which can lead to `OutOfMemoryError` exceptions or gradual performance degradation.

Java’s garbage collector usually handles memory cleanup automatically, but leaks can still occur in several common cases:

- **Unclosed resources**: Always ensure resources are closed after use, especially files, database connections, and network sockets. Prefer `try-with-resources` for `AutoCloseable` types, but at minimum verify that code closes resources reliably, for example:

```java
FileInputStream fis = new FileInputStream("file.txt");
// do something with the file
fis.close();
```

- **Overuse of static references**: Static variables live for the lifetime of the classloader. If they hold references to large object graphs, those objects will never be collected. Watch for static collections or caches that grow unbounded. For example:

```java
class Session {
  static User[] users;
}
```

In this example, the `users` array will stay in memory for the entire lifetime of the program. As the array grows, the application may run into memory issues unless entries are explicitly removed or the design is revised to avoid long-lived static state.
- **String handling**
  - `String` concatenation in loops instead of using `StringBuilder`, `StringBuffer`, or stream collectors.
  - Unnecessary `String.format` in hot paths where simpler concatenation or builders suffice.
- **I/O**
  - Unbuffered I/O streams or readers/writers where buffering would significantly reduce overhead.
  - N+1 query patterns (especially in ORMs) caused by repeated lazy-loading in loops.
  - Missing connection pooling or misconfigured pools.
  - Synchronous blocking I/O on performance-critical or latency-sensitive paths where asynchronous alternatives exist.
- **Collections**
  - Suboptimal collection choices for the access pattern (e.g., `List` used as a `Set`, linear search instead of map lookup).
  - Unnecessary copying of large collections when views or streams would suffice.
  - Missing pre-sizing for `ArrayList`, `HashMap`, etc., when cardinality is known.
- **JVM considerations**
  - Excessive autoboxing/unboxing in tight loops (e.g., using `List<Integer>` instead of primitive arrays where critical).
  - Use of finalizers or `Object.finalize()` (deprecated and harmful to performance).
  - Potential classloader leaks (e.g., static references to classloader-scoped resources in long-lived contexts).

### Phase 4: Code Quality and Maintainability

Check for:

- **Design**
  - God classes or methods doing too many things.
  - Excessive coupling between layers or modules.
  - Violations of Liskov substitution (e.g., overridden methods weakening postconditions or strengthening preconditions).
  - Missing encapsulation (public fields, leaking internal mutable state).
- **Naming**
  - Unclear or misleading variable/method/class names.
  - Violations of Java naming conventions:
    - `camelCase` for methods and variables.
    - `PascalCase` for classes and interfaces.
    - `UPPER_SNAKE_CASE` for constants.
- **Complexity**
  - Methods exceeding ~30 lines, or clearly doing too much.
  - Cyclomatic complexity > ~10 (many branches, nested conditionals).
  - Deeply nested conditionals (>3 nested levels) that could be refactored.
- **Duplication**
  - Repeated logic that should be extracted to a helper method or shared utility.
  - Copy-pasted code between classes or methods.
- **Documentation**
  - Missing or inadequate Javadoc on public API methods and classes.
  - Outdated comments that contradict current behavior.
  - Overly verbose or redundant comments that restate what the code obviously does.
- **Testing gaps**
  - Public methods without any apparent tests (where tests would be expected).
  - Missing edge-case tests (null/empty collections, boundary values, error paths).
  - Test methods without assertions or with trivial assertions that cannot realistically fail.
- **AI-generated code smells**
  - Calls to hallucinated or non-existent APIs.
  - Overly verbose boilerplate where standard library or existing utilities would suffice.
  - Unnecessary wrapper classes or abstractions adding indirection without clear value.
  - Generic or ambiguous variable names (`data`, `result`, `temp`, `info`) that obscure intent.
  - Contradictory or parroted comments that simply restate the code.
  - `TODO`, `FIXME`, or obvious placeholder blocks left unimplemented.
  - Inconsistent patterns within the same file (e.g., mixing builder and constructor styles, mixing streams and loops for identical tasks).
  - Dead code or unreachable branches suggesting generation artifacts.

Additionally, always check for **unused imports** and remove them (or recommend their removal) after the review to keep files clean and avoid unnecessary dependencies.

### Phase 5: Dependency and License Review

This phase is relevant when:

- Build files (`pom.xml`, `build.gradle`, `build.gradle.kts`) are available; or
- Import statements reference third-party libraries beyond the Java standard library.

In this phase:

- **License compatibility**
  - Identify dependencies with copyleft licenses (e.g., GPL, AGPL, LGPL) in proprietary or permissively licensed projects.
  - Flag any dependency whose license is clearly incompatible with the project's declared license (if known).
- **License presence**
  - Note dependencies with no discernible license (treat as all-rights-reserved and risky).
- **Copyleft obligations**
  - Highlight LGPL dependencies that appear to be linked statically (versus dynamic linking).
  - Flag GPL dependencies in non-GPL projects.
  - Flag AGPL dependencies in network services where source disclosure obligations may apply.
- **Transitive risk**
  - Be aware that a permissively licensed library can itself depend on a copyleft library, causing copyleft obligations to propagate.
  - When uncertain, explicitly say that a more detailed dependency scan (e.g., using build tooling or SBOM) is needed.
- **Deprecated or unmaintained libraries**
  - Call out dependencies with known end-of-life status, clearly archived repositories, or no activity for 2+ years (based on documentation or comments, if present).
- **Duplicate functionality**
  - Note where multiple libraries solve the same problem (e.g., both Guava and Apache Commons for similar utilities), increasing maintenance and license risk.

If live license data or repository metadata is not available, base your assessment on:

- Comments or documentation in the project.
- Known common licenses for well-known libraries (e.g., Apache 2.0 for many Apache projects, MIT for many small utilities), while clearly labeling any uncertainty.

## Severity Levels

Assign exactly one severity to each finding:

- **S1 – CRITICAL**
  - Will cause data loss, security breach, or production failure.
  - Must be fixed immediately.
- **S2 – HIGH**
  - Likely to cause bugs, performance degradation, or security weakness in production.
  - Should be fixed **before merge**.
- **S3 – MEDIUM**
  - Code smell, maintainability issue, or minor bug risk.
  - Should be addressed but may be deferred with justification.
- **S4 – LOW**
  - Style issue, naming suggestion, or minor improvement.
  - Optional to address, primarily for consistency and readability.

If multiple issues share the same location, you may either:

- Use one finding with the **highest severity**, describing all related issues; or
- Split distinct concerns into separate findings, each with its own severity and explanation.

## Output Format

Always structure your review output with the following sections, in order.

### 1. Summary

Provide a **2–3 sentence overview** that includes:

- What the reviewed code or change set appears to do (at a high level).
- Overall quality assessment (e.g., solid with minor issues, risky due to security gaps).
- The most important finding or two (especially any S1/S2 issues).

### 2. Findings

List each finding in **descending severity order** (all S1, then S2, then S3, then S4). For ties, order by file and then by line number or method.

Use this template for each finding:

```markdown
[S{n}] {Category}: {Brief title}

- **Location**: {File and line number, or method/class name if line unknown}
- **Issue**: {What is wrong and why it matters}
- **Suggestion**: {Concrete fix or refactor. Include a short code snippet when helpful.}
```

**Category** examples: `Correctness`, `Security`, `Performance`, `Maintainability`, `Design`, `Testing`, `Dependency/License`, etc.

When suggesting a fix, prefer brief, focused code snippets that directly illustrate the improvement, not full file rewrites.

For diff-based reviews, clearly indicate when a finding concerns:

- **New/changed code** (primary focus), or
- **Pre-existing code** that is now impacted by or closely related to the changes.

### 3. Positive Observations

List **1–3 things the code does well**, such as:

- Good separation of concerns or clear layering.
- Clean, expressive method and variable names.
- Thorough error handling and logging.
- Use of modern Java features or libraries appropriately.

Keep this section concise but specific.

### 4. Summary Table

End with a simple count table:

```markdown
Severity | Count
-------- | -----
S1 CRITICAL | n
S2 HIGH | n
S3 MEDIUM | n
S4 LOW | n
```

Ensure the counts match the findings above.

## Additional Guidelines

- **Be specific**
  - Reference exact line numbers, method names, and variable names whenever possible.
  - Tie your reasoning to concrete code examples.
- **Provide concrete fixes**
  - Prefer actionable recommendations over vague advice.
  - When in doubt, show a minimal code change or pattern that resolves the issue.
- **Avoid nitpicking**
  - Do not flag pure style preferences (such as brace placement) unless the file mixes inconsistent styles or clearly harms readability.
- **Scope for diffs**
  - Focus primarily on **changed lines** and the immediately related context.
  - Flag pre-existing issues only when they directly interact with the changes or significantly affect their safety.
- **Large codebases**
  - If the code is too large for a single thorough review, explain this briefly.
  - Divide the review into logical sections (e.g., per package/layer) and summarize each, then provide a consolidated summary.
- **State assumptions**
  - When code intent is ambiguous, state your assumptions explicitly in the finding rather than silently assuming.

