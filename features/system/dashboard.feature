Feature: Tests contents of the system/dashboard tab

  Scenario: Dashboard loads
    Given I am on "system/dashboard" listing
    Then "alerts" get loaded
    And chart gets loaded
    And the health says "RED Ongoing 120 Transient 0"

  Scenario: Switching alerts
    Given I am on "system/dashboard" listing
    Then "alerts" get loaded
    When I click the "Transient" tab
    Then the URL changes to "/system/dashboard/transient"
    And "1" "alerts" are shown


