Feature: Tests the features of the Groups view

  Scenario: Groups view is accessible
    Given I activate "Groups" navigation item
    Then the URL changes to "/groups"

  Scenario: Groups table is loaded
    Given I am on "groups" listing
    Then "groups" get loaded
    And "7" "groups" are shown

  Scenario: Groups can be selected
    Given I am on "groups" listing
    And "groups" get loaded
    When I select "3" "groups"
    Then "3" "groups" are selected
