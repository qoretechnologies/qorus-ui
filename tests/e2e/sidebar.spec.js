/// <reference types="Cypress" />
import '../../cypress/support/commands';

context('Sidebar', () => {
  beforeEach(() => {
    cy.visitAfterLogin('/dashboard');
  });

  it('Tests look and functions', () => {
    cy.get('.sidebarItem')
      .its('length')
      .should('eq', 11);

    // Handling expand collapse
    cy.get('.sidebar').should('not.have.class', 'expanded');
    cy.get('#menuCollapse').click();
    cy.get('.sidebar').should('have.class', 'expanded');
    cy.reload();
    cy.get('.sidebar').should('have.class', 'expanded');
    cy.get('#menuCollapse').click();
    cy.get('.sidebar').should('not.have.class', 'expanded');

    // Handling opening closing of menus
    cy.get('#menuCollapse').click();
    cy.get('.submenuCategory')
      .contains('Global')
      .click();
    cy.get('.sidebarSubItem')
      .its('length')
      .should('eq', 5);
    cy.get('.submenuCategory')
      .contains('System')
      .click();
    cy.get('.sidebarSubItem')
      .its('length')
      .should('eq', 7);

    // Favorite items
    cy.get('.sidebarSubItem')
      .contains('Cluster')
      .trigger('mouseover')
      .get('.sidebarFavorite')
      .click();
    cy.get('.sidebarSubItem')
      .its('length')
      .should('eq', 6);
    cy.get('.submenuCategory')
      .contains('System')
      .click();
    cy.get('.sidebarItem')
      .its('length')
      .should('eq', 12);

    // Remove favourite
    cy.get('.sidebarItem')
      .contains('Cluster')
      .get('.sidebarFavorite')
      .click();

    cy.get('.sidebarItem')
      .its('length')
      .should('eq', 11);
  });
});
