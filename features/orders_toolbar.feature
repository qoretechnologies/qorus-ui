Feature: Tests all the features of the orders list toolbar

  Scenario: Selects all orders
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click the checkbox on the dropdown
    Then all of the "orders" are selected

  Scenario: Inverts orders selection
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "3" "orders"
    When I click the "Invert" button inside "selection" dropdown
    Then "9" "orders" are selected

  Scenario: Deselects all selected orders
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "6" "orders"
    When I click the "None" button inside "selection" dropdown
    Then "0" "orders" are selected

  Scenario: Runs the Retry batch action
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "1" order with "RETRY" status
    When I click the "Retry" button
    Then there should be "1" order with "RETRYING" status

  Scenario: Runs the Cancel batch action
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "1" order with "RETRY" status
    When I click the "Cancel" button
    Then there should be "1" order with "CANCELING" status

  Scenario: Runs the Cancel batch action
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "1" order with "RETRY" status
    When I click the "Block" button
    Then there should be "1" order with "BLOCKING" status

  Scenario: Runs the Cancel batch action
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "1" order with "BLOCKED" status
    When I click the "Unblock" button
    Then there should be "1" order with "UNBLOCKING" status

  Scenario: Runs the Uncancel batch action
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I select "5" order with "CANCELED" status
    When I click the "Uncancel" button
    Then there should be "5" order with "UNCANCELING" status

  Scenario: Changing filters
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click the "Complete" button inside "filters" dropdown
    And I click the "Filter" button
    Then the complete URL changes to "/workflow/14/list?date=all&filter=Complete"

  Scenario: Changing the date to 24h
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click the "24H" button inside "date-selection" dropdown
    Then "0" "orders" are shown

  Scenario: Changing the date to week
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I click the "Week" button inside "date-selection" dropdown
    Then "0" "orders" are shown

  Scenario: Filtering retry orders through search
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I type "retry" in the search input
    Then "1" "orders" are shown

  Scenario: Filtering retry and complete orders through search
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I type "retry complete" in the search input
    Then "2" "orders" are shown

  Scenario: Filtering orders by name and id
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I type "retry 3660 3661" in the search input
    Then "3" "orders" are shown

  @no-impl
  Scenario: Changing multiple filters
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    And I click the "Complete" button inside "filters" dropdown
    And I click the "Retry" item
    When I click the "Filter" button
    Then "2" "orders" are shown
