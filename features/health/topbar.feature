Feature: Check health buttons on topbar

  @wip
  Scenario: Check local button
    Given I am on "system/dashboard/ongoing" page
    When I click on ".local-health-dropdown" item
    Then I see ".local-health" item

  @wip
  Scenario: Check remote dropdown
    Given I am on "system/dashboard/ongoing" page
    When I click on ".remote-health-dropdown" item
    Then I see ".remote-health" item
