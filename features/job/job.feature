Feature: Job page test

  Scenario: Load page
    Given I am on "job/110" page
    Then I see ".job-page" item
    And I see ".job-header" item
    And I see ".job-description" item
