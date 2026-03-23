# Contributing to aidecl-web

Thanks for your interest in contributing to the AI Declaration web tool.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Start the dev server: `npm run dev`
5. Open http://localhost:3000

## Development

- App Router pages in `src/app/`
- Reusable components in `src/components/`
- UI primitives (shadcn) in `src/components/ui/`
- Shared utilities in `src/lib/`
- Custom hooks in `src/hooks/`

## Code Style

- TypeScript throughout
- 2-space indentation
- Tailwind CSS for styling (no inline styles)
- Components are client-side (`"use client"` where needed)

## Pull Requests

1. Create a feature branch from `main`
2. Make focused changes (one feature or fix per PR)
3. Run `npm run build` and verify the static export works
4. Submit the PR with a clear description of changes

## Reporting Issues

Use [GitHub Issues](https://github.com/ai-declaration/web/issues) for bugs and feature requests.

## License

By contributing, your work will be licensed under the Apache License 2.0.
