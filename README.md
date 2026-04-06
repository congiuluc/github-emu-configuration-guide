# GitHub EMU Configuration Guide

[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://congiuluc.github.io/github-emu-configuration-guide/)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

An interactive, step-by-step wizard to configure **GitHub Enterprise Managed Users (EMU)** with SSO, SCIM provisioning, GitHub Copilot, and GitHub Advanced Security.

🌐 **Live Demo:** [https://congiuluc.github.io/github-emu-configuration-guide/](https://congiuluc.github.io/github-emu-configuration-guide/)

---

## Overview

Setting up GitHub Enterprise Managed Users involves multiple steps across identity providers, SSO configuration, SCIM provisioning, and optional features like Copilot and Advanced Security. This guide provides a structured, interactive walkthrough that adapts to your specific setup choices.

The wizard generates a tailored configuration guide based on your selections, with detailed substeps, verification checkpoints, official documentation links, and contextual tips and warnings.

## Features

- **Adaptive Wizard** — The guide dynamically adjusts steps based on your configuration choices
- **Two Enterprise Modes**
  - **With Data Residency** — For enterprises on `GHE.com` with region-specific data storage
  - **Standard** — For enterprises on `github.com`
- **Identity Provider Support**
  - Microsoft Entra ID (SAML & OIDC)
  - Okta (SAML)
- **Configurable Modules**
  - SSO & SCIM provisioning (always included)
  - GitHub Copilot enablement, policies, and seat assignment
  - Organization & repository management with enterprise policies
  - GitHub Advanced Security (code scanning, secret scanning, Dependabot)
- **Progress Tracking** — Checkbox-based progress per substep with visual completion indicators
- **Inline Documentation** — Direct links to official GitHub documentation for every step
- **Enterprise Name Substitution** — Enter your enterprise name and all URLs and examples update automatically
- **Copyable URLs** — One-click copy for configuration URLs relevant to your enterprise
- **Responsive Layout** — Three-panel layout with step navigation sidebar, main content, and contextual links

## Tech Stack

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/) 5.9
- [Vite](https://vite.dev/) 8
- [React Router](https://reactrouter.com/) 7

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

Produces a production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

1. Open the app and select your **Identity Provider** (Entra ID or Okta) and **SSO Protocol** (SAML or OIDC)
2. Toggle optional modules: **Orgs & Policies**, **GitHub Copilot**, **GitHub Advanced Security**
3. Choose your enterprise type: **With Data Residency** or **Standard**
4. Follow the step-by-step guide — each step includes:
   - Detailed actions with substeps
   - Verification checkpoints to confirm completion
   - Links to official GitHub documentation
   - Warnings and tips for common pitfalls
5. Track your progress with the built-in checklist

## Project Structure

```
├── index.html              # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/                 # Static assets
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── App.tsx             # Main app with routing
    ├── main.tsx            # React entry point
    ├── main.ts             # Counter demo entry point
    ├── counter.ts          # Counter module
    ├── wizardData.ts       # All wizard steps, substeps, and configuration logic
    ├── index.css           # Global styles
    ├── style.css           # Component styles
    ├── assets/             # Static image assets
    │   ├── hero.png
    │   ├── typescript.svg
    │   └── vite.svg
    ├── components/
    │   ├── Landing.tsx     # Landing page with configuration options
    │   ├── SidebarLeft.tsx # Step navigation sidebar
    │   ├── SidebarRight.tsx# Contextual links and resources sidebar
    │   ├── StepContent.tsx # Main step content renderer
    │   ├── CopyableUrl.tsx # URL display with copy-to-clipboard
    │   └── Icons.tsx       # SVG icon components
    └── utils/
        └── renderText.tsx  # Text rendering utilities
```

## Contributing

Contributions are welcome! If you find inaccuracies in the guide steps or want to add support for additional identity providers:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is provided as-is for educational and configuration guidance purposes.

## Acknowledgements

- [GitHub Enterprise Managed Users Documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/concepts/identity-and-access-management/enterprise-managed-users)
- [GitHub Data Residency Documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/data-residency/about-github-enterprise-cloud-with-data-residency)
