Feature: Workflows

  Scenario: Available from main navigation
    When I activate "Workflows" navigation item
    Then I should see "workflows" listing

  Scenario: Loading
    Given I am on "workflows" listing
    And there are no "workflows" loaded
    Then I should see a loader

  Scenario: Listing
    Given I am on "workflows" listing
    And there are no "workflows" loaded
    When "workflows" get loaded
    Then I should see a table with "workflows" data

  Scenario: Row with alerts is shown
    Given I am on "workflows" listing
    When "workflows" get loaded
    Then I should see 1 table row with alerts

  Scenario: Activating detail pane
    Given I am on "workflows" listing
    When I activate "ARRAYTEST" - "7"
    Then I should see "workflow" detail pane
    And I should see "workflow" details tab
    And I should see activated row highlighted

  Scenario: Closing detail pane
    Given I am on "workflows?paneId=14&paneTab=detail" listing
    When I click close button on detail pane
    Then I should see no detail pane
    And I should see no row highlighted

  Scenario: Clicking on alert icon opens detail pane on the alerts tab
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click on the alert icon of "OLDWORKFLOWTEST" "workflow"
    Then the complete URL changes to "workflows?paneId=1&paneTab=detail"
