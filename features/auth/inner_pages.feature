Feature: Tests user redirects

  Scenario: Anonymous user goes to inner page
    Given I am anonymous user
    And I am on "workflows" page
    Then the URL changes to "/login"
    And query param "next" equals to "/workflows"

  Scenario: Authorized user goes to inner page
    Given I am on "workflows" page
    Then the URL changes to "/workflows"

  @wip
  Scenario: User with wrong token goes to inner page
    Given I am user with fake token
    And I am on "workflows" page
    Then the URL changes to "/login"
