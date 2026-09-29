import { useEffect } from "react"
import type { Preview } from "@storybook/react-vite"
import i18n, { setLocale, type Locale } from "../src/i18n"
import "../src/index.css"

const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    viewport: {
      viewports: {
        mobile390: {
          name: "Mobile 390 (iPhone)",
          styles: { width: "390px", height: "844px" },
        },
        tablet768: {
          name: "Tablet 768",
          styles: { width: "768px", height: "900px" },
        },
        desktop1280: {
          name: "Desktop 1280",
          styles: { width: "1280px", height: "800px" },
        },
      },
    },
    options: {
      storySort: {
          method: "alphabetical",
          // group ORDER fixed (incl. the regrouped Medical/UI subgroups); stories sort A–Z
          order: [
        "Design System",
        "Task Management",
        ["Medical", ["Introduction", "Medical UI", "Medical Shell", "Medical Component"]],
        ["UI", ["Display", "Input", "Navigation", "Containers", "Chat"]],
      ],
        },
    },
  },
  // Language toolbar (globe icon) — applies i18next locale to every story.
  globalTypes: {
    locale: {
      description: "UI language for localized components",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "th", title: "ไทย" },
          { value: "ja", title: "日本語" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { locale: "en" },
  decorators: [
    (Story, context) => {
      const locale = ((context.globals.locale as Locale) ?? "en") satisfies Locale
      useEffect(() => {
        if (i18n.language !== locale) void setLocale(locale)
      }, [locale])
      return <Story />
    },
  ],
}

export default preview
