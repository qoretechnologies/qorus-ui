Feature: Tests login page

  Scenario: Check login page
    Given I am on "login" page
    Then I should see "loginForm" form

  @wip
  Scenario: Submit wrong credentials
    Given I am on "login" page
    When I type "fake" in "login" input
    And I type "1234" in "password" input
    And I submit "loginForm" form
    Then I see "warning" alert
