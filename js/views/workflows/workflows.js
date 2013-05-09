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
  'jquery.sticky',
], function($, _, Backbone, Qorus, Collection, Template, date, moment, InstanceListView, Toolbar, BottomBarView, Dispatcher){
  var ListView = Qorus.ListView.extend({
    // el: $("#content"),
    additionalEvents: {
		    'click .action': 'runAction',
        // 'click tbody tr': 'showInstances'
    },
    subviews: {},
    initialize: function(collection, date, router){
      _.bindAll(this);
      this.router = router;
      this.template = Template;
      
      // call super method
      ListView.__super__.initialize.call(this, Collection, date);

      // pass date to options object
      this.options.date = date;

      // initialize subviews
      this.createSubviews();

      // assign toolbar to .toolbar element on render
      var _this = this;
      this.on('render', function(){       
        _this.assign('.toolbar', _this.subviews['toolbar']);
      });
      
      this.listenTo(Dispatcher, 'workflow', this.collection.fetch);
    },
    createSubviews: function(){
      this.subviews['bottombar'] = new BottomBarView();
      this.subviews['toolbar'] = new Toolbar({ date: date });
    },
    clean: function(){
      // removes date picker from DOM
      $('.dp').datetimepicker('remove');
    },
    // render after attaching to DOM
    afterRender: function(start){
      $('.table-fixed').fixedHeader({ topOffset: 80 });
    },
  	// starts workflow
  	runAction: function(e){
  		e.preventDefault();
      var data = e.currentTarget.dataset;
      if (data.id && data.action){
    		var wfl = this.collection.get(data.id);
    		wfl.doAction(data.action); 
      }
  	},
    showInstances: function(e){
      // fire event only if clicked on td
      if (e.target.localName == 'td'){
        e.preventDefault();
        var view = this;
        var data = e.currentTarget.dataset;
        if (data.id){
          var el = $('#instances');
          var parent =el.parents('.bottom-bar').show();
          $(e.currentTarget).parent().find('tr').removeClass('info');
        
          // TODO: rewrite
          if(!view.subviews[data.id]){
            var ilv = new InstanceListView({ date: view.date, workflowid: data.id });
            parent.data('view', ilv.cid);
            ilv.collection.on('reset', function() { ilv.$el.slideDown('slow'); });
            view.subviews[data.id] = ilv;
            $(e.currentTarget).addClass('info');
            el.html(ilv.el);
            var sv = view.subviews[data.id];
          } else {
            var ilv = view.subviews[data.id];
          
            // toggle show
            if(parent.data('view') != ilv.cid ){
              ilv.render();
              el.parents('.bottom-bar').show();
              parent.data('view', ilv.cid);
              $(e.currentTarget).addClass('info');
            } else {
              el.parents('.bottom-bar').hide();
              ilv.undelegateEvents();
              ilv.remove();
              ilv.off();
              // TODO: replace later with events updates
              delete view.subviews[data.id];                      
            }
          }
        }
      }
    },
    showInstancesNew: function(e){
      // fire event only if clicked on td
      if (e.target.localName == 'td'){
        e.preventDefault();
        var view = this;
        var data = e.currentTarget.dataset;
        if (data.id){
          var ilv = new InstanceListView({ date: this.options.date, workflowid: data.id });
        }
      }
    },
    loadNextPage: function(e){
    }
  });
  return ListView;
});
