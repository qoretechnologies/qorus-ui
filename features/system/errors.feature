Feature: Check errors page

  Scenario: Default sort
    Given I am on "system/errors" page
    And "errors" get loaded
    Then errors are sorted by "Error" "desc" and "Description" "asc"

  Scenario: Change sort same column
    Given I am on "system/errors" page
    And "errors" get loaded
    When I click on the "Error" column header
    Then errors are sorted by "Error" "asc" and "Description" "asc"

  Scenario: Change sort different column
    Given I am on "system/errors" page
    And "errors" get loaded
    When I click on the "Business" column header
    Then errors are sorted by "Business" "desc" and "Error" "desc"
  
  Scenario: Filters errors when search input changes
    Given I am on "system/errors" page
    And "errors" get loaded
    When I type "timeout" in the search input
    Then "5" "errors" are shown
