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
    When I click on the "jobtest" link - "4"
    Then the URL changes to "/job/110/results"

  Scenario: Disable job
    Given I am on "jobs" page
    And "jobs" get loaded
    When I click the first button with "#job-33-enabled" selector
    Then I see "#job-33-disabled" item

  Scenario: Enabled job
    Given I am on "jobs" page
    And "jobs" get loaded
    When I click the first button with "#job-110-enabled" selector
    And I click the first button with "#job-110-disabled" selector
    And I wait some time
    Then I see "#job-110-enabled" item

  Scenario: Deactivate job
    Given I am on "jobs" page
    And "jobs" get loaded
    When I click the first button with "#job-33-active" selector
    Then I see "#job-33-unactive" item

  Scenario: Activate job
    Given I am on "jobs" page
    And "jobs" get loaded
    When I click the first button with "#job-110-active" selector
    And I click the first button with "#job-110-unactive" selector
    And I wait some time
    Then I see "#job-110-active" item

  Scenario: See dropdown
    Given I am on "jobs" page
    And "jobs" get loaded
    When I click the first button with "#job-33-dropdown-control" selector
    Then I see "#job-33-dropdown" item

  Scenario: check jobs detail page
    Given I am on "jobs" page
    And "jobs" get loaded
    When I activate "anothertest" - "4"
    Then I should see detail pane

  Scenario: Clicking on alert icon opens detail pane on the alerts tab
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I click on the alert icon of "jobtest" "job"
    Then the complete URL changes to "jobs?paneId=110&paneTab=detail"

  Scenario: Row with alerts is shown
    Given I am on "jobs" listing
    When "jobs" get loaded
    Then I should see 2 table row with alerts
