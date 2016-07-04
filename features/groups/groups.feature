Feature: Tests the features of the Groups view

  Scenario: Groups view is accessible
    Given I activate "Groups" navigation item
    Then the URL changes to "/groups"

  @wip
  Scenario: Groups table is loaded
    Given I am on "groups" listing
    Then "groups" get loaded
    And "2" "groups" are shown
