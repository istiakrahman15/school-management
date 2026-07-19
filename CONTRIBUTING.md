# Contributing to SmartSchool OS

Thank you for your interest in contributing to **SmartSchool OS**! We welcome contributions from everyone.

---

## 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/smartschool-os.git
   cd smartschool-os
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Seed** the database:
   ```bash
   npx tsx src/db/seed.ts
   ```
5. **Run** the development server:
   ```bash
   npm run dev
   ```

---

## 🌿 Branching Strategy

- `main` — Stable, production-ready code
- `develop` — Integration branch for features
- `feature/your-feature-name` — For new features
- `fix/issue-description` — For bug fixes

Always branch off from `develop`:

```bash
git checkout develop
git checkout -b feature/your-feature-name
```

---

## 📋 Pull Request Guidelines

1. **One PR per feature/fix** — Keep PRs focused and small
2. **Describe your changes** — Include what, why, and how
3. **Test your changes** — Ensure `npm run build` passes with no errors
4. **Follow the code style** — TypeScript, consistent naming, no `any` types where avoidable
5. **Update docs** — If you add a feature, update the README accordingly

### PR Title Format
```
feat: add student ID card PDF generator
fix: resolve attendance date filter bug
chore: update drizzle-orm to v0.46
docs: improve deployment guide
```

---

## 🐛 Reporting Bugs

Open a GitHub issue and include:
- Your OS and Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Error messages or screenshots

---

## 💡 Feature Requests

Open a GitHub issue labeled **`enhancement`** and describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

---

## 🧑‍💻 Code Style

- **TypeScript** — All new code must be typed
- **Zod** — Use existing schemas in `src/lib/validations.ts` for form validation
- **Server Actions** — All data mutations go in `src/actions/`
- **Drizzle ORM** — All DB queries use Drizzle; no raw SQL unless absolutely necessary
- **Components** — Reuse existing UI components from `src/components/ui/`

---

## 🙏 Code of Conduct

Be kind, inclusive, and respectful. We follow the [Contributor Covenant](https://www.contributor-covenant.org/) Code of Conduct.

---

Built with ❤️ by [Istiak Rahman](https://devistiak.eu.cc/)
