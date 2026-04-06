# GitHub EMU Configuration Guide

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://congiuluc.github.io/github-emu-configuration-guide/)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![i18next](https://img.shields.io/badge/i18next-26-26A69A?logo=i18next&logoColor=white)](https://www.i18next.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Done with GitHub Copilot](https://img.shields.io/badge/Done%20with-GitHub%20Copilot-8957e5?logo=githubcopilot&logoColor=white)](https://github.com/features/copilot)

An interactive, step-by-step wizard to configure **GitHub Enterprise Managed Users (EMU)** with SSO, SCIM provisioning, GitHub Copilot, and GitHub Advanced Security — fully localized in 5 languages.

🌐 **Live Demo:** [https://congiuluc.github.io/github-emu-configuration-guide/](https://congiuluc.github.io/github-emu-configuration-guide/)

---

## Overview

Setting up GitHub Enterprise Managed Users involves multiple steps across identity providers, SSO configuration, SCIM provisioning, and optional features like Copilot and Advanced Security. This guide provides a structured, interactive walkthrough that adapts to your specific setup choices.

The wizard generates a tailored configuration guide based on your selections, with detailed substeps, verification checkpoints, official documentation links, and contextual tips and warnings. It covers **48 configuration steps** (24 for Data Residency, 24 for Standard mode), each with multiple substeps, verification checks, and links to official GitHub documentation.

## Why This Guide?

Configuring GitHub Enterprise Managed Users is complex — it touches identity providers (Entra ID, Okta), SSO protocols (SAML, OIDC), SCIM provisioning, Copilot licensing, Advanced Security, and enterprise policies. The official documentation is comprehensive but spread across many pages with no single linear path to follow.

This wizard solves that by:

- **Eliminating guesswork** — Every step is sequenced in the correct order with explicit prerequisites
- **Adapting to your setup** — Select your IdP, SSO protocol, and modules; the guide shows only relevant steps
- **Replacing placeholders automatically** — Enter your enterprise name once; all URLs, SAML endpoints, and SCIM endpoints update everywhere
- **Tracking progress** — Checkbox-based verification per substep, saved to `localStorage`
- **Generating onboarding emails** — Localized welcome email templates with IDE setup instructions, ready to send to your users

## Features

### Configuration Engine

- **Adaptive Wizard** — Dynamically adjusts the step sequence based on your configuration choices (IdP, protocol, modules)
- **Two Enterprise Modes**
  - **With Data Residency** — For enterprises on `GHE.com` with region-specific data storage (EU, etc.)
  - **Standard** — For enterprises on `github.com`
- **Identity Provider Support**
  - **Microsoft Entra ID** — SAML and OIDC protocols, Conditional Access integration, SCIM via Entra ID Gallery App
  - **Okta** — SAML protocol, SCIM via Okta OIN App
- **Configurable Modules** — Toggle on/off to customize the guide:
  - **SSO & SCIM provisioning** — Always included (core EMU setup)
  - **GitHub Copilot** — Enablement, policy configuration, model selection, premium request budgets, seat assignment, IDE setup (VS Code, JetBrains, Visual Studio)
  - **Organization & Repository Management** — Org creation, repository policies, PAT policies, IP allow lists, Actions policies, audit log streaming
  - **GitHub Advanced Security** — GHAS enablement, code scanning (CodeQL), secret scanning with push protection, Dependabot alerts & updates, Security Overview

### Localization & Internationalization

- **5 Languages** — Full localization in English, Italian, French, German, and Spanish
- **133 UI translation keys** — All labels, buttons, tooltips, and headings are translated
- **1,500+ step translation fields per language** — Every step title, description, action, verification, detail, prerequisite, warning, and tip is translated
- **Lazy-loaded translations** — Step translations are code-split and loaded on demand to keep the initial bundle small
- **Language persistence** — Selected language saved to `localStorage` and restored on next visit
- **Enterprise name substitution** — Works across all languages — translated text also gets `YOUR-ENTERPRISE` replaced with your actual enterprise name

### Email Templates

- **Dynamic generation** — Email content adapts to your configuration (Data Residency vs Standard, IdP type, Copilot enabled/disabled)
- **Per-IDE instructions** — VS Code, Visual Studio 2026, and JetBrains IDE setup instructions specific to your enterprise mode
- **Localized** — Email subject, greeting, body, section headings, and closing are all translated
- **One-click compose** — `mailto:` link with pre-filled subject and body for quick sending
- **Copy-friendly** — Rendered in a formatted card for easy copy-paste

### User Experience

- **Interactive Tour** — Guided walkthrough highlighting key UI elements for first-time users
- **Progress Tracking** — Checkbox-based progress per substep, visually tracked in the sidebar with completion counts
- **State Persistence** — All progress (checked items, enterprise name, configuration) saved to `localStorage`
- **Inline Documentation** — Direct links to official GitHub documentation embedded in every substep
- **Copyable URLs** — One-click copy for SAML ACS URLs, Entity IDs, SCIM endpoints, and other configuration values
- **Responsive Three-Panel Layout** — Step navigation sidebar (left), main content (center), contextual links and resources (right)
- **Scroll-to-top on navigation** — Clicking a sidebar step scrolls the page to the top

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 19 | UI framework with hooks and functional components |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety across ~8,500 lines of code |
| [Vite](https://vite.dev/) | 8 | Build tool with HMR and code-splitting |
| [React Router](https://reactrouter.com/) | 7 | Client-side routing with mode/step URL structure |
| [i18next](https://www.i18next.com/) | 26 | Internationalization framework |
| [react-i18next](https://react.i18next.com/) | 17 | React bindings for i18next with hooks |

## Supported Languages

| Language | Code | UI (133 keys) | Wizard Steps (48) | Email Templates (25 keys) |
|----------|------|:---:|:---:|:---:|
| English  | `en` | ✅ | ✅ (base) | ✅ |
| Italiano | `it` | ✅ | ✅ | ✅ |
| Français | `fr` | ✅ | ✅ | ✅ |
| Deutsch  | `de` | ✅ | ✅ | ✅ |
| Español  | `es` | ✅ | ✅ | ✅ |

## Architecture

### Data Flow

```
User Config (IdP, Protocol, Modules, Enterprise Name)
    │
    ▼
getSteps(config, enterpriseName)      ← Filters & builds steps from wizardData.ts
    │                                    Injects dynamic SSO step (SAML/OIDC × Entra/Okta)
    │                                    Injects dynamic email template
    │                                    Replaces YOUR-ENTERPRISE in English text
    ▼
translateSteps(steps, enterpriseName) ← Overlays translated text from lazy-loaded JSON
    │                                    Replaces YOUR-ENTERPRISE in translated text
    ▼
React Components render localized, personalized steps
```

### Translation System

The app uses a **translation overlay** pattern rather than key-based step content:

1. **English is the base** — All 48 steps (6,700+ lines) are defined in `wizardData.ts` as TypeScript objects with full English content
2. **Translations overlay** — For non-English languages, a separate JSON file per language contains translated versions of each step's fields (title, description, substep actions, etc.)
3. **Lazy loading** — Translation files are `import()`-ed on demand and cached. Only the selected language's translations are loaded
4. **Fallback** — If a translation is missing for any field, the English original is displayed
5. **Enterprise replacement** — `YOUR-ENTERPRISE` placeholders in both English and translated text are replaced with the user's enterprise name

### URL Routing

```
/                          → Landing page (configuration selection)
/{mode}/{step-slug}        → Step view
  mode:  dr | standard
  step:  prerequisites | create-enterprise | billing | ...
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

### Installation

```bash
git clone https://github.com/congiuluc/github-emu-configuration-guide.git
cd github-emu-configuration-guide
npm install
```

### Development

```bash
npm run dev
```

Opens the app at `http://localhost:5173/`.

### Build

```bash
npm run build
```

Produces a production build in the `dist/` folder. Translation files are code-split into separate lazy-loaded chunks (~180–200 KB each, gzipped ~45 KB).

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Choose your language** — Click the flag switcher in the header (🇬🇧 🇮🇹 🇫🇷 🇩🇪 🇪🇸)
2. **Select your Identity Provider** — Entra ID (recommended, supports SAML & OIDC) or Okta (SAML)
3. **Choose SSO protocol** — SAML or OIDC (Entra ID only)
4. **Toggle optional modules** — Orgs & Policies, GitHub Copilot, GitHub Advanced Security
5. **Choose enterprise type** — With Data Residency (`GHE.com`) or Standard (`github.com`)
6. **Enter your enterprise name** — All placeholder URLs (SAML ACS, SCIM endpoints, Enterprise URLs) update automatically
7. **Follow the step-by-step guide** — Each step includes:
   - Numbered substeps with detailed actions
   - Configuration details (expandable)
   - Verification checkpoints to confirm completion
   - Links to official GitHub documentation
   - Warnings for common pitfalls and tips for best practices
8. **Track your progress** — Checkboxes per substep, completion count in the sidebar
9. **Onboard your users** — Use the generated welcome email template (localized, with IDE setup instructions) in the final "Notify Users" step

### Step Coverage

The guide covers the complete EMU lifecycle:

| Phase | Steps (Data Residency) | Steps (Standard) |
|-------|:---:|:---:|
| **Foundation** — Prerequisites, Enterprise creation, Billing | 3 | 3 |
| **Identity** — Setup user, SAML/OIDC SSO, SCIM provisioning | 3 | 3 |
| **Organization** — Teams & groups, Orgs & repos, Enterprise policies | 3 | 3 |
| **Copilot** — Enable, Policies, Models, Features, Premium, Seats, Web, IDEs | 8 | 8 |
| **Security** — GHAS enable, Code scanning, Secret scanning, Dependabot, Security Overview | 5 | 5 |
| **Go-Live** — Verification, User notification | 2 | 2 |
| **Total** | **24** | **24** |

## Project Structure

```
├── index.html              # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/                 # Static assets
│   ├── favicon.svg         # GitHub Invertocat favicon
│   └── icons.svg
└── src/
    ├── App.tsx             # Main app with routing and state management
    ├── main.tsx            # React entry point
    ├── wizardData.ts       # All wizard steps, substeps, and configuration logic (6,700+ lines)
    ├── index.css           # Global styles
    ├── style.css           # Component styles
    ├── i18n/
    │   ├── index.ts            # i18next configuration and initialization
    │   ├── stepTranslations.ts # Translation overlay engine with lazy loading
    │   ├── locales/            # UI translation strings per language
    │   │   ├── en.json         #   133 keys — labels, buttons, tooltips, email templates
    │   │   ├── it.json
    │   │   ├── fr.json
    │   │   ├── de.json
    │   │   └── es.json
    │   └── steps/              # Wizard step translations (lazy-loaded per language)
    │       ├── it.json         #   48 steps, 248 substeps, 1,500+ translated fields
    │       ├── fr.json
    │       ├── de.json
    │       └── es.json
    ├── components/
    │   ├── Landing.tsx         # Landing page with configuration options
    │   ├── LanguageSwitcher.tsx # Language selector with inline SVG flag icons
    │   ├── SidebarLeft.tsx     # Step navigation sidebar with progress tracking
    │   ├── SidebarRight.tsx    # Contextual links, resources, and doc references
    │   ├── StepContent.tsx     # Main step content renderer with email template card
    │   ├── Tour.tsx            # Interactive guided tour overlay
    │   ├── CopyableUrl.tsx     # URL display with one-click copy-to-clipboard
    │   └── Icons.tsx           # SVG icon components
    └── utils/
        └── renderText.tsx      # Markdown-like text rendering (bold, links, code)
```

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **TypeScript objects for step data** (not JSON) | Enables dynamic step generation (SSO variants, email templates), type safety, and conditional logic within step definitions |
| **Translation overlay** (not key-based) | English content stays readable in source code; translations are additive overlays rather than replacing everything with opaque keys |
| **Lazy-loaded translations** | Step translation files are ~180 KB each; loading all 4 upfront would add ~720 KB to initial bundle |
| **`localStorage` for state** | Zero-backend architecture — all progress, configuration, language preference, and enterprise name persist client-side |
| **Dynamic SSO step builder** | 4 combinations (SAML/OIDC × Entra/Okta) generate different step content at runtime instead of maintaining 4 static step variants |
| **Dynamic email template builder** | Email content varies by Data Residency mode, IdP type, and Copilot toggle — built at runtime using i18n keys |
| **Inline SVG flags** | Emoji flags render inconsistently across OS/browsers (especially Windows); inline SVGs ensure consistent rendering everywhere |

## Contributing

Contributions are welcome! If you find inaccuracies in the guide steps or want to add support for additional identity providers or languages:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

### Adding a New Language

1. Create a new locale file in `src/i18n/locales/` (e.g. `ja.json`) with all 133 UI keys (use `en.json` as the template)
2. Create a step translation file in `src/i18n/steps/` (e.g. `ja.json`) with all 48 step translations (title, shortTitle, description, substeps with action/verification/details, prerequisites, warnings, tips)
3. Add `email.*` keys to the locale file (25 keys for the email template)
4. Add the lazy-import in `src/i18n/stepTranslations.ts` (`ja: () => import('./steps/ja.json')`)
5. Register the language in `src/i18n/index.ts` resources
6. Add a flag SVG component and button in `src/components/LanguageSwitcher.tsx`

### Updating Step Content

All step content lives in `src/wizardData.ts`. When updating English content, remember to update the corresponding fields in each language's translation file under `src/i18n/steps/`.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [GitHub Enterprise Managed Users Documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users)
- [GitHub Data Residency Documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency)
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Advanced Security Documentation](https://docs.github.com/en/enterprise-cloud@latest/code-security/getting-started/github-security-features)
- Built with [GitHub Copilot](https://github.com/features/copilot)
