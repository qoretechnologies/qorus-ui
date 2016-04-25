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

  Scenario: Yesterday is selected when opening calendar
    Given I am on "workflows" listing
    And datepicker is opened
    Then yesterday should be selected

  Scenario: Resets to the default hours and minutes
    Given I am on "workflows" listing
    And datepicker is opened
    And I change hours and minutes
    When I click the reset button
    Then hours and change should return to the default value

  Scenario: Selecting date from datepicker
    Given I am on "workflows" listing
    And datepicker is opened
    When I select today and click on Apply
    Then the URL changes to today

  Scenario: Setting valid date manually from the input
    Given I am on "workflows" listing
    And datepicker is opened
    When I change the input to "2015-03-05 12:34:56"
    Then the URL changes to "/workflows/20150305123456/all"

  Scenario: Setting invalid date manually from the input
    Given I am on "workflows" listing
    And datepicker is opened
    When I change the input to "invalid date"
    Then the URL does not change
