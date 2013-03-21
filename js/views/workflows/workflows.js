define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'collections/workflows',
  'text!/templates/workflow/list.html',
  'datepicker',
  'moment',
  'views/workflows/instances',
  'jquery.fixedheader',
  'jquery.sticky',
], function($, _, Backbone, Qorus, Collection, Template, date, moment, InstanceListView){
  var ListView = Qorus.ListView.extend({
    // el: $("#content"),
    additionalEvents: {
		    'click .action': 'runAction',
        'click tbody tr': 'showInstances'
    },
    subviews: {},
    initialize: function(collection, date, router){
      this.router = router;
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection, date);
      _.bindAll(this, 'datePicker');
    },
    // 
    off: function(){
      // removes date picker from DOM
      this.dp.remove();
      ListView.__super__.off.call(this);
    },
    // render after attaching to DOM
    afterRender: function(start){
      console.log((new Date() - start)/1000);
      $('.sticky').sticky();
      console.log((new Date() - start)/1000);
      $('.table-fixed').fixedHeader({ topOffset: 80 });
      console.log((new Date() - start)/1000);
      this.datePicker();
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
    // filter by date init
    datePicker: function(){
        var view = this;
        this.dp = $('.dp').datetimepicker({
            format: 'yyyy-MM-dd hh:mm:ss',
        });
        this.on('changeDate', function(e){
            view.onDateChanged(e.date.toISOString(), {});
        });
    },
    onDateChanged: function(date) {
        Backbone.history.navigate('/workflows/' + moment(date).utc()
            .format('YYYY-MM-DD HH:mm:ss'), {trigger: true});
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
    }
  });
  return ListView;
});
