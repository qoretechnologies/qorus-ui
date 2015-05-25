define(function (require) {
  var React = require('react'),
      FixedTable         = require('react-fixed-data-table'),
      Table              = FixedTable.Table,
      Column             = FixedTable.Column;

  // experimental FixedDataTable
  var MyFixedTable = React.createClass({
    mixins: [Reflux.listenTo(store, 'onStoreUpdate')],

    rowClick: function (e, rowIndex, rowData) {
      var model = this.state.collection.at(rowIndex);

      tActions.rowClick(model.id);
    },

    sortClick: function (key, ord) {
      tActions.sort(key, ord);
    },

    onStoreUpdate: function () {
      this.setState({ collection: workflowsStore.getCollection() });
    },

    getInitialState: function () {
      return {
        collection: workflowsStore.getCollection(),
        width: 1000,
        height: 200
      };
    },

    prepareCollection: function () {
      var collection  = this.state.collection,
          tfilter     = this.state.filters.text,
          firstRow    = 0;

      if (tfilter) {
        collection = collection.filter(function (m) {
          return m.get('name').toLowerCase().indexOf(tfilter.toLowerCase()) != -1 || tfilter == m.id;
        });
      }

      return collection;
    },

    componentDidMount: function () {
      var el = this.getDOMNode().parentNode,
          width  = el.clientWidth,
          height = window.innerHeight - 150;

          console.log(width, height);

      this.setState({ width: width, height: height });
    },

    _getCellComponent: function (component, props) {
      props = props || {};

      return function (cellData, cellDataKey, rowData, rowIndex) {
          var model = this.state.collection.at(rowIndex);
          return React.addons.cloneWithProps(component, _.extend({}, props, { model: model }));
      }.bind(this);
    },

    render: function () {
      var state = this.state,
          rows = state.collection.toJSON(),
          rowGetter = function (idx) { return rows[idx]; };

      var columns = [
        <Column
          align="center"
          width={25}
          dataKey="checked"
          cellRenderer={ this._getCellComponent(<CheckerWrapper />) }
        />,
        <Column
          align="center"
          label="Actions"
          width={60}
          dataKey="actions"
          cellClassNames="connections"
          cellRenderer={ this._getCellComponent(<ControlsView />) }
        />,
        <Column
          align="center"
          label="Autostart"
          width={60}
          dataKey="autostart"
          cellClassNames="autostart"
          cellRenderer={ this._getCellComponent(<AutostartView />) }
        />,
        <Column
          align="center"
          label="Execs"
          width={25}
          dataKey="exec_count"
        />,
        <Column
          align="center"
          label="ID"
          width={25}
          dataKey="workflowid"
        />,
        <Column
          align="center"
          headerRenderer={ function () { return <i className='icon-warning-sign' />; } }
          width={25}
          dataKey="has_alerts"
          cellRenderer={ this._getCellComponent(<HasAlertsView />) }
        />,
        <Column
          label="Name"
          width={300}
          dataKey="name"
          flexGrow={3}
          cellRenderer={ this._getCellComponent(<LinkView />) }
        />,
        <Column
          align="center"
          label="Version"
          width={25}
          dataKey="version"
        />
      ];

      columns = columns.concat(status_cols.map(function (col) {
        var [title, css, sort] = col;

        return <Column
                align="center"
                label={title}
                width={50}
                dataKey={title}
                cellRenderer={ this._getCellComponent(<BadgeViewCell />, { attr: sort }) }
              />;
      }, this));

      columns = columns.concat([
        <Column
          align="center"
          label="Total"
          width={50}
          dataKey="TOTAL"
        />
      ]);

      return (
        <Table
          rowHeight={25}
          rowGetter={rowGetter}
          rowsCount={rows.length}
          width={state.width}
          height={state.height}
          minHeight={500}
          headerHeight={25}
          onRowClick={this.rowClick}>
          { columns }
        </Table>
      );
    }
  });

  return MyFixedTable;
});
