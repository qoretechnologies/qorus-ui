Feature: Show user button as dropdown

    @wip
    Scenario: Authorized user see dropdown
      Given I am on "workflows" listing
      When I click on ".user-dropdown" item
      Then I see ".logout" item

    @wip
    Scenario: User button no authorization
      Given Auth not required
      And I am on "workflows" listing
      Then I see ".user" item
