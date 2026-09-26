import type { ThemeName } from '../../types/index';
import type { ThemeConfig } from './types';
import { codeVibes } from './code-vibes';
import { gaming } from './gaming';
import { daProjects } from './da-projects';
import { food } from './food';

export type { ThemeConfig, ThemeModalConfig, ThemeGameoverBackBtnConfig, ThemeExitBtnConfig, ThemeScoreBoxConfig, ThemeResultConfig } from './types';

export const THEMES: Record<ThemeName, ThemeConfig> = {
  'code-vibes': codeVibes,
  'gaming': gaming,
  'da-projects': daProjects,
  'food': food,
};

/**
 * Returns the config for a given theme name.
 * @param name - The theme to look up.
 * @returns The theme's full visual configuration.
 */
export function getTheme(name: ThemeName): ThemeConfig {
  return THEMES[name];
}

/**
 * Returns the themed preview illustration for the settings screen.
 * @param name - The theme to render a preview for.
 * @returns HTML markup for the preview `<figure>`.
 */
export function getThemePreviewHtml(name: ThemeName): string {
  const theme = THEMES[name];
  return `
    <figure class="settings__preview-figure">
      <img class="settings__preview-img" src="${theme.previewImage}" alt="${theme.name} preview" />
      <figcaption class="visually-hidden">${theme.name} board preview</figcaption>
    </figure>
  `;
}
