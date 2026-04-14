# Project Constitution: Snowboarding

This document establishes the non-negotiable principles, coding standards, and architectural constraints for the Snowboarding project. All AI agents and developers must adhere to these rules.

## core_principles

### name: spec_driven_development
### rule:
- All features must begin with a specification (`specification.md`).
- A technical plan (`plan.md`) must be approved before implementation starts.
- Implementation must follow the approved plan and task list.
### rationale: To ensure predictability, quality, and alignment with project goals.

### name: visual_excellence
### rule:
- UI must be premium, modern, and high-fidelity.
- Use curated color palettes, smooth gradients, and micro-animations.
- Avoid generic browser defaults and placeholders.
### rationale: Users should be "wowed" at first glance.

### name: official_tech_stack
### rule:
- Runtime: Node.js 25+
- Frontend: React 18+ (TypeScript), Vite, Tailwind CSS.
- Backend: NestJS (Node.js), Prisma ORM.
- State Management: TanStack Query + Zustand.
- Package Manager: pnpm.
### rationale: As per documentation 01_tech_stack.md and user requirement.

## coding_standards

### implementation_stack
- React 18+ for UI components.
- Tailwind CSS for styling.
- Vite for local development and bundling.
- NestJS for the backend services.

### file_organization
- Follow standard Vite/React project structure.
- Components should be modular and use clean functional components.

## governance

### amendments
- This constitution can be updated by the user or by consensus between the user and AI assistant.
### versioning
- Current Version: 1.0.0
