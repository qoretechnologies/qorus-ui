Feature: Tests the System/SQLCache view

  Scenario: SQLCache view loads
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    Then "15" "cache" are shown

  Scenario: Caches are filtered via search
    Given I am on "system/sqlcache" listing
    And "cache" get loaded
    When I type "etlp2p" in the search input
    Then "1" "cache" are shown
