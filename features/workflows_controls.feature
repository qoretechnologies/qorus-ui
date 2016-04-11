@fetch @no-impl
Feature: Workflow Controls
  Every workflow has two set of widgets associated. One is a group of
  buttons to enable/disable and to reset the workflow. The other is
  also a group of buttons to control the autostart value.


  Scenario: Disabling workflow from list
    Given I am on "workflows" listing
    When I disable "ARRAYTEST" workflow
    And workflow should be disabled


  Scenario: Enabling workflow from list
    Given "ARRAYTEST" workflow is disabled
    And I am on "workflows" listing
    When I enable "ARRAYTEST" workflow
    And workflow should be enabled
