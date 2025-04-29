# TODO Plan (Sequence of the Subtasks)
**Phase 0: Environment Preparation**
- [ ] Initialize the Langium project (`npm init langium`).
- [ ] Set up project dependencies.

**Phase 1: Grammar and Parser**
- [ ] Write the initial calculator grammar (.langium file).
- [ ] Generate the AST (`npx langium generate`).
- [ ] Create sample `.calc` files and validate parsing.

**Phase 2: Syntax and Semantic Validation**
- [ ] Implement syntax validation (e.g., expected tokens).
- [ ] Implement semantic validation (e.g., variable scoping, function definitions).

**Phase 3: Language Server Features**
- [ ] Define syntax highlighting (keywords, operators, literals).
- [ ] Integrate validation into the language server.

**Phase 4: Code Generation**
- [ ] Rewrite AST-to-JavaScript translation.
- [ ] Implement the code generation logic to maintain original functionality.

**Phase 5: Testing and Packaging**
- [ ] Create unit tests for the validation functions.
- [ ] Write enough test examples.
- [ ] Package and document the VSCode extension.
- [ ] Error messages should be clear and informative.

**Phase 6: Documentation and Finalization**
- [ ] Capture screenshots of syntax highlighting and validation working in VSCode.
- [ ] Write a detailed user guide in the README.md.
- [ ] The GitHub Action for CI is passing
- [ ] The link delivered on campus is clickable and points to the GitHub repository
- [ ] The zip file delivered on campus contains the source code in the repository

---