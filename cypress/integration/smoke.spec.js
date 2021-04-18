describe('Renders website elements correctly', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('Renders select to choose news type', () => {
    cy.get('[data-testid="news-type-selection"]')
  })

  it('Allows to choose "headlines" type of news', () => {
    cy.get('[data-testid="news-type-selection"]').select('headlines')
    cy.get('[data-testid="news-type-selection"]').should('have.value', 'headlines')
  })

  it('Allows to choose "everything" type of news', () => {
    cy.get('[data-testid="news-type-selection"]').select('everything')
    cy.get('[data-testid="news-type-selection"]').should('have.value', 'everything')
  })

  it('Renders button with "Get news" labal', () => {
    cy.get('[data-testid="get-news"]')
  })
})