Feature: Services Toolbar

  Scenario: Dropdown checkbox is unchecked by default
    Given I am on "services" listing
    When "services" get loaded
    Then the dropdown checkbox should be unchecked

  Scenario: Dropdown checkbox is checked
    Given I am on "services" listing
    And "services" get loaded
    When I click the checkbox on the dropdown
    Then all of the "services" are selected

  Scenario: Dropdown checkbox is unchecked when deselecting all services
    Given I am on "services" listing
    And "services" get loaded
    And I select one "service"
    When I deselect all "services"
    Then the dropdown checkbox should be unchecked

  Scenario: Selecting all services from dropdown
    Given I am on "services" listing
    And "services" get loaded
    When I click the "All" button inside "selection" dropdown
    Then all of the "services" are selected

  Scenario: Inverting selection of services
    Given I am on "services" listing
    And "services" get loaded
    And I click the checkbox on the dropdown
    When I click the "Invert" button inside "selection" dropdown
    Then no "services" are selected

  Scenario: Deselecting all services from dropdown
    Given I am on "services" listing
    And "services" get loaded
    And I click the checkbox on the dropdown
    When I click the "None" button inside "selection" dropdown
    Then no "services" are selected

  Scenario: Selecting some services
    Given I am on "services" listing
    And "services" get loaded
    When I select one "service"
    Then the dropdown checkbox should be halfchecked

  Scenario: Selection actions are displayed
    Given I am on "services" listing
    And "services" get loaded
    When I select one "service"
    Then the selection actions are displayed

  Scenario: Filtering services through search input
    Given I am on "services" listing
    And "services" get loaded
    When I type "another" in the search input
    Then "1" "services" are shown
