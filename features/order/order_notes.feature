Feature: Tests for the Notes tab

  Scenario: Notes are displayed
    Given I am on order "31380" and "Notes" tab
    And notes get loaded
    Then there are "3" notes

  Scenario: Adds a new note
    Given I am on order "31380" and "Notes" tab
    And notes get loaded
    When I add a new note "Test"
    Then there are "4" notes
    And the last note says "Test"

