# Java Security Checklist (Reference)

This file provides a quick checklist and reference points for the security phase of the Java Code Review skill. Keep it concise; expand only with project- or organization-specific guidance.

## General Principles

- Validate and sanitize all untrusted input (HTTP requests, messages, files, environment variables).
- Enforce authentication and authorization on sensitive operations.
- Minimize data exposure in logs and error messages.
- Prefer well-maintained security libraries over custom cryptography or security code.

## Common Java Security Checks

- Use parameterized queries or ORM query parameters; never concatenate untrusted data into SQL/JPQL/HQL.
- Avoid building shell commands from untrusted input; use safe APIs when possible.
- Do not log secrets, passwords, tokens, or full PII.
- Use strong, modern cryptographic algorithms and configurations.
- Use `SecureRandom` for security-sensitive randomness.
- Avoid unsafe deserialization of untrusted data (`ObjectInputStream` without validation).
- Validate and normalize file paths before use to prevent path traversal.

Customize this file with any team-specific rules, frameworks in use (e.g., Spring Security), or regulatory requirements (e.g., GDPR, PCI-DSS).

