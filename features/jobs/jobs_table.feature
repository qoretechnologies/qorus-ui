Feature: jobs table

  Scenario: Table is sorted by name by default
    Given I am on "jobs" listing
    And "jobs" get loaded
    Then jobs are sorted by "Name" "asc"

  Scenario: Changing sort of the table to ID
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the "Version" column header
    Then jobs are sorted by "Version" "asc"

  Scenario: Changing sort of the table to descending
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I click on the "Version" column header
    Then jobs are sorted by "Version" "desc"

  Scenario: Changing sort of the table to different column
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the "Version" column header
    And I click on the "Version" column header
    And I click on the "Name" column header
    Then jobs are sorted by "Name" "desc"

  Scenario: Go to job detail page
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the "jobtest" link - "5"
    Then the URL changes to "/job/110/results"

  Scenario: check jobs detail page
    Given I am on "jobs" page
    And "jobs" get loaded
    When I activate "anothertest" - "5"
    Then I should see detail pane

  Scenario: Clicking on alert icon opens detail pane on the alerts tab
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the alert icon of "jobtest" "job"
    And I wait some time
    Then the complete URL changes to "jobs?paneId=110&paneTab=detail"

  Scenario: Row with alerts is shown
    Given I am on "jobs" listing
    When "jobs" get loaded
    Then I should see 2 table row with alerts
