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
    When I click on the "Version" column header
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
    When I click on the "jobtest" link - "3"
    Then the URL changes to "/job/110/results"
