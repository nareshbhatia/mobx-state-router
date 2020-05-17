describe('Place order scenarios', function() {
    it('successfully places order with one item', function() {
        // Go to home page
        cy.visit('/');

        // Select MacBook Pro
        cy.contains('MacBook Pro').click();

        // Verify that the page has transitioned to the MacBook detail page
        cy.url().should('include', '/items/E01');

        // Add MacBook to shopping cart
        cy.get('button[aria-label="Add to shopping cart"]').click();

        // Go to the shopping cart
        cy.get('button[aria-label="Go to shopping cart"]').click();

        // Verify that the page has transitioned to the shopping cart
        cy.url().should('include', '/cart');

        // Verify that cart total is $699.00
        cy.contains('Total: $699.00');

        // Proceed to checkout
        cy.contains('Proceed to checkout').click();

        // Verify that you were redirected to the signin page
        cy.url().should('include', '/signin');

        // Signin
        cy.get('input[name="email"]').type('naresh@archfirst@gmail.com');
        cy.contains('Sign In').click();

        // Place order
        cy.contains('Place Order').click();

        // Verify the order was placed
        cy.contains('Order placed.');
    });
});
