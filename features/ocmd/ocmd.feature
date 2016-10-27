Feature: Tests the ocmd view

  Scenario: View loads
    Given I am on "ocmd" listing
    Then the ocmd page loads

  Scenario: Command selected is in the input
    Given I am on "ocmd" listing
    And the ocmd page loads
    When I click the "omq.system.help" button inside "ocmd" dropdown
    Then the command input says "omq.system.help"

  Scenario: Command is executed and input cleared
    Given I am on "ocmd" listing
    And the ocmd page loads
    And I click the "omq.system.help" button inside "ocmd" dropdown
    When I submit "ocmd" form
    Then the results for "omq.system.help" are loaded
    And the command input says ""

  Scenario: Listing through commands with keys
    Given I am on "ocmd" listing
    And the ocmd page loads
    And I click the "omq.system.help" button inside "ocmd" dropdown
    And I submit "ocmd" form
    And the results for "omq.system.help" are loaded
    And the command input says ""
    And the command input has focus
    When I press the up key
    Then the command input says "omq.system.help"



