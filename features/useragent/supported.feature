Feature: Supported browser

  Scenario: Not supported
    Given An old browser
    And I am on "/" page
    Then I see "#not-supported" item
