Feature: tests for the the Search view

  Scenario: Search page is loaded
    Given I am on "search" listing
    Then the search page is shown
    And there are 3 inputs displayed
    And there are no "orders" loaded

  Scenario: Advanced search is shown
    Given I am on "search" listing
    And the search page is shown
    When I click the "Advanced search" button
    Then there are 6 inputs displayed

  @no-impl
  Scenario: Searching by Instance ID
    Given I am on "search" listing
    And the search page is shown
    When I search for "31380" by "instance-id"
    Then "1" "orders" are shown

  Scenario: Input values are taken from the URL
    Given I am on "search?ids=31380" listing
    And the search page is shown
    Then "1" "orders" are shown
    And "instance-id" value is "31380"

  Scenario: Input values are taken from the URL and advanced search is displayed
    Given I am on "search?status=RETRY,ERROR" listing
    And the search page is shown
    Then "3" "orders" are shown
    And there are 6 inputs displayed
    And "status" value is "RETRY,ERROR"

  Scenario: Input values are taken from the URL and advanced search is displayed (date)
    Given I am on "search?date=20150424130624" listing
    And the search page is shown
    Then "12" "orders" are shown
    And there are 6 inputs displayed
    And "mindate" value is "2015-04-24 13:06:24"


