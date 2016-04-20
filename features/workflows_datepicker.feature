Feature: Workflow Datepicker

  Scenario: Datepicker is shown
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I focus the datepicker input
    Then the datepicker is shown

  Scenario: Calendar month changes to next
    Given I am on "workflows" listing
    And "workflows" get loaded
    And datepicker is opened
    When I click on the "next" month arrow
    Then the month should change to "next"

  Scenario: Calendar month change to previous
    Given I am on "workflows" listing
    And "workflows" get loaded
    And datepicker is opened
    When I click on the "previous" month arrow
    Then the month should change to "previous"
