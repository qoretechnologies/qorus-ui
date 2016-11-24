Feature: Check errors page

  Scenario: Default sort
    Given I am on "system/errors" page
    And "errors" get loaded
    Then errors are sorted by "Error" "asc" and "Description" "asc"

  Scenario: Change sort same column
    Given I am on "system/errors" page
    And "errors" get loaded
    When I click on the "Error" column header
    Then errors are sorted by "Error" "desc" and "Description" "asc"

  Scenario: Change sort different column
    Given I am on "system/errors" page
    And "errors" get loaded
    When I click on the "Bus. Flag" column header
    Then errors are sorted by "Bus. Flag" "asc" and "Error" "asc"

  Scenario: Filters errors when search input changes
    Given I am on "system/errors" page
    And "errors" get loaded
    When I type "timeout" in the search input
    Then "5" "errors" are shown

  Scenario: Deletes an error
    Given I am on "system/errors" page
    And "errors" get loaded
    And "46" "errors" are shown
    When I delete the "SOCKET-SSL-ERROR" error
    Then "45" "errors" are shown
