Feature: Services

  Scenario: Available from main navigation
    When I activate "Services" navigation item
    Then I should see "services" listing

  Scenario: Loading
    Given I am on "services" listing
    And there are no "services" loaded
    Then I should see a loader

  Scenario: Listing
    Given I am on "services" listing
    And there are no "services" loaded
    When "services" get loaded
    Then I should see a table with "services" data

  Scenario: Row with alerts is shown
    Given I am on "services" listing
    When "services" get loaded
    Then I should see 1 table row with alerts"

  Scenario: Activating detail pane
    Given I am on "services" listing
    When I activate "info" - "6"
    Then I should see "service" detail pane
    And I should see "service" details tab
    And I should see activated row highlighted

  Scenario: Closing detail pane
    Given I am on "services?paneId=698&paneTab=detail" listing
    When I click close button on detail pane
    Then I should see no detail pane
    And I should see no row highlighted

  Scenario: Clicking on alert icon opens detail pane on the alerts tab
    Given I am on "services" listing
    And "services" get loaded
    When I click on the alert icon of "test" "service"
    Then the complete URL changes to "services?paneId=111&paneTab=alerts"

  Scenario: Clicking on an alert shows the alert in system\
    Given I am on "services?paneId=111&paneTab=alerts" listing
    And "services" get loaded
    When I click on the alert item
    Then the complete URL changes to "/system/alerts/ongoing?paneId=2"
    And "alerts" get loaded
    And I should see detail pane

