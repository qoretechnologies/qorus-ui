Feature: Workflow Controls

  Scenario: Dropdown is toggled
    Given I am on workflows listing
    When I click the dropdown toggle
    Then the dropdown should be shown

  Scenario: Dropdown is hidden on toggle blur
    Given I am on workflows listing
    And I click the dropdown toggle
    When I blur the dropdown toggle
    Then the dropdown should be hidden
