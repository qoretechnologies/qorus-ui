Feature: Tests functionalities of the Data tab

  Scenario: Tabs with the data are displayed
    Given I am on order "31380" and "Data" tab
    Then I should see "3" subtabs
    And I should see the "Static" data

  Scenario: Tabs with the data are displayed
    Given I am on order "31380" and "Data" tab
    When I click the "Dynamic" tab
    Then the URL changes to "/order/31380/19700101000000/data/dynamic"
    And I should see the "Dynamic" data

  Scenario: Tabs with the data are displayed
    Given I am on order "31380" and "Data" tab
    And I should see the "Static" data
    When I click the "Copy view" button
    Then there should be a textarea with the data

