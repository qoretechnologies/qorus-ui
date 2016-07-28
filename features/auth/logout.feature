Feature: Logout

  Scenario: Logout authorized user
    Given I am on "workflows" listing
    When I click on ".user-dropdown" item
    And I click on ".logout" item
    Then the URL changes to "/login"