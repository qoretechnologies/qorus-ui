Feature: Tests contents of the system/alerts tab

  Scenario: Dashboard loads
    Given I am on "system/alerts" listing
    Then "alerts" get loaded

  Scenario: Switching alerts
    Given I am on "system/alerts" listing
    Then "alerts" get loaded
    When I click the "Transient" tab
    Then the URL changes to "/system/alerts/transient"
    And "1" "alerts" are shown

  Scenario: Activating alert row
    Given I am on "system/alerts" listing
    Then "alerts" get loaded
    When I activate "SERVICE-NOT-CREATED" alert
    Then I should see the "SERVICE-NOT-CREATED" detail pane
