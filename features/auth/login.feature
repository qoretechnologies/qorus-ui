Feature: Tests login page

  Scenario: Check login page
    Given I am on "login" page
    Then I should see "loginForm" form

  Scenario: Submit wrong credentials
    Given I am on "login" page
    When I type "fake" in "login" input
    And I type "1234" in "password" input
    And I submit "loginForm" form
    Then I see "warning" alert

  @wip
  Scenario: Submit right credentials
    Given I am on "login" page
    When I type "admin" in "login" input
    And I type "admin" in "password" input
    And I submit "loginForm" form
    Then the URL changes to "/system/dashboard/ongoing"
    And "token" exists in localStorage

  @wip
  Scenario: Submit right credentials and redirect to next page
    Given I am on "login?next=/workflows" page
    When I type "admin" in "login" input
    And I type "admin" in "password" input
    And I submit "loginForm" form
    Then the URL changes to "/workflows"
