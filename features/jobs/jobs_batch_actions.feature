Feature: Tests jobs batch actions

  Scenario: Disables multiple jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I select "2" "jobs"
    When I click the "Disable" button
    Then there are "2" "disabled" "jobs"

  Scenario: Enables multiple jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I select "3" "jobs"
    When I click the "Enable" button
    Then there are "3" "enabled" "jobs"
