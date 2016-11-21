Feature: Jobs Toolbar

  Scenario: Dropdown checkbox is unchecked by default
    Given I am on "jobs" listing
    When "jobs" get loaded
    Then the dropdown checkbox should be unchecked

  Scenario: Datepicker is not empty by default
    Given I am on "jobs" listing
    When "jobs" get loaded
    Then datepicker is not empty

  Scenario: Dropdown checkbox is checked
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click the checkbox on the dropdown
    Then all of the "jobs" are selected

  Scenario: Dropdown checkbox is unchecked when deselecting all jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I select one "job"
    When I deselect all "jobs"
    Then the dropdown checkbox should be unchecked

  Scenario: Selecting all jobs from dropdown
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click the "All" button inside "selection" dropdown
    Then all of the "jobs" are selected

  Scenario: Inverting selection of jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I click the checkbox on the dropdown
    When I click the "Invert" button inside "selection" dropdown
    Then no "jobs" are selected

  Scenario: Deselecting all jobs from dropdown
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I click the checkbox on the dropdown
    When I click the "None" button inside "selection" dropdown
    Then no "jobs" are selected

  Scenario: Selecting some jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I select one "job"
    Then the dropdown checkbox should be halfchecked

  Scenario: Selection actions are displayed
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I select one "job"
    Then the selection actions are displayed

  Scenario: Filtering jobs through search input
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I type "another" in the search input
    Then "1" "jobs" are shown
