Feature: Tests the features and functionalities of the group detail

  Scenario: Detail gets loaded
    Given I am on "groups?group=ARRAYTEST" listing
    And the group header gets loaded
    Then the header says " ARRAYTEST (-496)"

  Scenario: Tables are loaded
    Given I am on "groups?group=ARRAYTEST" listing
    And the group header gets loaded
    Then 6 "tables" are loaded
