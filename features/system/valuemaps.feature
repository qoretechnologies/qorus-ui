Feature: Tests system/valuemaps features

  Scenario: Valuemaps are loaded
    Given I am on "system/values" listing
    And "valuemaps" get loaded
    Then "2" "valuemaps" are shown

  Scenario: Filters valuemaps via search
    Given I am on "system/values" listing
    And "valuemaps" get loaded
    When I type "int" in the search input
    Then "1" "valuemaps" are shown
    And query param "q" equals to "int"

  Scenario: Opens detail pane when row is clicked
    Given I am on "system/values" listing
    And "valuemaps" get loaded
    When I activate "valuemap1" - "0"
    Then query param "paneId" equals to "1"
    And I should see detail pane

  Scenario: Values are loaded
    Given I am on "system/values?paneId=1" listing
    And values get loaded
    Then "1" values are shown

  Scenario: Values are enabled / disabled
    Given I am on "system/values?paneId=1" listing
    And values get loaded
    When I change enabled of the "Test" value
    Then there are "2" "disabled" values
    When I change enabled of the "Test" value
    Then there are "1" "enabled" values

  Scenario: Values are deleted
    Given I am on "system/values?paneId=2" listing
    And values get loaded
    And "2" values are shown
    When I delete the "Integer" value
    Then "1" values are shown

  Scenario: Adding new values
    Given I am on "system/values?paneId=2" listing
    And values get loaded
    And "2" values are shown
    And I click the "Add value" button
    And I type "Test" in "value-key" input
    And I type "Test" in "value-value" input
    When I submit "new-value" form
    And I wait some time
    Then "3" values are shown

  Scenario: Value is not added if fields aren't filled
    Given I am on "system/values?paneId=2" listing
    And values get loaded
    And I click the "Add value" button
    And I type "Test" in "value-key" input
    When I submit "new-value" form
    And I wait some time
    Then "2" values are shown
