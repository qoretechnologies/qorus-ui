Feature: Workflow Toolbar

  Scenario: Dropdown is toggled
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the dropdown toggle
    Then the dropdown should be shown

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
    When I click the All item
    Then all of the workflows are selected

  Scenario: Inverting selection of workflows
    Given I am on "workflows" listing
    And workflows get loaded
    And I click the checkbox on the dropdown
    And I click the dropdown toggle
    When I click the Invert item
    Then no workflows are selected

  Scenario: Deselecting all workflows from dropdown
    Given I am on "workflows" listing
    And workflows get loaded
    And I click the checkbox on the dropdown
    And I click the dropdown toggle
    When I click the None item
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
    When I click the Running button
    Then only one workflow is visible

  @wip
  Scenario: Displaying deprecated workflows
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click the Deprecated button
    Then the hidden workflows are displayed

  @no-impl
  Scenario: Dropdown is hidden on toggle blur
    Given I am on "workflows" listing
    And I click the dropdown toggle
    When I blur the dropdown toggle
    Then the dropdown should be hidden
