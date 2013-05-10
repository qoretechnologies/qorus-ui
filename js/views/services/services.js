define([
  'jquery',
  'underscore',
  'qorus/qorus',
  'collections/services',
  'text!../../../templates/service/list.html',
  'views/services/service',
  'sprintf'
], function($, _, Qorus, Collection, Template, ServiceView){
  var ListView = Qorus.ListView.extend({
    additionalEvents: {
      "click button[data-option]": "setOption",
      "click tr": "showDetail"
    },

    initialize: function () {
      this.template = Template;
      ListView.__super__.initialize.call(this, Collection);
    },

    onRender: function () {
      $('[data-toggle="tooltip"]').tooltip();
    },

    setOption: function (e) {
      var data = $(e.currentTarget).data();
      var svc = this.collection.get(data.id);
      var opts = {};
      opts[data.option] = data.value;
      $.put(svc.url(), opts, null, 'application/json')
      .done(
        function(res){
          console.log(res);
        }
      );
      this.collection.fetch();
    },
    
    showDetail: function (e) {
      var $target = $(e.currentTarget);
      var $detail = $('#service-detail');
      
      if ($target.data('id')) {
        e.stopPropagation();
        
        if ($detail.data('id') == $target.data('id')) {
           $("#service-detail").removeClass('show'); 
        } else {
          $detail.attr('data-id', $target.data('id'));
          var detail = new ServiceView({ id: $target.data('id') });
          
          if (detail != this.subviews.detail) {
            if (this.subviews.detail){
             this.subviews.detail.clean(); 
            }
            
            this.subviews.detail = detail;

            this.assign('#service-detail', this.subviews.detail);
        
            this.subviews.detail.on('render', function () {
              $("#service-detail").addClass('show');
            });
          }
          
        }
      }
      
    },
    
    
  });

  return ListView;
});
