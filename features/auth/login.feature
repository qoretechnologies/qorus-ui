Feature: Tests login page

  @wip
  Scenario: Check login page redirect for authenticated user
    Given I am on "login" page
    Then the URL changes to "/system/dashboard/ongoing"

  Scenario: Check login page for anonymous user
    Given I am anonymous user
    Given I am on "login" page
    Then I should see "loginForm" form

  @wip
  Scenario: Submit wrong credentials
    Given I am anonymous user
    And I am on "login" page
    When I type "fake" in "login" input
    And I type "1234" in "password" input
    And I submit "loginForm" form
    Then I see "warning" alert

  @wip
  Scenario: Submit right credentials
    Given I am anonymous user
    And I am on "login" page
    When I type "admin" in "login" input
    And I type "admin" in "password" input
    And I submit "loginForm" form
    Then the URL changes to "/system/dashboard/ongoing"
    And "token" exists in localStorage

  Scenario: Submit right credentials and redirect to next page
    Given I am anonymous user
    And I am on "login?next=/workflows" page
    When I type "admin" in "login" input
    And I type "admin" in "password" input
    And I submit "loginForm" form
    Then the URL changes to "/workflows"
