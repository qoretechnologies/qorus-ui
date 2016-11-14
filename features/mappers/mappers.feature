Feature: Tests the mapper view and functionalities

  Scenario: Loads the mapper
    Given I am on "mappers/22" listing
    Then the mapper gets loaded
    And there are 56 mapper fields

  Scenario: Loads the mapper
    Given I am on "mappers/22" listing
    And the mapper gets loaded
    When I click on show details
    Then the detail panel is shown
    And there are table and code elements

  Scenario: Invalid mapper shows an error message
    Given I am on "mappers/3" listing
    When the mapper gets loaded
    Then I see an error message
