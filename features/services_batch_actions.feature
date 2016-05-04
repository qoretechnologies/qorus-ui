Feature: Tests services batch actionsn

  Scenario: Disables multiple services
    Given I am on "services" listing
    And "services" get loaded
    And I select "2" "services"
    When I click the "Disable" button
    Then there are "2" "disabled" "services"

  Scenario: Sets multiple services as deprecated
    Given I am on "services" listing
    And "services" get loaded
    And I select "3" "services"
    When I click the "Load" button
    Then there are "3" "loaded" "services"

  Scenario: Sets multiple services as deprecated
    Given I am on "services" listing
    And "services" get loaded
    And I select "1" "services"
    When I click the "Unload" button
    Then there are "2" "unloaded" "services"
