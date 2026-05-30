describe('Navigation', () => {
  it('navigates to the About page', () => {
    cy.visit('/')
    cy.contains('Про нас').click()
    cy.url().should('include', '/about')
    cy.contains('ПРО "TAKIBI"').should('be.visible')
  })
})
