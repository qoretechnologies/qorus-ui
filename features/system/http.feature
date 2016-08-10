Feature: Test contents of system/http tab

  Scenario: System loaded
    Given I am on "system/http" listing
    Then "http" get loaded