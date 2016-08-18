Feature: Job page test

  @wip
  Scenario: Load page
    Given I am on "job/110" page
    Then I see ".job-page" item
    And I see ".job-header" item
    And I see ".job-description" item

  @wip
  Scenario: Show results tab
    Given I am on "job/110/results" page
    Then I see ".job-results" item
    And "results-job" get loaded

  @wip
  Scenario: Show log  tab
    Given I am on "job/110/log" page
    Then I see ".job-log" item

  @wip
  Scenario: Load more results
    Given I am on "job/110/results" page
    When "results-table" get loaded
    And I click the "Load more" button
    Then I see "100" table rows
    And I see ".load-more" item

  @wip
  Scenario: Hide button if no more results
    Given I am on "job/110/results" page
    When "results-table" get loaded
    And I click the "Load more" button
    And I click the "Load more" button
    Then I do not see ".load-more" item

