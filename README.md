# LML-CLI
[LML](https://github.com/lml-dom/lml-js) conversion tool for command line

## Install
`npm install --global lml-cli`

## Usage
`lml [options] path/to/source/file.ext`

### Options
  `--from=TYPE`               available: `ast`, `html`, `json`, `lml`
  `--to=TYPE`                 available: `ast`, `html`, `json`, `lml`
  `--indentation=SPEC`        spaces or tab - use `s` or `t` (default: `ss`)
  `--input-indentation=SPEC`  forced indentation parsing for LML input (default: automatic recoginition)
  `--line-wrap=N`             attempt to keep output line length less than this value (default: 120)
  `--minify`                  minimizing whitepsace in HTML, JSON, and AST outputs
  `--no-order-attributes`     keep original attribute order
  `--out=FILE`                save to file (default: output to console)
