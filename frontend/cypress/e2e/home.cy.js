describe('Home Page Flow', () => {
  it('should display the home page with header and search', () => {
    cy.visit('/')
    cy.contains('Знайди свій Фандом').should('be.visible')
    cy.get('input[placeholder="Пошук..."]').should('be.visible')
  })

  it('should filter by category when clicking buttons', () => {
    cy.visit('/')
    cy.contains('Аніме').click()
    cy.url().should('include', '/')
    cy.contains('Книги').click()
    cy.url().should('include', '/')
  })

  it('should allow searching for a fandom', () => {
    cy.visit('/')
    cy.get('input[placeholder="Пошук..."]').type('Naruto')
    cy.get('input[placeholder="Пошук..."]').should('have.value', 'Naruto')
  })
})
