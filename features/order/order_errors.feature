Feature: Tests for the Errors tab

  Scenario: Errors are displayed
    Given I am on order "31380" and "Errors" tab
    When "errors" get loaded
    Then "10" "errors" are shown

  Scenario: Changing number of displayed errors
    Given I am on order "31380" and "Errors" tab
    And "errors" get loaded
    When I click the "25" button inside "show" dropdown
    Then "25" "errors" are shown
