Feature: Tests the system/options view

  Scenario: Options are loaded
    Given I am on "system/options" listing
    Then "options" get loaded
    And "66" "options" are shown

  Scenario: Filtering via search
    Given I am on "system/options" listing
    And "options" get loaded
    When I type "alert" in the search input
    Then "7" "options" are shown

  Scenario:
    Given I am logged in as "test" user
    And I am on "system/options" listing
    And "options" get loaded
    Then I cannot edit any options
