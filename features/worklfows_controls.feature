Feature: Workflow Controls

  @wip
  Scenario: Dropdown is toggled
    Given I am on workflows listing
    When I click the dropdown toggle
    Then the dropdown should be shown