# Contributing to AI Declaration Format Web Tool

Thanks for your interest in contributing to the AI Declaration Format web tool.

## Reporting Issues

Use [GitHub Issues](https://github.com/ai-declaration/web/issues) for bug reports and feature requests. Include your browser and OS when reporting bugs.

## Proposing Changes

1. Check existing issues and pull requests first
2. For non-trivial changes, open an issue to discuss the approach
3. Once agreed, submit a pull request

## Development Setup

```bash
git clone https://github.com/ai-declaration/web.git
cd web
npm install
npm run dev
```

Open http://localhost:3000 to see the app.

## Project Structure

- `src/app/` - App Router pages
- `src/components/` - Reusable components
- `src/components/ui/` - UI primitives (shadcn)
- `src/lib/` - Shared utilities
- `src/hooks/` - Custom React hooks

## Code Style

- TypeScript throughout
- 2-space indentation
- Tailwind CSS for styling (no inline styles)
- Components use `"use client"` directive where needed
- Keep components focused and well-named

## Building

```bash
npm run build
```

The app is statically exported. Make sure the build completes without errors before submitting a PR.

## Pull Request Process

1. Fork the repository and create a branch from `main`
2. Make focused changes (one feature or fix per PR)
3. Run `npm run build` and verify the static export works
4. Submit a pull request with a clear description

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Please read it before participating.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).

## Questions

Open an issue if you have questions about contributing.
