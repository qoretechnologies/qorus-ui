Feature: Notifications panel

  @wip
  Scenario: Show panel
    Given I am on "system/alerts" listing
    When I click on ".notification-button" item
    Then I see ".notification-list" item

  @wip
  Scenario: Count notifications
    Given I am on "system/alerts" listing
    Then Notification badge equals "5"

  @wip
  Scenario: Hide ongoing notifications
    Given I am on "system/alerts" listing
    When I click on ".notification-button" item
    And I click on ".ongoing .clear-button" item
    Then Notification badge equals "1"

  @wip
  Scenario: Hide transient notifications
    Given I am on "system/alerts" listing
    When I click on ".notification-button" item
    And I click on ".transient .clear-button" item
    Then Notification badge equals "4"
