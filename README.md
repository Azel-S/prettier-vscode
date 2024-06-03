# Prettier-er Formatter for Visual Studio Code

[Prettier-er](https://github.com/OpenMindedPrettier) is an open-minded code formatter based on Prettier. It provides additional configuration options, allowing you to tailor the formatting rules to better suit your project's needs.


<p align="center">
  <em>
    JavaScript
    · TypeScript
    · Flow
    · JSX
    · JSON
  </em>
  <br />
  <em>
    CSS
    · SCSS
    · Less
  </em>
  <br />
  <em>
    HTML
    · Vue
    · Angular
  </em>
  <em>
    HANDLEBARS
    · Ember
    · Glimmer
  </em>
  <br />
  <em>
    GraphQL
    · Markdown
    · YAML
  </em>
</p>

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=omp.prettier-er">
    <img alt="VS Code Marketplace Downloads" src="https://img.shields.io/visual-studio-marketplace/d/omp.prettier-er"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=omp.prettier-er">
    <img alt="VS Code Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/omp.prettier-er"></a>
</p>

## Installation

Install through VS Code extensions. Search for `Prettier-er`

[Visual Studio Code Market Place: Prettier-er - Code formatter](https://marketplace.visualstudio.com/items?itemName=omp.prettier-er)

Can also be installed in VS Code: Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.

```
ext install omp.prettier-er
```

## Prettier-ER

Prettier-er is built off of Prettier, and as such, shares most of its archecture with Prettier. The following documentation is largely centered around Prettier-er, focusing on the changes in this version of the formatter.

For full documentation of the original formatter, visit [Prettier Docs](https://prettier.io/docs/en/).

### Default Formatter

To ensure that this extension is used over other extensions you may have installed, be sure to set it as the default formatter in your VS Code settings. This setting can be set for all languages or by a specific language.

```json
{
  "editor.defaultFormatter": "omp.prettier-er",
  "[javascript]": {
    "editor.defaultFormatter": "omp.prettier-er"
  }
}
```

If you want to disable Prettier-er on a particular language you can either create a `.prettierignore` file or you can use VS Code's `editor.defaultFormatter` settings.

The following will use Prettier-er for all languages except Javascript.

```json
{
  "editor.defaultFormatter": "omp.prettier-er",
  "[javascript]": {
    "editor.defaultFormatter": "<another formatter>"
  }
}
```

The following will use Prettier-er for only Javascript.

```json
{
  "editor.defaultFormatter": "<another formatter>",
  "[javascript]": {
    "editor.defaultFormatter": "omp.prettier-er"
  }
}
```

Additionally, you can disable format on save for specific languages if you don't want them to be automatically formatted.

```json
{
  "[javascript]": {
    "editor.formatOnSave": false
  }
}
```

### Visual Studio Code Settings

You can use [VS Code settings](#prettier-er-settings) to configure prettier. Settings will be read from (listed by priority):

1. [Prettier configuration file](https://prettier.io/docs/en/configuration.html)
1. `.editorconfig`
1. Visual Studio Code Settings (Ignored if any other configuration is present)

> NOTE: If any local configuration file is present (i.e. `.prettierrc`) the VS Code settings will **NOT** be used.

## Usage

### Using Command Palette (CMD/CTRL + Shift + P)

```
1. CMD + Shift + P -> Format Document
OR
1. Select the text you want to Prettify-er
2. CMD + Shift + P -> Format Selection
```

### Formatting using Menu Bar

```
1. Click on the menu bar at the top of VS Code
2. Type '>' followed by a space.
3. Choose Format Document from the list. Type the command partially if you cannot find it.
```
> The above can also be followed to use the "Analyze Document (Metrics)" functionality.

### Changes from Prettier-er

### Formatting Additions

Prettier-er primarily adds optional code style formatting choices that change how the formatter works. Each of these can be enabled in VS Code's workspace settings, and are enumerated in [Prettier-er Settings](#Prettier-er-Settings).

### Allman Style




## Settings

### Prettier-er Settings

All Prettier and Prettier-er options can be configured directly in this extension.

> Below are Prettier-er unique settings. All can be changed through your VS Code workspace settings.

prettier.forceObjectBreak
prettier.matrixArray
prettier.allmanStyle
prettier.getSetOneLine
prettier.elseStatementNewLine
prettier.multiEmptyLine
prettier.retainBlankLines
prettier.selectorsSameLine
prettier.lineLengthRead
prettier.nestingCountRead
prettier.memAccessRead
prettier.commentToCodeRatioRead
prettier.whitespaceRatioRead
prettier.IDCountRead
prettier.IDMinLengthRead

> These are the base Prettier Settings. Information on them will not be provided here, please reference the Prettier documentation for more information.
> The default values of these configurations are always to their Prettier 2.0 defaults. In order to use defaults from earlier versions of prettier you must set them manually using your VS Code settings or local project configurations.

```
prettier.arrowParens
prettier.bracketSpacing
prettier.endOfLine
prettier.htmlWhitespaceSensitivity
prettier.insertPragma
prettier.singleAttributePerLine
prettier.bracketSameLine
prettier.jsxBracketSameLine
prettier.jsxSingleQuote
prettier.printWidth
prettier.proseWrap
prettier.quoteProps
prettier.requirePragma
prettier.semi
prettier.singleQuote
prettier.tabWidth
prettier.trailingComma
prettier.useTabs
prettier.vueIndentScriptAndStyle
prettier.embeddedLanguageFormatting
```


## Error Messages

**Failed to load module. If you have prettier or plugins referenced in package.json, ensure you have run `npm install`**

When a `package.json` is present in your project and it contains prettier, plugins, or linter libraries this extension will attempt to load these modules from your `node_module` folder. If you see this error, it most likely means you need to run `npm install` or `yarn install` to install the packages in your `package.json`.

**Your project is configured to use an outdated version of prettier that cannot be used by this extension. Upgrade to the latest version of prettier.**

You must upgrade to a newer version of prettier.

**This workspace is not trusted. Using the bundled version of prettier.**

You must trust this workspace to use plugins and local/global modules. See: [Workspace Trust](https://code.visualstudio.com/docs/editor/workspace-trust)
