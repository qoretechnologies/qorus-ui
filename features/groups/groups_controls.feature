Feature: Tests the functionaity of groups

  Scenario: Disabling multiple groups
    Given I am on "groups" listing
    And "groups" get loaded
    When I select "3" "groups"
    And I click the "Disable" button
    Then there are "3" "disabled" "groups"

  Scenario: Enabling multiple groups
    Given I am on "groups" listing
    And "groups" get loaded
    When I select "1" "groups"
    And I click the "Enable" button
    Then there are "7" "enabled" "groups"

  Scenario: Accessing group details
    Given I am on "groups" listing
    And "groups" get loaded
    When I click on the "ARRAYTEST" link - "2"
    Then the URL changes to "/groups/ARRAYTEST"
