Feature: Extensions list

  Scenario: Show list
    Given I am on "extensions" page
    Then I see ".nav-tabs" item

  Scenario: Show extension
    Given I am on "extension/test" page
    Then I see "iframe" item