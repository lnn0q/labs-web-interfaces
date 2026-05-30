describe('Protected routes tests', () => {
  it('should redirect from chat page if not authenticated', () => {
    cy.visit('/chat/1');
    cy.url().should('include', '/login');
  });

  it('should redirect from admin page if not staff', () => {
    cy.visit('/admin');
    cy.url().should('include', '/admin');
  });
});
