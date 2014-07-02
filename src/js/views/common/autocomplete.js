define(function (require) {  
  var Tpl   = require('tpl!templates/common/autocomplete.html'),
      $     = require('jquery'),
      Qorus = require('qorus/qorus'),
      View, Match, Matches;
    
  require('libs/jquery.caret');
  
  Match = Qorus.View.extend({
    additionalEvents: {
      "click a": "applyMatch"
    },
    tagName: 'li',
    template: _.template('<a href=\"#\"><strong><%= model.hint %></strong><br /><small><%= model.help %></small></a>'),
    applyMatch: function (e) {
      this.trigger('apply', this.model);
    },
    initialize: function () {
      Match.__super__.initialize.apply(this, arguments);
      this.on('activate deactivate', this.active);
    },
    active: function () {
      this.$el.toggleClass('active');
    }
  });
  
  Matches = Qorus.View.extend({
    tagName: 'ul',
    className: 'dropdown-menu',
    addMatches: function (matches) {
      this.removeViews();
      var frag = document.createDocumentFragment();
      this.matches = matches;
      this.active_match = -1;
      
      _.each(matches, function (match) {
        var v    = this.insertView(new Match({ model: match }), '.matches').render(),
            self = this;
              
        this.listenTo(v, 'apply', function (model) {
          self.trigger('activate', model);
        });

        frag.appendChild(v.el);
      }, this);
      
      this.el.appendChild(frag);
      return this;
    },
    show: function () {
      if (this.matches.length > 0) this.$el.show();
    },
    setActive: function (next) {
      var matches = this.getView('.matches'),
          current = _.at(matches, this.active_match)[0],
          active;
      
      if (current) current.trigger('deactivate');
      if (next) {
        this.active_match++;        
      } else {
        this.active_match--;
      }
      
      if (this.active_match < 0) this.active_match = matches.length - 1;
      if (this.active_match >= matches.length) this.active_match = 0;
      
      active = _.at(matches, this.active_match)[0];
      active.trigger('activate');
      this.trigger('activate', active.model);
      return active;
    },
    next: function () {
      return this.setActive(true);
    },
    prev: function () {
      return this.setActive();
    }
  });
  
  View = Qorus.View.extend({
    token: 'value',
    additionalEvents: {
      'keyup input.autocomplete': 'showSuggestions',
      'keydown input.autocomplete': 'preventDefault',
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
    preRender: function () {
      var dd = this.insertView(new Matches(), '.dropdown');
      this.listenTo(dd, 'activate', this.applyActiveHint);
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
      var dd = this.getDropdown();
      // up and down arrow codes 38, 40
      // tab 9
      if (/(37)|(39)|(38)|(40)|(9)/.test(e.keyCode)) {
        e.preventDefault();

        if (e.keyCode == 40) {
          dd.next();
        } else if (e.keyCode == 38) {
          dd.prev();
          this.$('.autocomplete').caret(-1);
        } else if (e.keyCode == 9){
          dd.applyHint();
        }
      } else {
        var matches;
        this.updateQuery(e);
        matches = this.getMatches();

        dd.addMatches(matches).show();
      }
    },
    getDropdown: function () {
      return this.getView('.dropdown')[0];
    },
    match: function (item) {
      var query = this.query.match(/(?=[^\s]*$)(.*)/)[1];
      return ~item.toLowerCase().indexOf(query);
    },
    highlight: function (item) {},
    hideDropdown: function (now) {
      // delay the hide of dropdown to allow click event execution
      _.delay(function($dd) { $dd.hide(); }, 50, this.$('.dropdown-menu'));
    },
    getCaretPosition: function () {
      return this.$clone.caret();
    },
    applyActiveHint: function (model) {
      this.$('.autocomplete').val(model.hint).caret(-1);
      this.hideDropdown();
    },
    preventDefault: function (e) {
      if (/(38)|(40)/.test(e.keyCode)) {
        e.preventDefault();
      }
    }
  });
  
  return View;
});
