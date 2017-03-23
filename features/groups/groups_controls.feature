Feature: Tests the functionaity of groups

  Scenario: Accessing group details
    Given I am on "groups" listing
    And "groups" get loaded
    When I click on the "ARRAYTEST" link - "3"
    Then the complete URL changes to "/groups?group=ARRAYTEST"
