/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />

declare namespace Cypress {
  interface Chainable {
    findByTestId(id: string): Chainable<Element>;

    attachFile(file: string): void;
  }
}
