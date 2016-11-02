Feature: Notifications panel

  Scenario: Show panel
    Given I am on "system/alerts" listing
    When I click on ".notification-button" item
    Then I see ".notification-list" item

  Scenario: Count notifications
    Given I am on "system/alerts" listing
    Then Notification badge equals "6"

  Scenario: Hide ongoing notifications
    Given I am on "system/alerts" listing
    When I click on ".notification-button" item
    And I click on ".ongoing .clear-button" item
    Then Notification badge equals "1"

  Scenario: Hide transient notifications
    Given I am on "system/alerts" listing
    When I click on ".notification-button" item
    And I click on ".transient .clear-button" item
    Then Notification badge equals "5"
