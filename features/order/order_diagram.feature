@wip
Feature: Tests for the Diagram tab

  Scenario: Diagram is displayed
    Given I am on order "31380" and "Diagram" tab
    Then diagram, tables and error pane get loaded

  Scenario: Diagram is correct
    Given I am on order "31380" and "Diagram" tab
    And diagram, tables and error pane get loaded
    Then the diagram has 10 boxes
    And start box is "error"
    And there are 2 "complete" boxes
    And there are 2 "error" boxes
    And there are 1 "async-waiting" boxes
    And there are 5 "normal" boxes

  Scenario: Changes order priority
    Given I am on order "31380" and "Diagram" tab
    And diagram, tables and error pane get loaded
    Then I change the priority to 900

  Scenario: Errors are loaded correctly
    Given I am on order "31380" and "Diagram" tab
    And diagram, tables and error pane get loaded
    Then there are "51" errors shown

  Scenario: Filtering errors based on severity
    Given I am on order "31380" and "Diagram" tab
    And diagram, tables and error pane get loaded
    When I click the "WARNING" button inside "errors" dropdown
    And I click the "Filter" button
    Then there are "2" errors shown

  Scenario: Showing all errors details
    Given I am on order "31380" and "Diagram" tab
    And diagram, tables and error pane get loaded
    When I click the "Show errors detail" button
    Then there are "102" errors shown

  Scenario: Shows error detail when row is clicked
    Given I am on order "31380" and "Diagram" tab
    And diagram, tables and error pane get loaded
    When I click on a row
    Then the the copy button is displayed
