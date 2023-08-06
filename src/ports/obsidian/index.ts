import { AuraAPI } from 'core'
import { copyExtraFiles } from 'core/modules'
import { resolve } from 'path'

export async function ObsidianPort(Aura: AuraAPI) {
  const { createPort, createReadme, colorSchemes, constants } = Aura
  const templateFolder = resolve(__dirname, 'templates')
  const { info, folders } = constants

  const portName = 'Obsidian'
  const version = '1.0.0'
  const themeName = 'Aura Theme'
  const outputDist = resolve(folders.distFolder, 'obsidian', themeName)
  const compactName = 'aura-obsidian-theme'
  const guh = true

  await createPort({
    outputDist,
    template: resolve(templateFolder, themeName, 'package.json'),
    replacements: {
      compactName,
      version,
    },
  })

  await createPort({
    outputDist,
    template: resolve(templateFolder, themeName, 'manifest.json'),
    replacements: {
      themeName,
    },
  })
  // Both the dark and dark soft variations are within this file
  // controlled via a plugin
  await createPort({
    outputDist,
    template: resolve(templateFolder, themeName, 'theme.css'),
    replacements: {
      ...colorSchemes.dark,
      ...withDarkSoftScheme(colorSchemes),
    },
  })

  await copyExtraFiles(__dirname, outputDist)

  await createReadme({
    template: resolve(templateFolder, 'README.md'),
    replacements: {
      portName,
      version,
    },
  })
}

// Taken from:  https://github.com/daltonmenezes/aura-theme/blob/7ea467f5c5b554275b0a6983631bc22b0d860e1e/src/ports/termux/index.ts#L31C5-L31C5
function withDarkSoftScheme(colorSchemes: AuraAPI['colorSchemes']) {
  return Object.entries(colorSchemes.softDark).reduce(
    (acc, [key, value]) => {
      return {
        ...acc,
        [`${key}Soft`]: value,
      }
    },
    {}
  )
}
