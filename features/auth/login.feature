Feature: Tests login page

  Scenario: Check login page redirect for authenticated user
    Given I am on "login" page
    Then the URL changes to "/system/dashboard/ongoing"

  Scenario: Check login page for anonymous user
    Given I am anonymous user
    Given I am on "login" page
    Then I should see "loginForm" form

  Scenario: Submit wrong credentials
    Given I am anonymous user
    And I am on "login" page
    When I type "fake" in "login" input
    And I type "1234" in "password" input
    And I submit "loginForm" form
    And I wait some time
    Then I see invalid user text

  Scenario: Submit right credentials
    Given I am anonymous user
    And I am on "login" page
    When I type "admin" in "login" input
    And I type "admin" in "password" input
    And I submit "loginForm" form
    Then the URL changes to "/system/dashboard/ongoing"
    And "token" exists in localStorage
