import * as config from '../../src/setupTests';

describe('TV List App', () => {
  beforeEach(() => {
    localStorage.setItem('stored-shows', '[{"id":1407,"seasons_watched":[1]}]');
    cy.visit(config.appUrl);
  });

  it('shows stored show', () => {
    cy.get('#show-active0').should('exist');
    cy.get('#show-active0').contains('Homeland');
  });

  it('should be able to remove a show', () => {
    cy.get('#show-active0').should('exist');
    cy.get('#remove-button-0').click();
    cy.get('#confirm-remove-show').should('exist');
    cy.get('#confirm-remove-show').click();
    cy.get('#show-active0').should('not.exist');
  });

  it('should render submit button', () => {
    cy.get('.App-intro button').contains('Submit');
  });

  it('should store a show successfully', () => {
    cy.get('.App-intro input').type('Stranger Things');
    cy.get('.App-intro button').click();
    cy.get('span p li').contains('Stranger Things');

    cy.get('#add-show-button-0').click();
    cy.get('.App-intro button').click();
    cy.get('#show-active0').contains('Stranger Things');
  });

  it('should finish all seasons and move show back to active', () => {
    cy.get('#show-finished0').should('not.exist');
    for (let i = 2; i < 9; i++) {
      cy.get('#season-checkbox-1407-' + i).click({ force: true });
    }
    cy.get('#show-active0').should('not.exist');
    cy.get('#show-finished0').should('exist');

    cy.get('#season-checkbox-1407-1').click({ force: true });

    cy.get('#show-active0').should('exist');
    cy.get('#show-finished0').should('not.exist');
  });

  it('should be able to archive show', () => {
    cy.get('#archive-button-0').click();
    cy.get('#confirm-archive-show').should('exist');
    cy.get('#confirm-archive-show').click();
    cy.get('#show-active0').should('not.exist');
    cy.get('#show-finished0').should('not.exist');
  });

  // Not sure how to test alert pop-up in Cypress
  it('should not be able to add a show with no seasons', () => {
    cy.get('.App-intro input').type('Dar Alzaman');
    cy.get('.App-intro button').click();
    cy.get('#add-show-button-0').click();

    cy.get('#show-active0').contains('Homeland');
  });
});
