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
    Then errors are sorted by "Business" "asc" and "Error" "desc"
