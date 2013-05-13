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
      var w = $(document).width() - $('[data-sort="version"]').offset().left;
      $('#service-detail').outerWidth(w);
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
      var _this = this;
      var $target = $(e.currentTarget);
      var $detail = $('#service-detail');
      var top = $target.offset().top; // + $target.height()/2;
      
      if ($target.data('id')) {
        e.stopPropagation();
        
        // remove info class on each row
        $('tr', $target.parent()).removeClass('info');
        
        if ($detail.data('id') == $target.data('id')) {
           $("#service-detail").removeClass('show'); 
           $detail.data('id', null);
        } else {
          // add info class to selected row
          $target.addClass('info');

          // set current row id
          $detail.data('id', $target.data('id'));
          
          // init detail view
          var detail = new ServiceView({ id: $target.data('id') });
          
          if (detail != this.subviews.detail) {
            if (this.subviews.detail){
             this.subviews.detail.undelegateEvents();
            }
            
            this.subviews.detail = detail;
            this.subviews.detail.model.on('sync', function () {
              _this.assign('#service-detail', _this.subviews.detail);
              $('#service-detail').addClass('show');
            });
          }
          
        }
      }
      
    },
    
    
  });

  return ListView;
});
