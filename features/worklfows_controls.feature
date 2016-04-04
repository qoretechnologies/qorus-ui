Feature: Workflow Controls

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

  Scenario: Selecting all workflows from dropdown
    Given I am on workflows listing
    And workflows get loaded
    And I click the dropdown toggle
    When I click the All item
    Then all of the workflows are selected

  Scenario: Inverting selection of workflows
    Given I am on workflows listing
    And workflows get loaded
    And I click the checkbox on the dropdown
    And I click the dropdown toggle
    When I click the Invert item
    Then no workflows are selected

  Scenario: Deselecting all workflows from dropdown
    Given I am on workflows listing
    And workflows get loaded
    And I click the checkbox on the dropdown
    And I click the dropdown toggle
    When I click the None item
    Then no workflows are selected

  Scenario: Selecting some workflows
    Given I am on workflows listing
    And workflows get loaded
    When I select one workflow
    Then the dropdown checkbox should be halfchecked

  @no-impl
  Scenario: Dropdown is hidden on toggle blur
    Given I am on workflows listing
    And I click the dropdown toggle
    When I blur the dropdown toggle
    Then the dropdown should be hidden
