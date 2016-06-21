Feature: Tests for the Audit tab

  Scenario: Audits are displayed
    Given I am on order "31380" and "Audit" tab
    When "audits" get loaded
    Then "10" "audits" are shown

  Scenario: Changing number of displayed audits
    Given I am on order "31380" and "Audit" tab
    And "audits" get loaded
    When I click the "25" button inside "show" dropdown
    Then "14" "audits" are shown
