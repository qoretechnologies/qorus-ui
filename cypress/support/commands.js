// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('visitAfterLogin', url => {
  cy.request({
    method: 'POST',
    url: 'https://localhost:3004/api/latest/public/login',
    body: {
      pass: 'admin',
      user: 'admin',
    },
  }).then(data => {
    window.localStorage.setItem('token', data.body.token);

    // Clear local storage
    cy.request({
      method: 'PUT',
      url: 'https://localhost:3004/api/latest/users/admin',
      body: {
        storage: {},
      },
      headers: {
        'Qorus-Token': data.body.token,
      },
    }).then(() => {
      cy.visit(url);
      cy.wait(1000);
    });
  });
});
