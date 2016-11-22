Feature: Tests various websocket apievents

  Scenario: Ongoing alert raised
    Given I am on "system/alerts/ongoing" listing
    And "alerts" get loaded
    When I send a ws request for "ALERT_ONGOING_RAISED"
    Then "6" "alerts" are shown

  Scenario: Ongoing alert updated
    Given I am on "system/alerts/ongoing" listing
    And "alerts" get loaded
    When I send a ws request for "ALERT_ONGOING_RAISED"
    And I send a ws request for "ALERT_ONGOING_RAISED_UPDATE"
    Then "6" "alerts" are shown

  Scenario: Ongoing alert raised updates workflow
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I send a ws request for "ALERT_ONGOING_RAISED_WORKFLOW"
    And I wait some time
    Then I should see 2 table row with alerts"

  Scenario: Ongoing alert cleared updates workflow
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I send a ws request for "ALERT_ONGOING_RAISED_WORKFLOW"
    When I send a ws request for "ALERT_ONGOING_CLEARED_WORKFLOW"
    And I wait some time
    Then I should see 1 table row with alerts"

  Scenario: Ongoing alert cleared updates service
    Given I am on "services" listing
    And "services" get loaded
    And I send a ws request for "ALERT_ONGOING_RAISED_SERVICE"
    When I send a ws request for "ALERT_ONGOING_CLEARED_SERVICE"
    And I wait some time
    Then I should see 1 table row with alerts"

  Scenario: Ongoing alert raised updates service
    Given I am on "services" listing
    And "services" get loaded
    When I send a ws request for "ALERT_ONGOING_RAISED_SERVICE"
    And I wait some time
    Then I should see 2 table row with alerts"

  Scenario: Ongoing alert raised updates jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I send a ws request for "ALERT_ONGOING_RAISED_JOB"
    And I wait some time
    Then I should see 3 table row with alerts"

  Scenario: Ongoing alert cleared updates jobs
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I send a ws request for "ALERT_ONGOING_RAISED_JOB"
    When I send a ws request for "ALERT_ONGOING_CLEARED_JOB"
    And I wait some time
    Then I should see 2 table row with alerts"

  Scenario: Ongoing alert raised updates jobs
    Given I am on "system/remote/datasources" listing
    And "datasources" get loaded
    When I send a ws request for "ALERT_ONGOING_RAISED_DATASOURCE"
    And I wait some time
    Then I should see 1 table row with alerts"

  Scenario: Ongoing alert cleared updates datasources
    Given I am on "system/remote/datasources" listing
    And "datasources" get loaded
    And I send a ws request for "ALERT_ONGOING_RAISED_DATASROUCE"
    When I send a ws request for "ALERT_ONGOING_CLEARED_DATASOURCE"
    And I wait some time
    Then I should see 0 table row with alerts"

  Scenario: Transient alert raised
    Given I am on "system/alerts/transient" listing
    And "alerts" get loaded
    When I send a ws request for "ALERT_TRANSIENT_RAISED"
    Then "2" "alerts" are shown

  Scenario: Ongoing alert cleared
    Given I am on "system/alerts/ongoing" listing
    And "alerts" get loaded
    And I send a ws request for "ALERT_ONGOING_RAISED"
    And "6" "alerts" are shown
    When I send a ws request for "ALERT_ONGOING_CLEARED"
    Then "5" "alerts" are shown

  Scenario: Stops a service
    Given I am on "services" listing
    And "services" get loaded
    When I send a ws request for "SERVICE_STOP"
    Then there are "2" "unloaded" "services"

  Scenario: Starts a service
    Given I am on "services" listing
    And "services" get loaded
    And I send a ws request for "SERVICE_STOP"
    When I send a ws request for "SERVICE_START"
    Then there are "1" "unloaded" "services"

  Scenario: Starts a workflow
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I send a ws request for "WORKFLOW_START"
    Then the "ARRAYTEST" workflow has "4" execs

  Scenario: Stops a workflow
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I send a ws request for "WORKFLOW_START"
    And I send a ws request for "WORKFLOW_STOP"
    Then the "ARRAYTEST" workflow has "3" execs

  Scenario: Adds 1 to ready on a workflow
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I send a ws request for "WORKFLOW_DATA_SUBMITTED"
    Then the "ARRAYTEST" "workflow" has "1" "ready" instances

  Scenario: Adds 1 to in-progress on a workflow, substracts 1 from ready
    Given I am on "workflows" listing
    And "workflows" get loaded
    And I send a ws request for "WORKFLOW_DATA_SUBMITTED"
    When I send a ws request for "WORKFLOW_STATUS_CHANGED"
    Then the "ARRAYTEST" "workflow" has "16" "in-progress" instances
    And the "ARRAYTEST" "workflow" has "0" "ready" instances

  Scenario: Adds new order instance
    Given I am on "workflow/14/list/All/all" listing
    And "orders" get loaded
    And I send a ws request for "WORKFLOW_DATA_SUBMITTED"
    Then "13" "orders" are shown

  Scenario: Does not add new order instance to wrong workflow
    Given I am on "workflow/132/list/All/all" listing
    And "orders" get loaded
    And I send a ws request for "WORKFLOW_DATA_SUBMITTED"
    Then "1" "orders" are shown

  Scenario: Modifies existing order instance
    Given I am on "workflow/14/list/All/all" listing
    And "orders" get loaded
    And I send a ws request for "WORKFLOW_DATA_SUBMITTED"
    And I send a ws request for "WORKFLOW_STATUS_CHANGED"
    Then there should be "1" order with "IN-PROGRESS" status

  Scenario: Activates a job
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I send a ws request for "JOB_START"
    Then there are "4" "active" "jobs"

  Scenario: Deactivates a job
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I send a ws request for "JOB_START"
    When I send a ws request for "JOB_STOP"
    Then there are "3" "active" "jobs"

  Scenario: Adds 1 to in-progress on a job
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I send a ws request for "JOB_INSTANCE_START"
    Then the "wstest" "job" has "1" "in-progress" instances

  Scenario: Adds 1 to error on a job, substracts 1 from in-progress
    Given I am on "jobs" listing
    And "jobs" get loaded
    And I send a ws request for "JOB_INSTANCE_START"
    When I send a ws request for "JOB_INSTANCE_STOP"
    Then the "wstest" "job" has "1" "error" instances
    And the "wstest" "job" has "0" "in-progress" instances

  Scenario: Adds new job instance
    Given I am on "job/250/results?date=all" listing
    And "results" get loaded
    When I send a ws request for "JOB_INSTANCE_START"
    Then "3" "results" are shown
    And there should be "1" job result with "IN-PROGRESS" status

  Scenario: Adds new job instance
    Given I am on "job/250/results?date=all" listing
    And "results" get loaded
    And I send a ws request for "JOB_INSTANCE_START"
    When I send a ws request for "JOB_INSTANCE_STOP"
    Then there should be "3" job result with "ERROR" status

  Scenario: Activates a connection
    Given I am on "system/remote/user" listing
    And "remotes" get loaded
    When I send a ws request for "CONNECTION_DOWN"
    Then there are "4" "inactive" connections

  Scenario: Deactivates a connection
    Given I am on "system/remote/user" listing
    And "remotes" get loaded
    And I send a ws request for "CONNECTION_DOWN"
    When I send a ws request for "CONNECTION_UP"
    Then there are "3" "inactive" connections

  Scenario: Group is disabled
    Given I am on "groups" listing
    And "groups" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false"
    Then there are "2" "disabled" "groups"

  Scenario: Group is disabled
    Given I am on "groups" listing
    And "groups" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false"
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=true"
    Then there are "1" "disabled" "groups"

  Scenario: Workflow is disabled when synthetic group is disabled
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false&id=1&synthetic=true&type=workflow"
    Then there are "1" "disabled" "workflows"

  Scenario: Workflow is enabled when synthetic group is enabled
    Given I am on "workflows" listing
    And "workflows" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false&id=1&synthetic=true&type=workflow"
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=true&id=1&synthetic=true&type=workflow"
    Then there are "0" "disabled" "workflows"

  Scenario: Service is disabled when synthetic group is disabled
    Given I am on "services" listing
    And "services" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false&id=222&synthetic=true&type=service"
    Then there are "1" "disabled" "services"

  Scenario: Service is enabled when synthetic group is enabled
    Given I am on "services" listing
    And "services" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false&id=222&synthetic=true&type=service"
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=true&id=222&synthetic=true&type=service"
    Then there are "0" "disabled" "services"

  Scenario: Job is disabled when synthetic group is disabled
    Given I am on "jobs" listing
    And "jobs" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false&id=33&synthetic=true&type=job"
    Then there are "1" "disabled" "jobs"

  Scenario: Job is enabled when synthetic group is enabled
    Given I am on "services" listing
    And "services" get loaded
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=false&id=33&synthetic=true&type=job"
    When I send a ws request for "GROUP_STATUS_CHANGED" event with "enabled=true&id=33&synthetic=true&type=job"
    Then there are "0" "disabled" "jobs"





