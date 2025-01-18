# Nuxt Starter Template Documentation

This Nuxt starter template is a full-stack application boilerplate designed for rapid development and deployment. It integrates essential tools and frameworks like NuxtHub, Tailwind CSS, Drizzle ORM, and Better-Auth, ensuring a smooth development experience. Below is an overview of the template's features, structure, and usage instructions.

## Features

1. **Nuxt 3 Integration**: Built on Nuxt 3 for a modern, performance-driven framework with server-side rendering (SSR) and static site generation (SSG) capabilities.
2. **NuxtHub**: Enhances development with tools and utilities for deploying and managing your Nuxt app on Cloudflare.
3. **Tailwind CSS**: Integrated for rapid, utility-first CSS styling.
4. **Pinia**: Provides state management out of the box.
5. **Drizzle ORM**: Simplifies database management with a lightweight ORM.
6. **Better-Auth**: Offers a streamlined authentication system.
7. **Zod**: Ensures type-safe data validation.
8. **Vue Router and VueUse**: For advanced routing and reusable utilities.

## File Overview

### `package.json`

This file manages dependencies, scripts, and other configurations.

#### Scripts:

- `build`: Builds the production-ready Nuxt application.
- `dev`: Starts the development server.
- `generate`: Generates a static version of the site.
- `postinstall`: Prepares Nuxt after installing dependencies.
- `preview`: Builds and previews the application locally using NuxtHub.
- `db:generate`: Generates database schema using Drizzle Kit.
- `db:migrate`: Applies database migrations using Drizzle Kit.
- `auth:generate`: Generates authentication configuration and schema.

#### Dependencies:

- Core dependencies include Nuxt, Vue, Drizzle ORM, Better-Auth, and Tailwind CSS.
- Development dependencies include TypeScript, Drizzle Kit, Prettier, and Wrangler for Cloudflare Workers.

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/EthanITA/nuxt-template
   cd nuxt-template
   ```

2. **Install Dependencies**:
   Ensure you have PNPM installed, then run:

   ```bash
   pnpm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory to store your environment variables. Refer to `.env.example` for required variables.

4. **Run the Development Server**:

   ```bash
   pnpm dev
   ```

   Access the application at `http://localhost:3000`.

5. **Build and Preview**:

    - Build the application:
      ```bash
      pnpm build
      ```
    - Preview the production build on Cloudflare, locally:
      ```bash
      pnpm preview
      ```

## Deployment

The template is ready to be deployed to NuxtHub or your preferred provider by removing NuxtHub from nuxt.config.ts. Make sure to:

- Configure environment variables in the hosting platform.
- Use `pnpm build` to generate a production-ready version of the app.

## Contribution and Customization

Feel free to modify the template to suit your project requirements. Contributions to improve the starter template are welcome.

### Useful Commands

- **Linting and Formatting**:
  ```bash
  pnpm prettier --write .
  ```
- **Type Checking**:
  ```bash
  pnpm vue-tsc --noEmit
  ```

## Support

If you encounter any issues or have questions, please open an issue in the repository or reach out to the maintainers.

---

Start building with this robust Nuxt starter template and accelerate your development process!

