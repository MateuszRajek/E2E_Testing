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
})