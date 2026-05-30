describe('Authentication Flow', () => {
  it('allows user to login with test credentials', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button').contains('Увійти').click()
    cy.url().should('include', '/')
  })

  it('shows validation errors if email is empty', () => {
    cy.visit('/login')
    cy.get('input[name="password"]').type('password123')
    cy.get('button').contains('Увійти').click()
    cy.get('input[name="email"]').invoke('prop', 'validationMessage').should('not.be.empty')
  })

  it('allows user to navigate to registration', () => {
    cy.visit('/login')
    cy.contains('Зареєструватися').click()
    cy.url().should('include', '/register')
  })
})
