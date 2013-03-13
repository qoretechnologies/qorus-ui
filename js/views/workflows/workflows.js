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
    el: $("#content"),
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
      _.bindAll(this, 'addBadges');
      
      this.on('render', function() {
        this.datePicker();
      });
      this.on('render', function() {
        this.addBadges();
      });
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
        $('.dp').datetimepicker({
            format: 'yyyy-MM-dd hh:mm:ss',
        })
        .on('changeDate', function(e){
            view.onDateChanged(e.date.toISOString(), {});
        });
    },
    onDateChanged: function(date) {
        this.router.navigate('/workflows/' + moment(date).utc()
            .format('YYYY-MM-DD HH:mm:ss'), {trigger: true});
    },
    addBadges: function(){
      $(this.el).find('td[data-badge]').each(function() {
        if ($(this).text() !== '0'){
          $(this).wrapInner('<span class="badge '+$(this).data('badge')+'" />' );
        }
      });
      $('.table-fixed').fixedHeader({ topOffset: 80 });
      $('.sticky').sticky();
    },
    showInstances: function(e){
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
          ilv.setElement(el);
          ilv.collection.on('reset', function() { ilv.$el.slideDown('slow'); });
          view.subviews[data.id] = ilv;
          $(e.currentTarget).addClass('info');
          var sv = view.subviews[data.id];
        } else {
          var ilv = view.subviews[data.id];
          
          // toggle show
          if(parent.data('view') != ilv.cid ){
            ilv.render();
            el.parents('.bottom-bar').show();
            $(e.currentTarget).addClass('info');
          } else {
            el.parents('.bottom-bar').hide();
            ilv.$el.html('');
            // TODO: replace later with events updates
            delete view.subviews[data.id];                      
          }
        }
      }
    }
  });
  return ListView;
});
