Feature: Order detail

  Scenario: Order detail page loads
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click on the "ARRAYTEST v2.0 (3659)" order
    Then the URL changes to "/order/3659/19700101000000/diagram"

  Scenario: Table with info is displayed
    Given I am on order "31380" and "Info" tab
    Then "info" get loaded

