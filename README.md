> [!Warning]
This project is not officially associated with the ADAN language, which is why it is under my username. I am working on getting it there and have been talking with the creator privately. As announced to me, they started writing their own LSP after this was already published. I am trying to work on not deleting anything and continue to improve this. Maintaining high standards and all. It's a lot to manage. For anything official related to ADAN, you can go to the following [organization at https://github.com/Cappucina](https://github.com/Cappucina). For the link to download this, you can access it at [https://marketplace.visualstudio.com/items?itemName=pinkqween.adan-lsp](https://marketplace.visualstudio.com/items?itemName=pinkqween.adan-lsp)


# Below this is AI-generated


# ADAN-LSP

ADAN-LSP adds language support for the ADAN programming language to Visual Studio Code.

## Features

- Syntax highlighting via TextMate grammar
- File association for `.adn` and `.adan` files
- Support for string interpolation using `${...}`, including nested interpolation and quoted strings inside interpolation
- A minimal ADAN file icon theme (selectable under `Preferences: File Icon Theme`)

## How to test (developer)
1. Run the extension in the Extension Development Host (F5 in VS Code).
2. Open one of the example files in `adanExamples/` (e.g., `my-program.adn`, `interpolation_dollar.adn`, `interpolation_quoted_string.adn`).
3. You should see ADAN syntax highlighting and `${...}` interpolations highlighted with punctuation and inner tokens.

# ADAN-LSP — Visual Studio Code extension for ADAN

<div align="center">
	<h1>The ADAN Programming Language</h1>
	<p>Writing safe and reliable reusable code to make things a whole lot easier.</p>
</div>

---

ADAN is a statically typed, memory safe programming language that strives to introduce a strict and safe type system that primarily focuses on preventing possible memory leaks and unstable code. ADAN's syntax is familiar to C developers and aims to preserve a low learning curve.

ADAN was developed by [Lily](https://github.com/transicle), [Kauht](https://github.com/kauht), and [Leo](https://github.com/nvttles).

> [!WARNING]
> This is Lily's first C project; the language and tools are actively under development. Expect changes and improvements over time. If you find a bug or want to contribute, please file a GitHub issue or open a PR in the ADAN repository.

---

## About this extension

ADAN-LSP is a Visual Studio Code extension that provides the initial language support for ADAN. At the moment, this extension focuses on syntax and editor UX support and provides a foundation for a future full LSP integration.

The extension currently offers:

- Syntax highlighting for ADAN via a TextMate grammar (`syntax/adan.tmLanguage.json`).
- Language file associations for `.adan` and `.adn` files (`contributes.languages`).
- Support for string interpolation `${...}` (including nested interpolations and quoted strings within interpolation).
- An example ADAN file icon theme (selectable under **Preferences: File Icon Theme** > `ADAN File Icon Theme`).
- A sample developer command: `ADAN: Hello World` (available from the Command Palette).

Planned / future work:

- Add a Language Server (LSP) to provide diagnostics, code completions, go-to-definition, and other workspace features.
- Additional grammar/tokenization improvements and snippets.
- Expanded tests and CI configuration for syntax and tokens.

---

## Quick Start

1. Install the extension (if published) from the marketplace, or run it locally by opening the project in VS Code and pressing `F5`.
2. Open an ADAN source file (i.e. `*.adan` or `*.adn`). The editor should automatically select the ADAN language mode and apply syntax highlighting.
3. To test the ADAN file icon, open the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and select `Preferences: File Icon Theme` → `ADAN File Icon Theme`.

Example files are available in `adanExamples/`.

---

## Development

Clone the repository, open it in VS Code, and follow the steps below:

1. Install dependencies

```bash
yarn install
```

2. Build and compile

```bash
yarn compile
```

3. Run the extension in a new Extension Development Host window

- Press `F5` from within VS Code to start the Development Host.

4. Tests

```bash
yarn test
```

5. Packaging the extension as a VSIX

Install `vsce` (global) and run:

```bash
npm i -g vsce
vsce package
```

Note: Packaging can fail if README or other required fields remain in the default template state. Make sure `README.md` and `package.json` fields are correct.

---

## Example usage / snippets

Open any file from `adanExamples/` to see the grammar in effect. Some notable examples using interpolation:

```
print("Hello, ${W$orld}!\n");
print("This demonstrates nested: ${outer${inner}}\n");
print("Quoted interpolation: ${\"W$orld\"}\n");
```

The grammar tokenizes the `${` and `}` as punctuation and scopes inner tokens within interpolation separately.

---

## Contributing

Contributions are welcome!

- File issues or feature requests in this repository.
- Add tests to cover new grammar or editor features.
- For language development, open a PR against the official ADAN repository: https://github.com/Cappucina/ADAN

Please follow the repository's contributing guidelines and code of conduct.

---

## License

Please add a `LICENSE` file to the project if you wish your code to be used under an open-source license. The MIT license is commonly used for VS Code extensions.

---

## Notes

- The extension icon in `package.json` must be a PNG; `vsce` does not accept SVG for the published icon. The extension ships with a placeholder `images/adan-icon.png`.
- The `engines.vscode` version is set in `package.json` to match the `@types/vscode` dev dependency. When publishing, ensure this value matches the lowest supported VS Code version you want to support.

If you'd like, I can add a simple LSP server scaffold, scope-based token tests, or a VS Code quickstart snippet to demonstrate how to extend the extension with an actual language server.
