define(function (require) {
  var React               = require('react'),
      Reflux              = require('reflux'),
      Backbone            = require('backbone'),
      FilteredCollection  = require('backbone.filtered.collection'),
      _                   = require('underscore'),
      LoaderView          = require('jsx!views.react/components/loader'),
      NoDataView          = require('jsx!views.react/components/nodata'),
      $                   = require('jquery'),
      PropTypes           = React.PropTypes,
      cloneWithProps      = React.addons.cloneWithProps,
      CHUNK_SIZE          = 50,
      Filtered            = require('backbone.filtered.collection'),
      diff                = require('deep-diff').diff,
      utils               = require('utils');

  require('react.backbone');
  require('jquery.fixedheader');
  require('classnames');


  var TdComponent = React.createClass({
    shouldComponentUpdate: function (nextProps) {
      var should = (!_.isEqual(this.props, nextProps) || this.props.hash !== nextProps.hash);

      return should;
    },

    render: function () {
      var props = _.omit(this.props, 'children');

      return <td {...props}>{ this.props.children }</td>;
    }
  });

  var RowMixin = {
    getDefaultProps: function () {
      return {
        clicked: false
      };
    },

    shouldComponentUpdate: function (nextProps, nextState) {
      nProps = _.omit(nextProps, ['children']);
      nProps.clicked = nProps.clicked || false;

      var props = _.omit(this.props, ['children']);
      var should = (!_.isEqual(props, nProps) || !_.isEqual(this.state, nextState));

      if (this.props.children.length !== nextProps.children.length)
        should = true;

      return should;
    },

    processColumns: function () {
      var children = this.props.children,
          row = this.props.model,
          cols = [];

      cols = _.map(children, function (col, indx) {
        var child = col.props.children,
            clone = child ? cloneWithProps(child, { model: row, displayName: 'Clone' }) : null,
            props = child ? child.props : col.props,
            tRow;


        if (col.props.cellView) {
          tRow = <col.props.cellView {...props} model={ row } hash={ row.hash } key={ indx }>{ clone }</col.props.cellView>;
        } else {
          tRow = <TdComponent {...props} model={ row } hash={ row.hash } key={ indx }>{ clone }</TdComponent>;
        }

        return tRow;
      }, this);

      return cols;
    }
  };

  var ModelRowView = React.createBackboneClass({
    mixins: [RowMixin],

    propTypes: {
      model: React.PropTypes.instanceOf(Backbone.Model).isRequired,
      clicked: React.PropTypes.bool
    },

    render: function () {
      var model = this.props.model,
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.processColumns();

      return <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, model.id)}>{ children }</tr>;
    }
  });

  var RowView = React.createClass({
    mixins: [RowMixin],

    propTypes: {
      model: React.PropTypes.object.isRequired,
      clicked: React.PropTypes.bool
    },

    render: function () {
      if (this.props.shown) return null;

      var model = this.props.model,
          css = React.addons.classSet({ 'table-row': true, 'info': this.props.clicked }),
          children = this.processColumns();

      return <tr className={ [css, this.props.className].join(' ') } onClick={this.props.rowClick.bind(null, this.props.idx)}>{ children }</tr>;
    }
  });

  var THeadView = React.createClass({
    getDefaultProps: function () {
      return {
        scrollTop: 0,
        footer: false
      };
    },

    getInitialState: function () {
      return {
        scrollTop: this.props.scrollTop
      };
    },

    componentDidMount: function () {
      if (this.props.fixed) {
        var $el = $(this.getDOMNode());
        var clgrp = $('<colgroup />');

        $el.find('colgroup').remove();

        $el.find('tr').first().children().each(function () {
          clgrp.append($('<col />').width($(this).outerWidth()));
        });

        $el.parent('table')
          .prepend(clgrp)
          .addClass('table-fixed');
          // .fixedHeader();
      }
    },

    render: function () {
      var cls = classNames({ header: this.props.fixed }),
          css;

      if (this.props.footer) {
        css = {
          transform: "translate3d(0,"+ this.state.scrollTop + "px, 0)",
          WebkitTransform: "translate3d(0,"+ this.state.scrollTop + "px, 0)"
        };
      }

      return <thead className={ cls } style={ css }>
               <tr>
                 { this.props.children }
               </tr>
             </thead>;
    }
  });

  var TableView = React.createClass({
    propTypes: {
      collection: React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array
      ]).isRequired,
      rowView: React.PropTypes.func
    },

    getDefaultProps: function () {
      return {
        chunked: false,
        rowClick: _.noop,
        offset: 0,
        showHeader: true
      };
    },

    getInitialState: function () {
      this.prepareRows();
      return {};
    },

    componentWillReceiveProps: function (nextProps) {
      if (!_.isEqual(nextProps.collection, this.props.collection)) {
        this.prepareRows();
      }
    },

    setHeaderOffset: function (scrollTop, scrollOffset) {
      var val = scrollTop - scrollOffset;

      if (this.refs.footer) {
        this.refs.footer.setState({ scrollTop: val });  
      }
    },

    // TODO: missing rowview when assigned with props
    render: function () {
      var columns, rows, style, header_columns,
          props       = this.props,
          children    = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          isBackbone  = this.props.collection instanceof Backbone.Collection || this.props.collection instanceof FilteredCollection,
          header      = null,
          footer      = null;

      if (isBackbone && !this.props.collection_fetched) {
        return (<LoaderView />);
      }

      if (_.size(this.props.collection) === 0) {
        return (<NoDataView />);
      }


      if (this.props.showHeader) {
        header = (
          <THeadView fixed={ this.props.fixed } scrollTop={ this.props.scrollTop } ref="header">
           { React.addons.createFragment(this.renderHeader()) }
          </THeadView>
        );

        // footer =  (
        //   <THeadView fixed={ this.props.fixed } scrollTop={ this.props.scrollTop } ref="footer" footer={ true }>
        //    { React.addons.createFragment(this.renderHeader()) }
        //   </THeadView>
        // );
      }

      rows = this.renderRows();

      return <table className={ this.props.cssClass || this.props.className } style={ style }>
              { header }
               <tbody>
                 { rows }
               </tbody>
              { footer }
             </table>;
    },

    renderRows: function () {
        var collection     = this.props.collection,
            children       = _.isArray(this.props.children) ? this.props.children : [this.props.children],
            props          = this.props,
            DefaultRowView = this.props.rowView || RowView,
            isBackbone     = collection instanceof Backbone.Collection || collection instanceof FilteredCollection,
            tableProps     = _.omit(props, 'children'),
            offset         = this.props.offset || 0,
            shownItems     = this.props.shownItems || _.size(collection);

        this._rows = _.map(collection, function (row, idx) {
          if (!(idx >= offset && idx < offset+shownItems)) return;

          row = isBackbone ? collection.at(idx) : row;

          var DefaultRowView = props.rowView || (isBackbone ? ModelRowView : RowView),
              clicked        = props.current_model ? props.current_model == row.id : false,
              key            = isBackbone ? row.id : idx;

          return (
            <DefaultRowView
               model={ row }
               rowClick={props.rowClick}
               clicked={ clicked } className={ idx % 2 ? 'odd' : 'even' } key={ key }>
              { children }
            </DefaultRowView>
          );
        });

      return this._rows;
    },

    prepareRows: _.noop,

    // renderRows: function () {
    //   var offset         = this.props.offset || 0,
    //       shownItems     = this.props.shownItems || _.size(collection),
    //       rows           = {};
    //
    //   // console.log('rendering rows', _.size(this._rows));
    //
    //   // return _.map(this._rows, function (row, idx) {
    //   //   if (idx >= offset && idx < offset+shownItems) {
    //   //     return row;
    //   //   }
    //   //   return false;
    //   // });
    //   // return this._rows.slice(offset, offset+shownItems);
    //
    //   _.each(this._rows, function (row, idx) {
    //     if (idx >= offset && idx < offset+shownItems) {
    //       rows['key-'+idx] = row;
    //     }
    //   });
    //
    //   return React.addons.createFragment(rows);
    // },

    // prepareRows: function () {
    //     var collection     = this.props.collection,
    //         children       = _.isArray(this.props.children) ? this.props.children : [this.props.children],
    //         props          = this.props,
    //         DefaultRowView = this.props.rowView || RowView,
    //         isBackbone     = collection instanceof Backbone.Collection || collection instanceof FilteredCollection,
    //         tableProps     = _.omit(props, 'children');
    //
    //     this._rows = _.map(collection, function (row, idx) {
    //       row = isBackbone ? collection.at(idx) : row;
    //
    //       var DefaultRowView = props.rowView || (isBackbone ? ModelRowView : RowView),
    //           clicked        = props.current_model ? props.current_model == row.id : false,
    //           key            = isBackbone ? row.id : idx;
    //
    //       return (
    //         <DefaultRowView
    //            model={ row }
    //            rowClick={props.rowClick}
    //            clicked={ clicked } className={ idx % 2 ? 'odd' : 'even' } key={ key }>
    //           { children }
    //         </DefaultRowView>
    //       );
    //     });
    //
    //   return this._rows;
    // },

    renderHeader: function () {
      var header,
          children = _.isArray(this.props.children) ? this.props.children : [this.props.children],
          tprops   = this.props;

      React.Children.forEach(children, function (child, idx) {
        var props     = _.pick(child.props, ['className', 'dataSort']),
            orderKey  = tprops.orderKey || tprops.collection.sort_key,
            order     = tprops.order || tprops.collection.sort_order;

        if (!header) header = {};

        if (tprops.nameWidth && props.className && props.className.indexOf('name') !== -1) {
          props.style = { width: tprops.nameWidth };
        }

        header['th-'+idx] = <th {...props} key={ idx } data-sort={child.props.dataSort}
          onClick={ tprops.sortClick ? tprops.sortClick.bind(null, props.dataSort, null) : _.noop }>{ child.props.name }</th>;
      });

      return header;
    }
  });

  var CellView = React.createClass({
    propTypes: {
      model: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    },

    getValue: function () {
      var model = this.props.model,
          key = this.props.dataKey;

      if (model instanceof Backbone.Model) {
        return model.get(key, 'N/A');
      } else {
        return _.result(model, key, 'N/A');
      }
    },

    render: function () {
      var value = this.getValue();

      return <span>{ value }</span>;
    }
  });

  var CellBackbone = React.createBackboneClass({
    propTypes: {
      model: PropTypes.object.isRequired,
      dataKey: PropTypes.string.isRequired
    },

    render: function () {
      var obj = this.props.model;
      return <span>{ obj.get(this.props.dataKey) }</span>;
    }
  });

  return {
    TableView: TableView,
    RowView: RowView,
    ModelRowView: ModelRowView,
    CellView: CellView,
    CellBackbone: CellBackbone
  };
});
