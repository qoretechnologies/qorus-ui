Feature: Workflow Toolbar

  Scenario: Dropdown is toggled
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the dropdown toggle
    Then the dropdown should be shown

  Scenario: Dropdown is hidden on click outside
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I click the dropdown toggle
    When I click on the header
    Then the dropdown should be hidden

  Scenario: Dropdown checkbox is unchecked by default
    Given I am on "workflows" listing
    When "workflows" get loaded
    Then the dropdown checkbox should be unchecked

  Scenario: Dropdown checkbox is checked
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the checkbox on the dropdown
    Then all of the "workflows" are selected

  Scenario: Dropdown checkbox is unchecked when deselecting all workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I select one "workflow"
    When I deselect all "workflows"
    Then the dropdown checkbox should be unchecked

  Scenario: Selecting all workflows from dropdown
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "All" button inside "selection" dropdown
    Then all of the "workflows" are selected

  Scenario: Inverting selection of workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I click the checkbox on the dropdown
    When I click the "Invert" button inside "selection" dropdown
    Then no "workflows" are selected

  Scenario: Deselecting all workflows from dropdown
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I click the checkbox on the dropdown
    When I click the "None" button inside "selection" dropdown
    Then no "workflows" are selected

  Scenario: Selecting some workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I select one "workflow"
    Then the dropdown checkbox should be halfchecked

  Scenario: Selection actions are displayed
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I select one "workflow"
    Then the selection actions are displayed

  Scenario: Filtering only running workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Running" button
    Then "2" "workflows" are shown

  Scenario: Filtering last version workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Last version" button
    Then "4" "workflows" are shown

  Scenario: Filtering workflows through search input
    Given I am on "workflows" listingd
    And "workflows" get loaded
    When I type "array" in the search input
    Then "1" "workflows" are shown

  Scenario: Displaying deprecated workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Deprecated" button inside "deprecated" dropdown
    Then "6" "workflows" are shown
