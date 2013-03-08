define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'collections/workflows',
  'text!/templates/workflow/list.html',
  'datepicker',
  'moment',
  'jquery.fixedheader',
  'jquery.sticky',
], function($, _, Backbone, Qorus, Collection, Template, date, moment){
  var ListView = Qorus.ListView.extend({
    el: $("#content"),
    additionalEvents: {
		    'click .action': 'runAction',
    },
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
    }
  });
  return ListView;
});
