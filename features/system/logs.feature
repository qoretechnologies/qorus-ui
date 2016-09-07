Feature: System/logs tests

  Scenario: Displays the system log by default
    Given I am on "system/logs" listing
    Then the URL changes to "/system/logs/system"

  Scenario: Shows tabs
    Given I am on "system/logs" listing
    And the URL changes to "/system/logs/system"
    Then I should see "5" subtabs

  Scenario: Data are displayed in system log
    Given I am on "system/logs" listing
    And the URL changes to "/system/logs/system"
    When the log loads
    Then the log should contain "This is a test log message for system" after 3 seconds

  Scenario: Data are displayed in http log
    Given I am on "system/logs/http" listing
    When the log loads
    Then the log should contain "This is a test log message for http" after 3 seconds

  Scenario: Data are displayed in audit log
    Given I am on "system/logs/audit" listing
    When the log loads
    Then the log should contain "This is a test log message for audit" after 3 seconds

  Scenario: Data are displayed in alert log
    Given I am on "system/logs/alert" listing
    When the log loads
    Then the log should contain "This is a test log message for alert" after 3 seconds

  Scenario: Data are displayed in mon log
    Given I am on "system/logs/mon" listing
    When the log loads
    Then the log should contain "This is a test log message for mon" after 3 seconds

  Scenario: Log is cleared
    Given I am on "system/logs/system" listing
    When the log loads
    And I click the "Clear" button
    Then the log should contain "-- LOG CLEARED --" after 1 seconds
