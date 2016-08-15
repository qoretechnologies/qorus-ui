Feature: Services table

  Scenario: Table is sorted by name by default
    Given I am on "services" listing
    And "services" get loaded
    Then services are sorted by "Type" "asc"

  Scenario: Changing sort of the table to ID
    Given I am on "services" listing
    And "services" get loaded
    When I click on the "Name"jcolumn header
    Then services are sorted by "Name" "asc"

  Scenario: Changing sort of the table to descending
    Given I am on "services" listing
    And "services" get loaded
    When I click on the "Name" column header
    And I click on the "Name" column header
    Then services are sorted by "Name" "desc"

  Scenario: Changing sort of the table to different column
    Given I am on "services" listing
    And "services" get loaded
    When I click on the "Version" column header
    And I click on the "Version" column header
    And I click on the "Description" column header
    Then services are sorted by "Description" "asc"

