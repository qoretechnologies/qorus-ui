Feature: Tests the functionality of the system/rbac view

  Scenario: Users table is loaded by default
    Given I am on "system/rbac" listing
    And "users" get loaded
    Then "2" "users" are shown

  Scenario: As an admin user, I can add new user
    Given I am on "system/rbac" listing
    And "users" get loaded
    Then there should be a button to add new "user"

  Scenario: As a test user, I cannot add new user
    Given I am logged in as "test" user
    And I am on "system/rbac" listing
    And "users" get loaded
    Then there should not be a button to add new "user"

  Scenario: As a test user, I cannot add new role
    Given I am logged in as "test" user
    And I am on "system/rbac/roles" listing
    And "roles" get loaded
    Then there should not be a button to add new "role"

  Scenario: As a test user, I cannot add new perm
    Given I am logged in as "test" user
    And I am on "system/rbac/permissions" listing
    And "perms" get loaded
    Then there should not be a button to add new "permission"

  Scenario: Roles table is loaded by default
    Given I am on "system/rbac/roles" listing
    And "roles" get loaded
    Then "2" "roles" are shown

  Scenario: Permissions table is loaded by default
    Given I am on "system/rbac/permissions" listing
    And "permissions" get loaded
    Then "98" "roles" are shown

  Scenario: Cannot add new users after a superuser role is deleted
    Given I am on "system/rbac/roles" listing
    And "roles" get loaded
    When I delete the "superuser" "role"
    And I am on "system/rbac/users" listing
    And "users" get loaded
    Then there should not be a button to add new "user"
