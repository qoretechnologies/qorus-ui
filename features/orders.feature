Feature: Workflow details and orders listing

  Scenario: Accessing workflow detail page
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "TOTAL" cell on "ARRAYTEST"
    Then I should see workflow detail page

  Scenario: Accessing workflow detail with all states and default date
    Given I am on "ARRAYTEST" with "TOTAL" states and "default" dates
    Then "0" "orders" are shown

  Scenario: Accessing workflow detail with all states and all dates
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    Then "12" "orders" are shown

  Scenario: Accessing workflow detail with all states and all dates
    Given I am on "ARRAYTEST" with "TOTAL" states and "2016-06-06 00:00:00" dates
    Then "2" "orders" are shown

  Scenario: Accessing workflow details with COMPLETE state and all dates
    Given I am on "ARRAYTEST" with "COMPLETE" states and "All" dates
    Then "1" "orders" are shown

  Scenario: Header data are shown
    Given I am on "ARRAYTEST" with "TOTAL" states and "default" dates
    Then the header says " ARRAYTEST 2.0"
    And there are "5" badges shown
    And there are "2" groups shown

  Scenario: Switching tabs
    Given I am on "ARRAYTEST" with "TOTAL" states and "default" dates
    When I click the "Log" tab
    Then I should see the log content
    When I click the "Performance" tab
    Then I should see the performance content
    When I click the "Info" tab
    Then I should see the info content


