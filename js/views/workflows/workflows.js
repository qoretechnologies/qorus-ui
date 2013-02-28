define([
  'jquery',
  'underscore',
  'backbone',
  'qorus/qorus',
  'collections/workflows',
  'text!/templates/workflow/list.html',
  'datepicker',
  'moment'
], function($, _, Backbone, Qorus, Collection, Template, date, moment){
  var ListView = Qorus.ListView.extend({
    el: $("#content"),
    additionalEvents: {
		    'click .start': 'start',
    },
    initialize: function(collection, date){
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection, date);
      
      this.on('render', this.datePicker);
      // this.on('render', function(){
      //     $('th').hover(
      //         function(){ 
      //             $(this).tooltip('show'); 
      //         }, 
      //         function(){ 
      //             $(this).tooltip('hide');
      //         }
      //     )
      // });
    },
	// starts workflow
	start : function(e){
		e.preventDefault();
		var workflowid = e.currentTarget.dataset.id;
		var wfl = this.collection.get(workflowid);
		wfl.start({
			success: function(el, xhr){
				console.log(xhr)
				$('#alert-info').children('.alert-heading').html('Workflow: '+el.get('name') + ' started');
				$('#alert-info').alert().addClass('in');
				window.setTimeout(function(){
					$('#alert-info').removeClass('in');	
				}, 2000);
			}
		});
	},
	// stops workflow
	stop : function(e){
		e.preventDefault();
		var workflowid = e.currentTarget.dataset.id;
		var wfl = this.collection.get(workflowid);
		wfl.stop();
	},
	// reset workflow
	reset : function(e){
		e.preventDefault();
		var workflowid = e.currentTarget.dataset.id;
		var wfl = this.collection.get(workflowid);
		wfl.reset();
	},
    // filter by date init
    datePicker: function(){
        var view = this;
        $('#dp').datetimepicker({
            format: 'dd-MM-yyyy hh:mm:ss',
        })
        .on('changeDate', function(e){
            view.trigger('dateChanged', e.date.toISOString(), {});
        });
    },
  });
  // Returning instantiated views can be quite useful for having "state"
  return ListView;
});
