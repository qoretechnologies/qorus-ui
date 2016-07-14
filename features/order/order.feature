Feature: Order detail

  Scenario: Order detail page loads
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click on the "ARRAYTEST v2.0 (3659)" order
    Then the URL changes to "/order/3659/19700101000000/diagram"

  @no-impl
  Scenario: Tabs are displayed correctly
    Given I am on order "3659"
    And the header gets loaded
    Then there are "10" tabs

  @no-impl
  Scenario: Actions are displayed in the header
    Given I am on order "3659"
    And the header gets loaded
    Then there are "5" action buttons
    And "1" action is disabled

  @no-impl
  Scenario: Url changes when tab is clicked
    Given I am on order "3659"
    And the header gets loaded
    When I click the "Steps" tab
    Then the URL changes to "/order/3659/19700101000000/steps"

  Scenario: Table with info is displayed
    Given I am on order "31380" and "Info" tab
    Then "info" get loaded

