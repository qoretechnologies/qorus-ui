Feature: Tests contents of the system/alerts tab

  Scenario: Dashboard loads
    Given I am on "system/alerts" listing
    Then "alerts" get loaded

  Scenario: Switching alerts
    Given I am on "system/alerts" listing
    And "alerts" get loaded
    When I click the "Transient" tab
    Then the URL changes to "/system/alerts/transient"
    And "1" "alerts" are shown

  Scenario: Activating detail pane
    Given I am on "system/alerts" listing
    And "alerts" get loaded
    When I activate "DAILY_MENU v1.0 (3)" - "4"
    Then I should see detail pane
    And there should be 1 related object links

  Scenario: Activating detail pane on transient alert
    Given I am on "system/alerts/transient" listing
    And "alerts" get loaded
    When I activate "DAILY_MENU v1.0 (6)" - "4"
    Then I should see detail pane
    And there should be 1 related object links

  Scenario: Synthetic group alert doesn't show link to the object
    Given I am on "system/alerts/ongoing" listing
    And "alerts" get loaded
    When I activate "SYNTHETIC GROUP TEST v1.1 (-50)" - "4"
    Then I should see detail pane
    And there should be 0 related object links

  @wip  
  Scenario: Panel is not hidden  when alert is updated via WS
    Given I am on "system/alerts/ongoing" listing
    And "alerts" get loaded
    And I send a ws request for "ALERT_ONGOING_RAISED"
    And I activate "SOMETHING HAPPENED HEHE (1)" - "4"
    When I send a ws request for "ALERT_ONGOING_RAISED_UPDATE"
    Then the time says "2020-01-01 13:24:50" and alertid is "124"

  Scenario: Searching alerts
    Given I am on "system/alerts" listing
    And "alerts" get loaded
    When I type "GROUP" in the search input
    Then "1" "alert" are shown
