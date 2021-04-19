describe('Renders website elements correctly', () => {
  beforeEach(() => {
    cy.server()
    cy.fixture('headlines.json').as('headlines')
    cy.route('GET', '**v2/top-headlines*', '@headlines').as('fetchHeadlines')
    cy.visit('http://localhost:3000/')
  })

  it('Select headlines as a type of news, clicks "Get news" button and sends request', () => {
    cy.get('[data-testid="news-type-selection"]').select('headlines')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchHeadlines')
  })

  it('Renders downloaded news on the list', () => {
    cy.get('[data-testid="news-type-selection"]').select('headlines')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchHeadlines')
    cy.get('[data-testid="news-element"]').first().find('h2').contains('Kursy wideo rewelacyjną formą poszerzania kompetencji')
  })

  it('Displays image placeholder if no image has been provided for the news', () => {
    cy.fixture('headlines-no-image.json').as('headlines-no-images')
    cy.route('GET', '**/v2/top-headlines*', '@headlines-no-images').as('fetchHeadlines')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchHeadlines');
    cy.get('[data-testid="news-img"]').first().should('have.attr', 'src').and('match', /https:\/\/via.placeholder.com/)  
  })

  it('Renders error message if there was an error while fetching news', () => {
    cy.route({
      method: 'GET',
      url: '**v2/top-headlines*',
      response: [],
      status: 404
    }).as('fetchHeadlines')
    cy.get('[data-testid="news-type-selection"]').select('headlines')
    cy.get('[data-testid="get-news"]').click()
    cy.wait('@fetchHeadlines')
    cy.get('[data-testid="news-error-alert"]').contains("Couldn't fetch news data.")
  })
})