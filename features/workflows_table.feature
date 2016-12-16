Feature: Workflows table

  Scenario: Table is sorted by name by default
    Given I am on "workflows" listing
    And "workflows" get loaded
    Then workflows are sorted by "Name" "asc"

  Scenario: Changing sort of the table to ID
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click on the "ID" column header
    Then workflows are sorted by "ID" "asc"

  Scenario: Changing sort of the table to descending
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click on the "ID" column header
    And I click on the "ID" column header
    Then workflows are sorted by "ID" "desc"

  Scenario: Changing sort of the table to different column
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I click on the "ID" column header
    And I click on the "ID" column header
    And I click on the "Name" column header
    Then workflows are sorted by "Name" "desc"
