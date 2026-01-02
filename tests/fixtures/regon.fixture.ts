import { test as base, expect, Page } from '@playwright/test';

type RegonFixtures = {
  regonPage: {
    open: () => Promise<void>;
    searchByRegon: (value: string) => Promise<void>;
    getErrorMessage: () => Promise<string>;
    getCompanyName: () => Promise<string>;
  };
};

export const test = base.extend<RegonFixtures>({
  regonPage: async ({ page }, use) => {

    const regonPage = {
      open: async () => {
        await page.goto('https://wyszukiwarkaregon.stat.gov.pl/appBIR/index.aspx');
      },

      searchByRegon: async (value: string) => {
        await page.locator('#txtRegon').fill(value);
        await page.getByRole('button', { name: /szukaj/i }).click();
      },

      getErrorMessage: async () => {
        const error = page.locator('#divInfoKomunikat');
        await expect(error).toBeVisible();
        return (await error.innerText()).trim();
      },

      getCompanyName: async () => {
        const name = page.locator('table >> text=/(spółka|oddział|Sp\\. z o\\. o\\.|Sp\\. z o\\.o\\.|S\\. A\\.|S\\.A\\.)/i').first()
        await expect(name).toBeVisible();
        return (await name.innerText()).trim();
      }
    };

    await use(regonPage);
  }
});

export { expect };