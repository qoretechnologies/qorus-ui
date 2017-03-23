Feature: Orders table tests

  Scenario: Blocking single workflow from actions
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I "block" an order with "RETRY" status
    Then there should be "1" order with "BLOCKING" status

  Scenario: Unblocking single workflow from actions
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I "unblock" an order with "BLOCKED" status
    Then there should be "1" order with "UNBLOCKING" status

  Scenario: Canceling single workflow from actions
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I "cancel" an order with "RETRY" status
    Then there should be "1" order with "CANCELING" status

  Scenario: Uncanceling single workflow from actions
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I "uncancel" an order with "CANCELED" status
    Then there should be "1" order with "UNCANCELING" status

  Scenario: Retrying single workflow from actions
    Given I am on "ARRAYTEST" with "TOTAL" states and "All" dates
    And "orders" get loaded
    When I "retry" an order with "RETRY" status
    Then there should be "1" order with "RETRYING" status
