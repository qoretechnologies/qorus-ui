Feature: Job page test

  @wip
  Scenario: Load page
    Given I am on "job/110" page
    Then I see ".job-page" item
    And I see ".job-header" item
    And I see ".job-description" item

  @wip
  Scenario: Show results tab
    Given I am on "job/110/results?date=all" page
    Then I see ".job-results" item
    And "results-job" get loaded

  @wip
  Scenario: Show log  tab
    Given I am on "job/110/log" page
    Then I see ".job-log" item

  @wip
  Scenario: Load more results
    Given I am on "job/110/results?date=all" page
    When "results-table" get loaded
    And I click the "Load more" button
    Then I see "100" table rows
    And I see ".load-more" item

  @wip
  Scenario: Hide button if no more results
    Given I am on "job/110/results?date=all" page
    When "results-table" get loaded
    And I click the "Load more" button
    And I click the "Load more" button
    Then I do not see ".load-more" item

  @wip
  Scenario: Show only complete resutls
    Given I am on "job/110/results?date=all" page
    When "results-table" get loaded
    And I click the "Complete" button
    Then I see "27" table rows

  @wip
  Scenario: Show default
    Given I am on "job/110/results" page
    Then I see ".data-not-found" item

  @wip
  Scenario: Search by query
    Given I am on "job/33/results?date=all&filter=all&q=302" page
    Then I see "2" table rows

  @wip
  Scenario: Show job results detail
    Given I am on "job/110/results?date=all" page
    When "results-table" get loaded
    And I click on the "3007007" row - "1"
    Then the URL changes to "/job/110/results/3007007"
    Then I see ".job-result-info" item

  @wip
  Scenario: Go back to result detail page
    Given I am on "job/110/results/3007007?date=all" page
    When "results-table" get loaded
    When I click the "close" button
    Then the URL changes to "/job/110/results"

  @wip
  Scenario: Move from one instance result to another
    Given I am on "job/110/results/3007007?date=all" page
    When "results-table" get loaded
    And I click on the "2993243" row - "1"
    Then the URL changes to "/job/110/results/2993243"
