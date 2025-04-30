[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=19363861)
# TFA 
- **Author:** Himar Edhey Hernández Alonso
- **Subject:** Lenguage Processing
- **Email:** alu0101552392@ull.edu.es
- **GitHub:** [Edhey](https://github.com/Edhey)

## Initial TFA Goals
The goal of my TFA project is to migrate the current calculator language transpiler into a fully Langium-based implementation. So we need to:
- Define the grammar for the calculator language using Langium.
- Build a Language Server Protocol that supports syntax highlighting, error detection, and basic validation in Visual Studio Code.
- Redo the JavaScript code generator to migrate the original functionality of converting calculator programs into executable JavaScript from recast to Langium.

In summary, with this project we will make a user-friendly environment for the calculator language, allowing users to write the code easily.

### Example
The code generation should be similar to the original calculator language:

**DSL code example:**
```calculator
f = fun(x) { 2*x },
g = fun(x) { 3*x },
h = g + f,
k = g * f,
print(h(1+i)), # 5 + 5i
print(k(2-i)) # 18 - 24i
```

**Expected JavaScript transpile:**
```javascript
let $f, $g, $h, $k; 
(((($f = functionObject(function ($x) { 
  return Complex('2').mul($x); }),
    $g = functionObject(function ($x) { returnComplex('3').mul($x); })),
    $h = $g.add($f)),
    $k = $g.mul($f)),
print($h(Complex('1').add(Complex('i'))))), print($k(Complex('2').sub(Complex('i'))));
```

But now when coding in VSCode it should:
- Highlight keywords (`fun`, `write`), operators (`+`, `-`, etc.), literals, and identifiers.
- Report syntax errors (missing parentheses, incorrect expressions, etc.).
- Report semantic errors (calling a function/variable that hasn't been declared).
---

### Tasks
We will divide our project in 6 main tasks:
1. **Define the Grammar**:
   - We must create the `.langium` grammar file for the calculator language.
     - We will use reference examples like [Langium MiniLogo](https://github.com/TypeFox/langium-minilogo) for this task.
     - The grammar should be similar to the original calculator language, so it needs to include:       
       - **Literals** (`1`, `2.3`, `true`, `false`)
         - **Complex numbers** (`1.5 + 2.3i`)
         - **Booleans** (`true`, `false`)
         - **Strings** (`"Hello, World!"`)
       - **Keywords** (`fun`, `write`)
       - **Operators** (`+`, `-`, `*`, `/`).
       - **Expressions** (`a + b`, `a * b`),
       - **Variables** (`variable`),
       - **Assignments** (`a = 5`),
       - **Functions** (`fun add(x, y) { x + y }`).

2. **AST Generation and Validation**:
   - I will use the Langium geneartion to create TypeScript AST classes.
     - The AST classes aren't the manual recast AST anymore, so we will need to adapt the code generation to this new structure.
   - Implement syntax validation (matching parentheses, correct structure).
   - Implement semantic validation (variables must be declared before use).

3. **Syntax Highlighting**:
   - Needed to define tokens for keywords, identifiers, operators, etc.
   - Then configure the VSCode extension to provide syntax highlighting.

4. **JavaScript Code Generation**:
   - Now we need to adapt the code generation to the new AST structure.
     - We need to traverse the new Langium AST.
     - Ensure that the behavior matches the original calculator.

5. **Testing and Packaging**:
   - Test creation for correct and incorrect examples is needed.
   - Our goal is to pass the old code generation test and add new tests for the new features.
   - When all is ready we package the finished extension for Visual Studio Code.

6. **Final Documentation**:
   - Write a complete README with instructions about how to use the extension.
   - Include examples, screenshots, and detail instructions.
---

### Evaluation of Difficulties
**Expected Difficulties**:
The Langium learning curve could be steep, especially for:
- Properly defining the calculator grammar (handling operator precedence, parentheses).
  - Build the priority of the Langium grammar rules to ensure correct parsing.
  - Our original calculator language has a complex grammar that could be difficult to translate.
  - If I run out of time, I will focus on a simple calculator grammar.
- Understand Langium ASTs generation and validations.
  - Langium uses a different approach than the original transpiler.
  - I will need to learn how to use Langium's AST classes and how to validate it.
- Maintain the original functionality of the transpiler could be challenging.
  - The original logic for code generation, scoping and validation must be adapted to the new AST structure.
  - I will need to ensure that the generated JavaScript code behaves the same as the original transpiler.
- Apply syntax highlighting and validation to the language server with VSCode.
  - I need to learn how to configure the VSCode extension for syntax highlighting and validation.
  - Ensure that the language server communicates correctly with the VSCode client could be tricky.

**Estimated Time**: 25–30 hours
| Task | Estimated Hours |
|:-----|:---------------:|
| Environment setup | 2h |
| Grammar definition | 6h |
| AST generation and syntax validation | 5h |
| Semantic validation | 5h |
| Syntax highlighting setup | 3h |
| Code generation | 6h |
| Testing, documentation, packaging | 3h |

**Fallback Plan**:
If necessary, I will focus on a simpler grammar first, ensuring grammar definition, parsing, highlighting, and semantic validation are completed. Then, if time allows, I will work on maintaining the original functionality of the transpiler.
---

### Tools and Technologies
- **Languages**: TypeScript, JavaScript
- **Frameworks and Libraries**:
  - [Langium](https://langium.org/)
  - [Node.js](https://nodejs.org/)
- **Editor**:
  - [Visual Studio Code](https://code.visualstudio.com/)
  - Langium LSP extension
- **References**:
  - [Langium MiniLogo Example](https://github.com/TypeFox/langium-minilogo)
  - [Learning Langium Course](https://github.com/ULL-ESIT-PL/learning-langium)
  - Langium Grammar Language documentation
- **AI Assistance**:
  - I will use Github Copilot for assistance with explanations, examples, debugging suggestions.
---

### Methodologies
I will follow the next methodologies in the project:
- **TDD** for validators: start by writing failing tests for syntax/semantic errors.
- **Automation scripts**: Use the scripts provided for make testing easier.
- **Version control**: Regular commits in Git with descriptive messages.
- **GitHub Project Board**: Track progress in the project board. [GitHub Project Board](https://github.com/orgs/ULL-ESIT-PL-2425/projects/496)
---

### Conclusion
By the end of this project, I will have successfully migrated the calculator language into a Langium-based DSL with:
- Syntax highlighting.
- Syntax and semantic validation.
- JavaScript code generation.
- Packaged as a working VSCode extension.

To sum up, in this project I will demonstrate my ability to design a domain-specific language, develop a full language server, and integrate it into a modern development environment.
---