import {addons} from "@storybook/manager-api"
import {create} from "@storybook/theming"

addons.setConfig({
    theme: create({
        base:"dark",
        brandTitle : "Cazelabs | MetProAi",
        brandUrl : "https://www.cazelabs.com/",
        brandImage:"/Caze-Logo-Colour-Transparent.webp",
        brandTarget:"_self"
    })
})

