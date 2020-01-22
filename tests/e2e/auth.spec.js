/// <reference types="Cypress" />

context('Authorization', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays login page ', () => {
    cy.get('.authorize-header > :nth-child(1)').should(
      'have.text',
      'Log in to rippy-4.0'
    );
  });

  it('displays incorrect credentials error', () => {
    cy.get('#username').type('admin');
    cy.get('#password').type('test');
    cy.get('#submit').click();
    cy.get('.bp3-callout').should('have.text', 'invalid user or password');
  });

  it('logs in successfuly', () => {
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('#submit').click();
    cy.location().should(location => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq('https://localhost:3004/dashboard');
    });
  });

  it('logs in successfuly and redirects to next url', () => {
    cy.visit('/login?next=/workflows');
    cy.get('#username').type('admin');
    cy.get('#password').type('admin');
    cy.get('#submit').click();
    cy.location().should(location => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq('https://localhost:3004/workflows');
    });
  });
});
