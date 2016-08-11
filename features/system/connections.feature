Feature: Tests the conenctions view

  Scenario: Datasources are loaded by default
    Given I am on "system/remote" listing
    Then the URL changes to "/system/remote/datasources"
    And "datasources" get loaded
    And "2" "datasources" are shown

  Scenario: Tabs are changed when clicked
    Given I am on "system/remote" listing
    And the URL changes to "/system/remote/datasources"
    When I click the "User" tab
    Then the URL changes to "/system/remote/user"
    And "user connections" get loaded
    And "5" "user connections" are shown

  Scenario: Activating detail pane
    Given I am on "system/remote" listing
    And the URL changes to "/system/remote/datasources"
    And "datasources" get loaded
    When I activate "omq" connection
    Then I should see "connection" detail pane
