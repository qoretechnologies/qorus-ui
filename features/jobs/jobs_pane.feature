Feature: Jobs pane
  Scenario: See no options
    Given I am on "jobs/24h/33" page
    When "jobs" get loaded
    Then I see ".svc__desc" item
    And I see ".options" item
    And I see ".groups" item

  Scenario: Set option with error
    Given I am on "jobs/24h/33" page
    When "jobs" get loaded
    And I click the "Add option" button
    And I click the "Add" button
    And I type "error" in "newValue" input
    And I submit "editable-form" form
    Then I do not see ".options .table" item

  Scenario: Set option success
    Given I am on "jobs/24h/33" page
    When "jobs" get loaded
    And I click the "Add option" button
    And I click the "Add" button
    And I type "88" in "newValue" input
    And I submit "editable-form" form
    Then I see ".options .table" item

  Scenario: Delete option
    Given I am on "jobs/24h/33" page
    When "jobs" get loaded
    And I click the "Add option" button
    And I click the "Add" button
    And I type "88" in "newValue" input
    And I submit "editable-form" form
    And I click on ".options .table .remove-option" item
    Then I see ".options .table" item

  Scenario: Go to job group
    Given I am on "jobs/24h/33" page
    When "jobs" get loaded
    And I click on ".group" item
    Then the URL changes to "/groups/anothertest"

