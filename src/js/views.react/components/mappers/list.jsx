define(function (require) {
  var React      = require('react'),
      Backbone   = require('backbone'),
      Table      = require('jsx!views.react/components/table').TableView,
      Cell       = require('jsx!views.react/components/table').CellView,
      Col        = require('jsx!views.react/components/dummy'),
      ModalView  = require('jsx!views.react/components/modal').ModalView,
      HeaderView = require('jsx!views.react/components/modal').HeaderView,
      Mapper     = require('jsx!views.react/components/mappers/mapper'),
      Name       = require('jsx!views.react/components/normname'),
      MappersList;


  var ActionButtons = React.createClass({
    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model)
    },

    openDetail: function () {
      var model = this.props.model.fetch();
      var normName = <Name obj={ model } />;
      var modal = <ModalView><HeaderView title={ normName } /><div className="modal-body"><Mapper model={ model } /></div></ModalView>;
      var el = $('<div class="modal-container" />').appendTo('body');
      React.render(modal, el[0]);
    },

    render: function () {
      return (
        <span>
          <a className="btn btn-success btn-small" onClick={ this.openDetail }>Detail</a>
        </span>
      );
    }
  });


  MappersList = React.createClass({
    propTypes: {
      mappers: React.PropTypes.instanceOf(Backbone.Collection)
    },

    render: function () {
      return (
        <Table collection={ this.props.mappers } collection_fetched={ true } className="table table-striped">
          <Col name="ID" className="narrow">
            <Cell dataKey="mapperid" />
          </Col>
          <Col name="Mapper" className="name">
            <Cell dataKey="name" className="name" />
          </Col>
          <Col name="Version">
            <Cell dataKey="version" />
          </Col>
          <Col name="Type">
            <Cell dataKey="type" />
          </Col>
          <Col>
            <ActionButtons />
          </Col>
        </Table>
      );
    }
  });

  return MappersList;
});
