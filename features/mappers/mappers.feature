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
