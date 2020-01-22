context('Topbar', () => {
  beforeEach(() => {
    cy.visitAfterLogin('/dashboard');
  });

  it('Tests look and functions', () => {
    // Theme toggling
    cy.get('#themeToggle').click();
    cy.get('.topbar').should('not.have.class', 'bp3-dark');
    cy.reload();
    cy.get('.topbar').should('not.have.class', 'bp3-dark');
    cy.get('#themeToggle').click();
    cy.get('.topbar').should('have.class', 'bp3-dark');

    // Notifications
    cy.get('#notificationsToggle').click();
    cy.location().should(location => {
      expect(location.search).to.eq(
        '?notificationsPane=open&notificationsPaneTab=all'
      );
    });

    // Quick search
    cy.get('#quickSearch').type('dev');
    cy.get('#quickSearchForm').submit();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/workflows');
      expect(location.search).to.eq('?search=dev');
    });
  });
});
