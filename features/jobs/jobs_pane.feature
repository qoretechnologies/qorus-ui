Feature: Jobs pane
  Scenario: See no options
    Given I am on "jobs/24h?paneId=33" page
    When "jobs" get loaded
    Then I see ".svc__desc" item
    And I see ".options" item
    And I see ".groups" item

  Scenario: Set option success
    Given I am on "jobs/24h?paneId=33" page
    When "jobs" get loaded
    And I click the "Add option" button
    And I click the "Add" button
    And I type "88" in "newValue" input
    And I submit "editable-form" form
    Then I see ".options .table" item

  Scenario: Delete option
    Given I am on "jobs/24h?paneId=33" page
    When "jobs" get loaded
    And I click the "Add option" button
    And I click the "Add" button
    And I type "88" in "newValue" input
    And I submit "editable-form" form
    And I click on ".options .table .remove-option" item
    Then I see ".options .table" item

  Scenario: Go to job group
    Given I am on "jobs/24h?paneId=33" page
    When "jobs" get loaded
    And I click on ".group" item
    Then the URL changes to "/groups/anothertest"

  Scenario: Alert tab show alerts
    Given I am on "jobs/all?paneId=110&paneTab=alerts" page
    When "jobs" get loaded
    Then I see "2" ".job-alert" items

  Scenario: Alert tab no alerts
    Given I am on "jobs/all?paneId=4&paneTab=alerts" page
    When "jobs" get loaded
    Then I see ".no-data" item

  Scenario: Go to system alerts
    Given I am on "jobs/all?paneId=110&paneTab=alerts" page
    When "jobs" get loaded
    And I click on ".job-alert:first-child a" item
    Then the URL changes to "/system/alerts/ongoing/2"

