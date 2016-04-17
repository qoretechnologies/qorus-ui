Feature: Workflow Toolbar

  Scenario: Dropdown is toggled
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the dropdown toggle
    Then the dropdown should be shown

  Scenario: Dropdown checkbox is unchecked by default
    Given I am on "workflows" listing
    When "workflows" get loaded
    Then the dropdown checkbox should be unchecked

  Scenario: Dropdown checkbox is checked
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the checkbox on the dropdown
    Then all of the workflows are selected

  Scenario: Dropdown checkbox is unchecked when deselecting all workflows
    Given I am on "workflows" listing
    And workflows get loaded
    And I select one workflow
    When I deselect all workflows
    Then the dropdown checkbox should be unchecked

  Scenario: Selecting all workflows from dropdown
    Given I am on "workflows" listing
    And workflows get loaded
    And I click the dropdown toggle
    When I click the "All" item
    Then all of the workflows are selected

  Scenario: Inverting selection of workflows
    Given I am on "workflows" listing
    And workflows get loaded
    And I click the checkbox on the dropdown
    And I click the dropdown toggle
    When I click the "Invert" item
    Then no workflows are selected

  Scenario: Deselecting all workflows from dropdown
    Given I am on "workflows" listing
    And workflows get loaded
    And I click the checkbox on the dropdown
    And I click the dropdown toggle
    When I click the "None" item
    Then no workflows are selected

  Scenario: Selecting some workflows
    Given I am on "workflows" listing
    And workflows get loaded
    When I select one workflow
    Then the dropdown checkbox should be halfchecked

  Scenario: Selection actions are displayed
    Given I am on "workflows" listing
    And workflows get loaded
    When I select one workflow
    Then the selection actions are displayed

  Scenario: Filtering only running workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Running" button
    Then "3" workflows are shown

  Scenario: Filtering last version workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the "Last version" button
    Then "4" workflows are shown

  @wip
  Scenario: Filtering workflows through search input
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I type "array" in the search input
    Then "3" workflows are shown

  @no-impl
  Scenario: Displaying deprecated workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the Deprecated button
    Then "5" workflows are shown

  @no-impl
  Scenario: Dropdown is hidden on toggle blur
    Given I am on "workflows" listing
    And I click the dropdown toggle
    When I blur the dropdown toggle
    Then the dropdown should be hidden
