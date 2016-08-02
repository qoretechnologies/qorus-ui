Feature: Show user button as dropdown

    Scenario: Authorized user see dropdown
      Given I am on "workflows" listing
      When I click on ".user-dropdown" item
      Then I see ".logout" item

    Scenario: User button no authorization
      Given Auth not required
      And I am on "workflows" listing
      Then I see ".user" item
