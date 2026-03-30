# aidecl-web

Web-based tool for creating, validating, and browsing [AI Declaration Format](https://github.com/ai-declaration) files. All processing happens client-side; no data leaves your browser.

## Features

- **Generator**: build aidecl.yaml declarations through a guided form with live YAML preview, download, copy, and shareable links
- **Validator**: paste or upload YAML/JSON files to validate against the AI Declaration schema (Draft 2020-12)
- **Library**: browse 8 reference examples covering minimal, web app, research, high-risk, enterprise, and more

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, static export)
- [React 19](https://react.dev)
- [TypeScript](https://typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (Radix UI primitives)
- [ajv](https://ajv.js.org) for JSON Schema validation
- [js-yaml](https://github.com/nodeca/js-yaml) for YAML parsing
- Self-hosted Inter font (no external requests)

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## Building

```bash
npm run build
```

Produces a static export in `out/`. No server required. Deploy to any static hosting.

## Deploy

Works with any static hosting:

- **GitHub Pages**: deploy the `out/` folder
- **Netlify**: build command `npm run build`, publish directory `out`
- **Vercel**: import project, framework auto-detected
- **Cloudflare Pages**: build command `npm run build`, output directory `out`

## Related Projects

- [schema](https://github.com/ai-declaration/schema): the specification
- [cli](https://github.com/ai-declaration/cli): CLI tool

## Roadmap

- Syntax highlighting in code preview
- Inline YAML linting
- Diff view between versions
- Guided wizard mode
- Print stylesheet for declarations
- PWA support

## Privacy

All processing is client-side only. No data leaves your browser. No analytics, no tracking, no cookies.

## License

Apache-2.0. See LICENSE and NOTICE.
