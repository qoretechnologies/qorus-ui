Feature: Tests all the features of the orders list toolbar

  Scenario: Selects all orders
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click the checkbox on the dropdown
    Then all of the "orders" are selected

  Scenario: Inverts orders selection
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "3" "orders"
    When I click the "Invert" button inside "selection" dropdown
    Then "7" "orders" are selected

  Scenario: Deselects all selected orders
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "6" "orders"
    When I click the "None" button inside "selection" dropdown
    Then "0" "orders" are selected
