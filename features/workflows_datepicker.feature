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

  Scenario: Setting valid date manually from the input
    Given I am on "workflows" listing
    And datepicker is opened
    When I change the input to "2015-03-05 12:34:56"
    Then query param "date" equals to "20150305123456"

  Scenario: Setting invalid date manually from the input
    Given I am on "workflows" listing
    And datepicker is opened
    When I change the input to "invalid date"
    Then the URL does not change

  Scenario: Setting date to All from the toolbar
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "All" button
    Then query param "date" equals to "all"

  Scenario: Setting date to Today from the toolbar
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Today" button inside "date-selection" dropdown
    Then query param "date" equals to "today"

  Scenario: Setting date to Week from the toolbar
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Week" button inside "date-selection" dropdown
    Then query param "date" equals to "week"

  Scenario: Setting date to Month from the toolbar
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "This month" button inside "date-selection" dropdown
    Then query param "date" equals to "month"

  Scenario: Setting date to 30 days from the toolbar
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "30 days" button inside "date-selection" dropdown
    Then query param "date" equals to "thirty"

  Scenario: Setting date to Now from the toolbar
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "24H" button inside "date-selection" dropdown
    Then query param "date" equals to "24h"
