context('Dashboard', () => {
  beforeEach(() => {
    cy.visitAfterLogin('/dashboard');
  });

  it('Tests look and functions', () => {
    cy.get('.masonry-panel')
      .its('length')
      .should('eq', 7);
  });
});
