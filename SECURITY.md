# Security Policy

This repository is an **open sample** of the Chinese Colour Library. It contains no credentials, no
server code, no database access and no links to YIVA Digital's production systems.

## Reporting a vulnerability

Email <hello@yivadigital.com> with a short description and, if possible, reproduction steps. Do not
open a public issue for anything that could be exploited. We aim to reply within 5 working days.

## Scope

In scope: the demo app in `apps/card`, the `@yiva/chinese-colors` package, and the build scripts.
Out of scope: the yivadigital.com website, its APIs, and anything hosted outside this repository.

## What this repository will never contain

- API keys, tokens, cookies or session data.
- `.env` files or production configuration.
- Customer, client or employee data.
- Copies of private source code from YIVA Digital's other projects.

If you believe you have found any of the above, treat it as a security issue and report it privately.

## Automation

- Secret scanning and push protection are enabled on this repository.
- Dependabot watches npm dependencies and GitHub Actions.
- CI builds every pull request and fails on committed secret patterns.
