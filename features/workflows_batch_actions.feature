Feature: Tests workflows batch actions

  @no-impl
  Scenario: Unsets workflow's deprecated status
    Given I am on "workflows" listing
    And workflows get loaded
    And I click the "Deprecated" button inside "deprecated" dropdown
    And I select the "DEPRECATEDTEST" workflow
    When I click the "Unset deprecated" button inside "hidden" dropdown
    And I click the "Deprecated" button inside "deprecated" dropdown
    Then "6" workflows are shown

  Scenario: Enables multiple workflows
    Given I am on "workflows" listing
    And workflows get loaded
    And I select three workflows
    When I click the "Disable" button
    Then there are "3" "disabled" workflows

  Scenario: Sets multiple workflows as deprecated
    Given I am on "workflows" listing
    And workflows get loaded
    And I select three workflows
    When I click the "Set deprecated" button inside "hidden" dropdown
    Then "2" workflows are shown
