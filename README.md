[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19363861)
# TFA 
**Author:** Himar Edhey Hernández Alonso
**Subject:** Lenguage Processing
**Email:** alu0101552392@ull.edu.es
**GitHub:** [Edhey](https://github.com/Edhey)

# Initial TFA Goals

## Explanation of the Goals
The goal of my TFA project is to **migrate** the existing **calculator language transpiler** to a **fully Langium-based implementation**.  
This involves:
- Defining the **grammar** of the calculator language using **Langium**.
- Building a **Language Server (LSP)** that provides **syntax highlighting**, **error detection**, and **basic validation** in **VSCode**.
- Implementing a **JavaScript code generator** to maintain the original functionality of transpiling calculator programs into executable JavaScript code.

This project will combine **language design**, **language server development**, and **toolchain integration**, providing a complete environment for users of the calculator language to write, debug, and potentially run their code.

---

## Examples and Illustrations
The code generation should be similar to the original calculator language:

```calculator
fun add(x, y) { x + y }
a = add(2, 3)
write(a)
```

Expected transpiled JavaScript:

```javascript
function add(x, y) { return x + y; }
let a = add(2, 3);
console.log(a);
```

But now VSCode should:
- Highlight keywords (`fun`, `write`), operators (`+`), literals (`numbers`), and identifiers.
- Report syntax errors (e.g., missing parentheses).
- Validate semantic issues (e.g., calling an undeclared function).

---

## Strategies and Translation Scheme
The strategy to achieve the migration consists of **five main steps**:

1. **Grammar Definition**:
   - Write the Langium `.langium` grammar file describing the calculator language.
   - I will reference on examples such as [Langium MiniLogo](https://github.com/TypeFox/langium-minilogo)
   - The grammar should be similar to the original calculator language, it contains:
     - **Complex Numbers**: `1.5 + 2.3i`
     - **Expressions**: `a + b`, `a * b`
     - **Variables**: `a = 5`
     - **Functions**: `fun add(x, y) { x + y }`

2. **AST Generation and Validation**:
   - Use Langium’s built-in `npx langium generate` to generate TypeScript AST classes.
   - Implement **syntax** validation: e.g., balanced parentheses, correct expressions.
   - Implement **semantic** validation: e.g., variables must be declared before use.

3. **Syntax Highlighting**:
   - Define token types for syntax elements (keywords, identifiers, operators).
   - Configure highlighting rules in the VSCode extension.

4. **JavaScript Code Generator**:
   - Now we must traverse through the Langium AST.
   - We should maintain the original functionality of the old transpiler.

5. **Testing and Packaging**:
   - Test parsing, validation, highlighting, and code generation.
   - Prepare demo files (`.calc`) with correct and incorrect examples.
   - Package the VSCode extension.

6. **Final Documentation**
   - Complete README and project documentation.
   - Prepare demo examples and screenshots.
---

## Evaluation of Difficulties
**Expected Difficulties**:
- Properly defining the calculator grammar (handling operator precedence, parentheses).
  - Build the priority of the Langium grammar rules to ensure correct parsing.
  - Our original calculator language has a complex grammar that could be difficult to translate.
  - If I run out of time, I will focus on a simple calculator grammar.
- Understanding Langium's way of modeling ASTs and validations.
  - Langium uses a different approach than the original transpiler.
  - I will need to learn how to use Langium's AST classes and validation framework.
- Maintaining the original functionality of the transpiler could be challenging.
  - I will need to ensure that the generated JavaScript code behaves the same as the original transpiler.
  - I will need to understand the original transpiler's code generation logic.
- Integrating the language server with VSCode for syntax highlighting and validation.
  - I will need to learn how to configure the VSCode extension for syntax highlighting and validation.
  - Ensure that the language server communicates correctly with the VSCode client could be tricky.

**Time Estimation**:
| Task | Estimated Hours |
|:-----|:---------------:|
| Environment setup | 2h |
| Grammar definition | 6h |
| AST generation and syntax validation | 5h |
| Semantic validation | 5h |
| Syntax highlighting setup | 3h |
| Code generation | 6h |
| Testing, documentation, packaging | 3h |

**Total Estimated Hours**: **25-30 hours**.
**Fallback Plan**:
- If time runs short, I will focus first on **grammar**, **parsing**, **highlighting**, and **semantic validation** of a simple calculator language.
- I will maintain the original functionality of the transpiler if time allows.

---

## Languages, Libraries and Tools
- **Languages**: TypeScript, JavaScript
- **Libraries and Frameworks**:
  - [Langium](https://langium.org/)
  - [Node.js](https://nodejs.org/)
- **Editors and Extensions**:
  - [Visual Studio Code](https://code.visualstudio.com/)
  - [Langium Official Visual Extension](https://langium.org/docs/introduction/#vscode-extension)
- **References**:
  - [Langium MiniLogo Example](https://github.com/TypeFox/langium-minilogo)
  - [Learning Langium Course](https://github.com/ULL-ESIT-PL/learning-langium)
  - [Langium Documentation](https://langium.org/docs/introduction/)
- **AIs**:
  - I will use Copilot for assistance with explanations, examples, debugging suggestions.

---

## Methodologies
I will follow the next methodologies in the project:
- **TDD** for validators: start by writing failing tests for syntax/semantic errors.
- **Automation scripts**: Use the scripts provided for make testing easier.
- **Version control**: Regular commits in Git with descriptive messages.
- **GitHub Project Board**: Track progress in the project board. [GitHub Project Board](https://github.com/orgs/ULL-ESIT-PL-2425/projects/496)

---

# Conclution
By the end of the project, I will have migrated the calculator language into a **Langium-based DSL** with:
- Syntax highlighting,
- Syntax and semantic validation,
- JavaScript code generation,
- Packaged as a working VSCode extension.

With this project I will demonstrate my ability to **design a language**, **build a language server**, and **integrate it into a modern editor**.