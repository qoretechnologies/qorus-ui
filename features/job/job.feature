Feature: Job page test

  Scenario: Load page
    Given I am on "job/33" page
    Then I see ".job-page" item
    And I see ".job-header" item
    And I see ".job-description" item

  Scenario: Show results tab
    Given I am on "job/33/results?date=all" page
    Then I see ".job-results" item
    And "results-job" get loaded

  Scenario: Show log  tab
    Given I am on "job/33/log" page
    Then I see ".log-area" item

  Scenario: Load more results
    Given I am on "job/33/results?date=all" page
    When "results-table" get loaded
    And I click the "Load 50 more..." button
    Then I see "100" table rows
    And I see ".load-more" item

  Scenario: Hide button if no more results
    Given I am on "job/33/results?date=all" page
    When "results-table" get loaded
    And I click the "Load 50 more..." button
    And I wait some time
    And I click the "Load 50 more..." button
    And I wait some time
    Then I do not see ".load-more" item

  Scenario: Show only complete resutls
    Given I am on "job/33/results?date=all&filter=complete" page
    When "results-table" get loaded
    Then I see "27" table rows

  Scenario: Show default
    Given I am on "job/110/results" page
    Then I see ".data-not-found" item

  Scenario: Search by query
    Given I am on "job/33/results?date=all&filter=all&q=302" page
    Then I see "2" table rows

  Scenario: Show job results detail
    Given I am on "job/33/results?date=all" page
    When "results-table" get loaded
    And I activate "3007007" - "0"
    Then the complete URL changes to "/job/33/results?date=all&job=3007007"
    Then I see ".job-result-info" item

  Scenario: Go back to result detail page
    Given I am on "job/33/results?job=3007007&date=all" page
    When "results-table" get loaded
    When I click the "close" button
    Then the URL changes to "/job/33/results"

  Scenario: Move from one instance result to another
    Given I am on "job/33/results?job=3007007&date=all" page
    When "results-table" get loaded
    And I activate "2993243" - "0"
    Then the complete URL changes to "/job/33/results?date=all&job=2993243"

  Scenario: Show info tab with tree
    Given I am on "job/33/results?job=3007007&date=all" page
    When "results-table" get loaded
    And ".job-result-info" item get loaded
    And I wait some time
    And I click the "Info" tab
    Then I see ".tree-wrapper" item

  Scenario: Show info tab without tree
    Given I am on "job/33/results?job=3021635&date=all&q=" page
    When "results-table" get loaded
    And ".job-result-info" item get loaded
    And I wait some time
    And I click the "Info" tab
    And I see ".no-data" item

  Scenario: Go back to jobs main with all date
    Given I am on "jobs?date=all" listing
    And "jobs" get loaded
    And I click on the "jobtest" link - "5"
    And I click on ".go-back" item
    Then the complete URL changes to "/jobs?date=all"

  Scenario: Go back with no date
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I click on the "jobtest" link - "5"
    And I click on ".go-back" item
    Then the URL changes to "/jobs"
