Feature: Check health buttons on topbar

  Scenario: Check local button
    Given I am on "system/dashboard/ongoing" page
    When I click on ".local-health-dropdown" item
    Then I see ".local-health" item

  Scenario: Check remote dropdown
    Given I am on "system/dashboard/ongoing" page
    When I click on ".remote-health-dropdown" item
    Then I see ".remote-health" item
