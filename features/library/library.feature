Feature: Tests for the library view

  Scenario: Library view is loaded
    Given I am on "library" listing
    Then library gets loaded

  Scenario: Default data are loaded
    Given I am on "library" listing
    And library gets loaded
    Then "3" "rows" are shown

  @wip
  Scenario: Filtering via the search field
    Given I am on "library" listing
    And library gets loaded
    When I type "async" in the search input
    Then "1" "functions" are shown

  @wip
  Scenario: Clicking a row displays a source code and highlights
    Given I am on "library" listing
    And library gets loaded
    When I click on the "TestConstants1" constant
    Then the "TestConstants1" row is highlighted
    And I see the source code
