Feature: Tests for the library view

  Scenario: Library view is loaded
    Given I am on "library" listing
    Then library gets loaded

  Scenario: Default data are loaded
    Given I am on "library" listing
    And library gets loaded
    Then 3 library items are shown

  Scenario: Filtering via the search field
    Given I am on "library" listing
    And library gets loaded
    When I type "async" in the search input
    Then 1 library items are shown

  Scenario: Clicking a row displays a source code and highlights
    Given I am on "library" listing
    And library gets loaded
    When I click on the "TestConstants1 1.0" constant
    Then the "TestConstants1" row is highlighted
    And I see the source code
