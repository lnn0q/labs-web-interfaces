describe('Fandom Page', () => {
  it('should load a fandom page structure', () => {
    cy.visit('/fandom/naruto')
    cy.url().should('include', '/fandom/')
  })
})
