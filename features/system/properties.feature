Feature: Tests contents of the system/properties tab

  Scenario: Properties are accesible and load
    Given I am on "system/props" listing
    Then properties get loaded

  Scenario: Default properties are displayed correctly
    Given I am on "system/props" listing
    And properties get loaded
    Then there are "2" props with "12" keys

  Scenario: Search functionality filters properties
    Given I am on "system/props" listing
    And properties get loaded
    When I type "omq" in the search input
    Then the URL changes to "/system/props"
    And the query "q" changes to "omq"
    And there are "1" props with "3" keys

  Scenario: Search functionality filters keys
    Given I am on "system/props" listing
    And properties get loaded
    When I type "scmhub" in the search input
    And there are "1" props with "1" keys

  Scenario: Search functionality filters values
    Given I am on "system/props" listing
    And properties get loaded
    When I type "true" in the search input
    And there are "1" props with "2" keys

  Scenario: Prop is collapsed
    Given I am on "system/props" listing
    And properties get loaded
    When I click on the "sepl" header
    And there are "1" props with "3" keys

  Scenario: All props are collapsed
    Given I am on "system/props" listing
    And properties get loaded
    When I click on the "sepl" header
    When I click on the "omq" header
    And there are "0" props with "0" keys
