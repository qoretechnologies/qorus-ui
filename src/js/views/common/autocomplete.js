define(function (require) {  
  var Tpl   = require('tpl!templates/common/autocomplete.html'),
      $     = require('jquery'),
      Qorus = require('qorus/qorus'),
      View, Match;
    
  require('libs/jquery.caret');
  
  Match = Qorus.View.extend({
    
  });
  
  View = Qorus.View.extend({
    token: 'value',
    additionalEvents: {
      'keyup input.autocomplete': 'showSuggestions',
      'blur input.autocomplete': 'hideDropdown'
    },
    className: "autocomplete-box",
    template: Tpl,
    initialize: function (opts) {
      View.__super__.initialize.apply(this, arguments);
      this.$input = $(opts.input);
      this.$clone = this.$input.clone().addClass('autocomplete');
      this.dataset = opts.dataset;
    },
    onRender: function () {
      this.$el.prepend(this.$clone);
      this.$input.replaceWith(this.$el);
      
      var $el = this.$('.autocomplete'),
          pos = $el.position();

      this.$('.autocomplete-hint')
        .css('top', pos.top)
        .css('left', pos.left)
        .width($el.width());
    },
    getMatches: function () {
      var ds      = this.dataset,
          matches = [];
      
      _.each(ds, function (d) {
        if (this.match(d[this.token])) matches.push(d);
      }, this);
      
      return matches;
    },
    updateQuery: function (e) {
      var $target = $(e.currentTarget);
      this.query = $target.val();
      return this;
    },
    showSuggestions: function (e) {
      var matches;
      this.updateQuery(e);
      matches = this.getMatches();

      this.$('.dropdown-menu').empty();
      _.each(matches, function (match) {
        this.$('.dropdown-menu').append("<li><a href=\"#\">"+match.value+"()<br /><small>"+match.help+"</small></a></li>");
      }, this);
      
      this.$('.dropdown-menu').show();
    },
    match: function (item) {
      var query = this.query.match(/(?=[^\s]*$)(.*)/)[1];
      return ~item.toLowerCase().indexOf(query);
    },
    hideDropdown: function () {
      this.$('.dropdown-menu').hide();
    }
  });
  
  return View;
});
