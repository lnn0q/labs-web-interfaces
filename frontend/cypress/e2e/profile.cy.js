describe('Profile Page', () => {
  it('should redirect to login when accessing profile unauthenticated', () => {
    cy.visit('/profile')
    cy.url().should('include', '/login')
  })
})
