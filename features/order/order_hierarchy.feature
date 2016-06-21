Feature: Tests for the Hierarchy tab

  Scenario: Hierarchy table is displayed
    Given I am on order "31380" and "Hierarchy" tab
    When "hierarchy" get loaded
    Then "2" "rows" are shown

  Scenario: Hierachy row is expanded
    Given I am on order "31380" and "Hierarchy" tab
    And "hierarchy" get loaded
    When I click on the "ARRAYTEST" row - "2"
    Then "10" "rows" are shown

  Scenario: Hierachy row is expanded and collapes
    Given I am on order "31380" and "Hierarchy" tab
    And "hierarchy" get loaded
    When I click on the "ARRAYTEST" row - "2"
    And I click on the "ARRAYTEST" row - "2"
    Then "2" "rows" are shown
