Feature: Tests functionalities of the Steps tab

  Scenario: Table with steps is displayed
    Given I am on order "31380" and "Steps" tab
    And "steps" get loaded
    Then "4" "steps" are shown

  Scenario: Expanding a single step
    Given I am on order "31380" and "Steps" tab
    And "steps" get loaded
    When I click on the "test_function_1" row - "2"
    And I click on the "array_subworkflow" row - "2"
    Then "13" "steps" are shown
