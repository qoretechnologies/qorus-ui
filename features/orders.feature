Feature: Workflow details and orders listing

  Scenario:
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "TOTAL" cell on "ARRAYTEST"
    Then I should see workflow detail page

  @wip
  Scenario:
    Given I am on "ARRAYTEST" with "TOTAL" states
