Feature: jobs table

  @wip
  Scenario: Table is sorted by name by default
    Given I am on "jobs" listing
    And "jobs" get loaded
    Then jobs are sorted by "Name" "asc"

  @wip
  Scenario: Changing sort of the table to ID
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the "Version" column header
    Then jobs are sorted by "Version" "asc"

  @wip
  Scenario: Changing sort of the table to descending
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the "Version" column header
    And I click on the "Version" column header
    Then jobs are sorted by "Version" "desc"

  @wip
  Scenario: Changing sort of the table to different column
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the "Version" column header
    And I click on the "Version" column header
    And I click on the "Name" column header
    Then jobs are sorted by "Name" "desc"

