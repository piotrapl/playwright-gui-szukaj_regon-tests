import { test, expect } from './fixtures/regon.fixture';

// Dane testowe i test case'y dla funkcjonalności wyszukiwania podmiotów wg REGON
// (przypadki negatywne ooraz pozytywne)
// Dane są zgromadzone w tablicach obiektów, a testy iterują przez te tablice
// To model data-driven testing.

test.describe('Wyszukiwanie podmiotów wg REGON – ', () => {

  test.beforeEach(async ({ regonPage }) => {
    await regonPage.open();
  });

  // ---------------------------
  // test case'y negatywne
  // ---------------------------
  const negativeCases = [
    {
      title: 'Liczba znaków w polu REGON (8) jest inna niż 9 lub 14',
      regon: '12345678',
      expectedRegex: /długość|liczba|zawiera|zawierać|.*9.*14|znaków/i
    },
    {
      title: 'Liczba znaków w polu REGON (10) jest inna niż 9 lub 14',
      regon: '1234567891',
      expectedRegex: /długość|liczba|zawiera|zawierać|.*9.*14|znaków/i
    },
    {
      title: 'Podany REGON 9-znakowy: nieprawidłowy - błędna cyfra kontrolna)',
      regon: '123456789',
      expectedRegex: /nieprawidłowy|nieprawidłowa|błędny|błędna/i
    },
    {
      title: 'Podany REGON 14-znakowy jest nieprawidłowy - błędna cyfra kontrolna)',
      regon: '12345678901234',
      expectedRegex: /nieprawidłowy|nieprawidłowa|błędny|błędna/i
    },
    {
      title: 'Podany REGON 9-znakowy jest nieprawidłowy - zawiera minimum 1 znak inny niż cyfra',
      regon: '1234567AB',
      expectedRegex: /nieprawidłowy|nieprawidłowa|błędny|błędna/i
    },
    {
      title: 'Podany REGON 14-znakowy jest nieprawidłowy - zawiera minimum 1 znak inny niż cyfra',
      regon: '123456789012CD',
      expectedRegex: /nieprawidłowy|nieprawidłowa|błędny|błędna/i
    }
  ];

  for (const testCase of negativeCases) {
    test(`Test NEGATYWNY – ${testCase.title}`, async ({ regonPage }) => {
      await regonPage.searchByRegon(testCase.regon);

      const errorMessage = await regonPage.getErrorMessage();
      expect(errorMessage).toMatch(testCase.expectedRegex);
    });
  }

  // ---------------------------
  // test case'y pozytywne
  // ---------------------------
  const positiveCases = [
    {
      title: 'prawidłowy REGON 9-cyfrowy',
      regon: '350637551',
      expectedCompanyRegex: /RADIO MUZYKA FAKTY GRUPA RMF/i
    },
    {
      title: 'prawidłowy REGON 14-cyfrowy',
      regon: '01041897300057',
      expectedCompanyRegex: /TELEWIZJA POLSKA.*RZESZOWIE|TELEWIZJA POLSKA.*RZESZÓW/i
    }
  ];

  for (const testCase of positiveCases) {
    test(`Test POZYTYWNY – ${testCase.title}`, async ({ regonPage }) => {
      await regonPage.searchByRegon(testCase.regon);

      const companyName = await regonPage.getCompanyName();
      expect(companyName).toMatch(testCase.expectedCompanyRegex);
    });
  }

});