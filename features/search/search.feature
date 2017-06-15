Feature: Tests for the the Search view

  Scenario: Search page is loaded
    Given I am on "search" listing
    Then there are no "orders" loaded

  Scenario: Advanced search is shown
    Given I am on "search" listing
    And I wait some time
    And the search page is shown
    When I click the "Advanced search" button
    Then there are 5 inputs displayed

  Scenario: Input values are taken from the URL
    Given I am on "search/orders?ids=31380&mindate=19900101" listing
    And I wait some time
    And the search page is shown
    Then "1" "orders" are shown
    And "instance-id" value is "31380"
    And "mindate" value is "1990-01-01 00:00:00"

  Scenario: Input values are taken from the URL and advanced search is displayed
    Given I am on "search/orders?filter=Retry,Error&mindate=19900101" listing
    And I wait some time
    And the search page is shown
    Then there are 5 inputs displayed

  Scenario: Input values are taken from the URL and advanced search is displayed (date)
    Given I am on "search/orders?mindate=19900101&maxdate=20161010" listing
    And I wait some time
    And the search page is shown
    Then "13" "orders" are shown
    And there are 5 inputs displayed
    And "maxdate" value is "2016-10-10 00:00:00"

  Scenario: Link has the proper date
    Given I am on "search/orders?ids=31380&mindate=19900101" listing
    And I wait some time
    And the search page is shown
    And "1" "orders" are shown

  Scenario: Hiding advanced removes the queries
    Given I am on "search/orders?filter=ERROR&mindate=19900101" listing
    And I wait some time
    Then there are 5 inputs displayed
    When I click the "Advanced search" button
    Then the complete URL changes to "orders?filter=&maxdate=&mindate=19900101"