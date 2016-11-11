Feature: Tests workflows batch actions

  Scenario: Disables multiple workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I select "3" "workflows"
    When I click the "Disable" button
    Then there are "3" "disabled" "workflows"

  Scenario: Sets multiple workflows as deprecated
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I select "3" "workflows"
    When I click the "Set deprecated" button inside "hidden" dropdown
    Then "2" "workflows" are shown
