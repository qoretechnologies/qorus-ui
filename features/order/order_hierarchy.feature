Feature: Tests for the Hierarchy tab

  Scenario: Hierarchy table is displayed
    Given I am on order "31380" and "Hierarchy" tab
    When "hierarchy" get loaded
    Then "11" "rows" are shown
