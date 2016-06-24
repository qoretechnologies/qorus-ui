Feature: Tests for the Diagram tab

  Scenario: Diagram is displayed
    Given I am on order "31380" and "Diagram" tab
    And diagram gets loaded
