Feature: Workflow Datepicker

  Scenario: Datepicker is shown
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the datepicker input
    Then the datepicker is shown

  Scenario: Calendar month changes to next
    Given I am on "workflows" listing
    And datepicker is opened
    When I click on the "next" month arrow
    Then the month should change to "next"

  Scenario: Calendar month changes to previous
    Given I am on "workflows" listing
    And datepicker is opened
    When I click on the "previous" month arrow
    Then the month should change to "previous"

  Scenario: Calendar closes when clicking outside
    Given I am on "workflows" listing
    And datepicker is opened
    When I click on the header
    Then the datepicker is hidden

  Scenario: Current day is highlighted when opening calendar
    Given I am on "workflows" listing
    And datepicker is opened
    Then today should be highlighted

  Scenario: Yesterday day is selected when opening calendar
    Given I am on "workflows" listing
    And datepicker is opened
    Then yesterday should be selected
