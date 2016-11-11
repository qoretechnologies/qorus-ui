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

  Scenario: Activating detail pane
    Given I am on "workflows" listing
    When I activate "ARRAYTEST" - "6"
    Then I should see "workflow" detail pane
    And I should see "workflow" details tab
    And I should see activated row highlighted

  Scenario: Closing detail pane
    Given I am on "workflows?paneId=14&paneTab=detail" listing
    When I click close button on detail pane
    Then I should see no detail pane
    And I should see no row highlighted
