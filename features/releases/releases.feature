Feature: Tests the releaes view

  Scenario: Releases get loaded
    Given I am on "system/releases" listing
    And releases get loaded
    Then there are 9 releases shown

  Scenario: Releases are sorted by name descending by default
    Given I am on "system/releases" listing
    And releases get loaded
    Then releases are sorted by name descending

  Scenario: Changing the sort
    Given I am on "system/releases" listing
    And releases get loaded
    When I click the "Date" button inside "release-sort" dropdown
    And I click the "Ascending" button inside "release-sortDir" dropdown
    Then releases are sorted by date ascending

  Scenario: Changing the sort
    Given I am on "system/releases" listing
    And releases get loaded
    When I click the "Date" button inside "release-sort" dropdown
    And I click the "Ascending" button inside "release-sortDir" dropdown
    Then releases are sorted by date ascending

  Scenario: Filtering via search
    Given I am on "system/releases?fileName=queue&mindate=20160101191211" listing
    And releases get loaded
    Then there are 1 releases shown
