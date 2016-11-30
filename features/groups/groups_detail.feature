Feature: Tests the features and functionalities of the group detail

  Scenario: Detail gets loaded
    Given I am on "groups/ARRAYTEST" listing
    And the group header gets loaded
    Then the header says " ARRAYTEST (-496)"

  Scenario: Enabling single group from detail
    Given I am on "groups/ARRAYTEST" listing
    And the group header gets loaded
    When I click the enable-disable button
    Then the group is "enabled"

  Scenario: Enabling single group from detail
    Given I am on "groups/SIMPLETEST" listing
    And the group header gets loaded
    When I click the enable-disable button
    Then the group is "disabled"

  Scenario: Tables are loaded
    Given I am on "groups/ARRAYTEST" listing
    And the group header gets loaded
    Then 5 "tables" are loaded

