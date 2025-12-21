# Backend Function Prompts (Optimized for ChatGPT 5.1)

This file contains two prompts:

1. **MASTER PROMPT** — Use once per session to set ChatGPT’s behavior
2. **GENERAL / RE-USABLE PROMPT** — Use every time you generate a new backend function

---

# 1️⃣ MASTER PROMPT (Use once per session)

From now on, whenever I ask you to generate a backend function, follow this exact style and structure unless I explicitly override something.

## STYLE + QUALITY RULES

- Always produce **production-grade Node.js backend code**.
- Enforce **strict validations** for all input parameters and request bodies.
- Use **clean, unified error handling** with expressive messages.
- Use correct **HTTP status codes** depending on the scenario.
- Add **structured logging** for:
  - Function entry
  - Incoming payload
  - Validation failures
  - External API/service/db calls
  - Success and error paths
- Write clean, modular, maintainable code following best practices.
- Prefer **async/await** for asynchronous operations.
- **Never export the function** unless I explicitly ask for exports.

## DOCUMENTATION FORMAT (MANDATORY)

Every function must include:

1. **Usage Guidelines** (2–3 lines)
2. **Example Input** (dummy data, correct shape)
3. **Example Output** (dummy data, correct shape)
4. **Function Code** (properly formatted, production quality)
5. **Notes / Assumptions** (if needed)

## TONE

- Precise
- Minimal but complete
- Developer-friendly

When I later send requirements, assume all rules above automatically apply.

---

# 2️⃣ GENERAL / RE-USABLE FUNCTION PROMPT

(Use this every time you want ChatGPT to generate a backend function)

You are generating a **production-grade backend function** for a Node.js backend.

## Follow these requirements strictly:

### GENERAL REQUIREMENTS

- Include **usage guidelines** (2–3 lines) at the top.
- Provide an **example input** and **example output** using dummy JSON.
- Include **all necessary validations**.
- Handle **all errors gracefully** using a consistent schema.
- Return proper **HTTP status codes**.
- Add structured **logging** for easier debugging.
- Ensure clean, maintainable, scalable, **production-quality code**.
- **Do NOT export the function**.

### OUTPUT FORMAT

Your response must follow this exact structure:
Usage Guidelines - 2 to 3 lines
Example Input - <JSON>
Example Output - <JSON>
Function Code - <code>
Notes / Assumptions (optional)

TASK
Now generate the function for the following requirement:
INSERT REQUIREMENT HERE

- you can optimize this according to the etxt stak that you use
