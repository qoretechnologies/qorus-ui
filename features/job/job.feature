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
    And "results-order" get loaded

  @wip
  Scenario: Show log  tab
    Given I am on "job/110/log" page
    Then I see ".job-log" item

