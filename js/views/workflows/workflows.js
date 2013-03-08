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
        'click .unfold': 'showInstances'
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
        if(!view.subviews[data.id]){
          var ilv = new InstanceListView({ date: view.date, workflowid: data.id })
          view.subviews[data.id] = ilv;
          var sv = view.subviews[data.id];
          var el = $('<tr class="instances" />');
          el.append('<td colspan="18" />');
          $(e.currentTarget).parents('.workflow-row').after(el);
          sv.setElement($(el).children('td'));
        } else {
          $(e.currentTarget).parents('.workflow-row').next().remove();
          delete view.subviews[data.id]
        }
      }
    }
  });
  return ListView;
});
