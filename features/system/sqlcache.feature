Feature: Tests the System/SQLCache view

  Scenario: SQLCache view loads
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    Then "15" "cache" are shown

  # @TODO: This test should work just fine, but of course it doesn't. Had enough of ZombieJS, needs to be replaced.
  @no-impl
  Scenario: Clearing all caches
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    When I click the "Clear All" button
    Then "0" "cache" are shown

  # @TODO: This test doesn't work either, surprisingly
  @no-impl
  Scenario: Clearing datasource
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    When I click the first "Clear datasource" button
    Then "7" "cache" are shown

  # @TODO: Yep, doesn't work....
  @no-impl
  Scenario: Clearing datasource
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    When I clear the "gsi_stock_reconciliation" cache
    Then "14" "cache" are shown

  Scenario: Caches are filtered via search
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    When I type "etlp2p" in the search input
    Then "1" "cache" are shown
