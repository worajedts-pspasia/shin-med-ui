import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "Shin Medical UI",
    brandUrl: ".",
  }),
  // Every top-level group starts collapsed; Storybook still expands the
  // group that contains the selected story. Ids are the slugged root titles.
  sidebar: {
    collapsedRoots: ["design-system", "ui", "charts", "recipes", "medical", "task-management"],
  },
})
