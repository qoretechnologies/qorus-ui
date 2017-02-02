Feature: Tests for the the Search view

  Scenario: Search page is loaded
    Given I am on "search" listing
    Then there are no "orders" loaded

  Scenario: Advanced search is shown
    Given I am on "search" listing
    And the search page is shown
    When I click the "Advanced search" button
    Then there are 6 inputs displayed

  Scenario: Input values are taken from the URL
    Given I am on "search?ids=31380&mindate=19900101" listing
    And the search page is shown
    Then "1" "orders" are shown
    And "instance-id" value is "31380"
    And "mindate" value is "1990-01-01 00:00:00"

  Scenario: Input values are taken from the URL and advanced search is displayed
    Given I am on "search?status=RETRY,ERROR&mindate=19900101" listing
    And the search page is shown
    Then "3" "orders" are shown
    And there are 6 inputs displayed
    And "status" value is "RETRY,ERROR"

  Scenario: Input values are taken from the URL and advanced search is displayed (date)
    Given I am on "search?mindate=19900101&maxdate=20161010" listing
    And the search page is shown
    Then "13" "orders" are shown
    And there are 6 inputs displayed
    And "maxdate" value is "2016-10-10 00:00:00"

  Scenario: Link has the proper date
    Given I am on "search?ids=31380&mindate=19900101" listing
    And the search page is shown
    And "1" "orders" are shown
    When I click on the order link
    Then the URL changes to "/order/31380/19900101/diagram"

  Scenario: Hiding advanced removes the queries
    Given I am on "search?status=ERROR&mindate=19900101" listing
    And "2" "orders" are shown
    And there are 6 inputs displayed
    When I click the "Advanced search" button
    Then the complete URL changes to "search?maxdate=&mindate=19900101&status="
