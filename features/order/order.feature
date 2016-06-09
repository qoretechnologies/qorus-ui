Feature: Order detail

  Scenario: Order detail page loads
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click on the "ARRAYTEST v2.0 (3659)" order
    Then the URL changes to "/order/3659/diagram"

  Scenario: Header is displayed correctly
    Given I am on order "3659"
    And the header gets loaded
    Then the header says " ARRAYTEST 2.0 ID#3659"

  Scenario: Tabs are displayed correctly
    Given I am on order "3659"
    And the header gets loaded
    Then there are "10" tabs

  Scenario: Actions are displayed in the header
    Given I am on order "3659"
    And the header gets loaded
    Then there are "5" action buttons
    And "1" action is disabled

  Scenario: Url changes when tab is clicked
    Given I am on order "3659"
    And the header gets loaded
    When I click the "Steps" tab
    Then the URL changes to "/order/3659/steps"

