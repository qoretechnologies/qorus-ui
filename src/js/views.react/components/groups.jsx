define(function (require) {
  var React   = require('react'),
      helpers = require('qorus/helpers'),
      GroupsView;
      
  GroupsView = React.createClass({
    propTypes: {
      groups: React.PropTypes.array.isRequired
    },
  
    render: function () {
      var groups = this.props.groups.map(function (group) {
          var url = helpers.getUrl('showGroup', { name: group.name }),
              cls = React.addons.classSet({
                label: true,
                'label-info': group.enabled
              });
          
          return <a href={ url } key={ group.name } ><span className={ cls }>{ group.name } <small>({ group.size })</small></span></a>;
        });
    
      return (
        <div>
          <h4>Groups</h4>
          { groups }
        </div>
      );
    }
  });

  return GroupsView;
});