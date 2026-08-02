describe("Admin Login", () => {

  it("logs in successfully", () => {

    cy.viewport(1440, 900);

    cy.visit("/login");

    // Select Admin login (optional if it's already selected by default)
    cy.contains("Admin").click();

    // Enter credentials
    cy.get('input[name="email"]')
      .should("be.visible")
      .type("adminMain@gmail.com", { force: true });

    cy.get('input[name="password"]')
      .should("be.visible")
      .type("qwer@1234", { force: true });

    // Click the submit button
    cy.get('button[type="submit"]').click();

    // Verify navigation
    cy.url().should("include", "/admindashboard");

  });

});