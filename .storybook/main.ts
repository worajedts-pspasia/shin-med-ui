import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx|mdx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  // Auto-generated Docs pages (props tables from TypeScript) for every component.
  tags: ["autodocs"],
  typescript: {
    // react-docgen-typescript crashes with this repo's TS 6 toolchain
    // (undefined program); the bundled react-docgen parser is stable and
    // still fills autodocs prop tables from our declared argTypes.
    reactDocgen: "react-docgen",
  },
}

export default config
