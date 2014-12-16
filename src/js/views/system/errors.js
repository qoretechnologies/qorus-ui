define(function (require) {
  var Qorus             = require('qorus/qorus'),
      ErrorsTpl         = require('tpl!templates/errors/list.html'),
      ErrorsTableTpl    = require('text!templates/errors/table.html'),
      ErrorsRowTpl      = require('text!templates/errors/row.html'),
      ErrorsCollection  = require('collections/errors'),
      ErrorsTableView, ErrorsView, ContentView;
  
  ContentView = Qorus.View.extend({
    template: ErrorsTpl,
    postInit: function () {
      this.setView(this.options.content_view, '.errors-table');
    }
  });
  
  ErrorsView = Qorus.TabView.extend({
//    template: Tpl,
    url: '/errors',
    preRender: function () {
      this.context.tab_css = 'nav-pills';
    },
    tabs: {
      'system': {
        view: ContentView,
        options: {
          content_view: new Qorus.TableView({ 
            collection: new ErrorsCollection().fetch(),
            template: ErrorsTableTpl,
            row_template: ErrorsRowTpl
          }),
          name: 'System'
        }
      },
      'global': {
        view: ContentView,
        options: {
          content_view: new Qorus.TableView({ 
            collection:  new ErrorsCollection([], { type: 'global' }).fetch(),
            template: ErrorsTableTpl,
            row_template: ErrorsRowTpl
          }),
          name: 'Global'
        }
      }
    }
  });
  
  return ErrorsView;
});