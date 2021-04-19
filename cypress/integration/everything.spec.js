describe('Renders website elements correctly', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('everything.json').as('everything')
    cy.route('GET', '**v2/everything*', '@everything').as('fetchEverything')
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="news-type-selection"]').select('everything')
  })

  it('Renders "Get news" button as disabled if there was no query data provided into the input', () => {
    cy.get('[data-testid="get-news"]').should('be.disabled')
  })

  it('Select everything as a type of news, clicks "Get news" button and sends request', () => {
    cy.get('[data-testid="news-query"]').type('type something')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything')
  })

  it('Renders downloaded news on the list', () => {
    cy.get('[data-testid="news-query"]').type('type something')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything')
    cy.get('[data-testid="news-element"]').first().find('h2').contains('Żeby zrozumieć zaawansowane koncepcje, należy mieć solidne podstawy.')
  })

  it('Displays image placeholder if no image has been provided for the news', () => {
    cy.fixture('everything-no-image.json').as('everything-no-images')
    cy.route('GET', '**/v2/everything*', '@everything-no-images').as('fetchEverything')
    cy.get('[data-testid="news-query"]').type('type something')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything');
    cy.get('[data-testid="news-img"]').first().should('have.attr', 'src').and('match', /https:\/\/via.placeholder.com/)  
  })

  it('Renders error message if there was an error while fetching news', () => {
    cy.route({
      method: 'GET',
      url: '**v2/everything*',
      response: [],
      status: 404
    }).as('fetchEverything')
    cy.get('[data-testid="news-query"]').type('type something')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchEverything')
    cy.get('[data-testid="news-error-alert"]').contains("Couldn't fetch news data.")
  })
})

describe('Selecting everything, choosing date range and typing query', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('everything.json').as('everything')
    cy.route('GET', '**/v2/everything*', '@everything').as('fetchEverything')
    cy.visit('http://localhost:3000/')
    cy.get('[data-testid="news-type-selection"]').select('everything')
  })

  it('Displays date range inputs', () => {
    cy.get('[data-testid="news-date-from"]')
    cy.get('[data-testid="news-date-to"]')
  })

  it('Fills date range inputs with dates in the correct format and gets news', () => {
    cy.get('[data-testid="news-date-from"]').type('2021-04-10')
    cy.get('[data-testid="news-date-to"]').type('2021-04-19')
    cy.get('[data-testid="news-query"]').type('IT news')
    cy.get('[data-testid="get-news"]').click()
    return cy.wait('@fetchEverything').then(request => {
      expect(request.url).match(/from=2021-04-10&to=2021-04-19/);
    });
  })

  it('Fills date range inputs with dates in the incorrect format', () => {
    cy.get('[data-testid="news-date-from"]').type('10.04.2021')
    cy.get('[data-testid="news-date-to"]').type('19.04.2021')
    cy.get('[data-testid="news-query"]').type('IT news')
    cy.get('[data-testid="get-news"]').click()
    cy.get('[data-testid="news-element"]').should('not.exist');
    cy.get('[data-testid="news-error-alert"]').should('not.exist');
  })
})