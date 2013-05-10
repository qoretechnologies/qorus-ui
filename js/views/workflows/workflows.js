define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'collections/workflows',
  'text!../../../templates/workflow/list.html',
  'datepicker',
  'moment',
  'views/workflows/instances',
  'views/toolbars/workflows_toolbar',
  'views/common/bottom_bar',
  'qorus/dispatcher',
  'jquery.fixedheader',
  'jquery.sticky'
], function($, _, Backbone, Qorus, Collection, Template, date, moment, InstanceListView, Toolbar, BottomBarView, Dispatcher){
  var ListView = Qorus.ListView.extend({
    // el: $("#content"),
    additionalEvents: {
      'click .action': 'runAction'
    },
    
    subviews: {},
    
    initialize: function (collection, date, router) {
      _.bindAll(this);
      this.router = router;
      this.template = Template;
      
      // pass date to options object
      this.options.date = date;
      
      // call super method
      ListView.__super__.initialize.call(this, Collection, date);

      // initialize subviews
      this.createSubviews();
      
      this.listenTo(Dispatcher, 'workflow', this.collection.fetch);
    },
    
    createSubviews: function () {
      this.subviews.bottombar = new BottomBarView();
      this.subviews.toolbar = new Toolbar({ date: this.options.date });
    },
    
    clean: function () {
      // removes date picker from DOM
      $('.dp').datetimepicker('remove');
    },
    
    onRender: function () {
      // assign toolbar to .toolbar element on render
      this.assign('.toolbar', this.subviews.toolbar);
    },
    
    // render after attaching to DOM
    afterRender: function () {
      $('.table-fixed').fixedHeader({ topOffset: 80 });
    },
    
    // starts workflow
    runAction: function (e) {
      e.preventDefault();
      var data = e.currentTarget.dataset;
      if (data.id && data.action) {
        var wfl = this.collection.get(data.id);
        wfl.doAction(data.action); 
      }
    },
    
    loadNextPage: function(){
    }
  });
  
  return ListView;
});
