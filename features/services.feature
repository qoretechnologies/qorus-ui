Feature: Services

  @wip
  Scenario: Available from main navigation
    When I activate "Services" navigation item
    Then I should see "services" listing

  @wip
  Scenario: Loading
    Given I am on "services" listing
    And there are no "services" loaded
    Then I should see a loader

  @wip
  Scenario: Listing
    Given I am on "services" listing
    And there are no "services" loaded
    When "services" get loaded
    Then I should see a table with "services" data

  @wip
  Scenario: Activating detail pane
    Given I am on "services" listing
    When I activate "info" workflow
    Then I should see "service" detail pane
    And I should see "service" details tab
    And I should see activated row highlighted

  @wip
  Scenario: Closing detail pane
    Given I am on "services" listing
    And I have "info" workflow open
    When I click close button on detail pane
    Then I should see no detail pane
    And I should see no row highlighted
