//TODO: replace the hint on apply not on activate

define(function (require) { 
  var Tpl   = require('tpl!templates/common/autocomplete.html'),
      $     = require('jquery'),
      Qorus = require('qorus/qorus'),
      _     = require('underscore'),
      View, Match, Matches;
    
  require('libs/jquery.caret');
  
  var indexOfRight = function (col, ind) {
    var length = col.length;
    var pos = col.reverse().join('').search(ind);
    return (pos === -1) ? pos : length - pos;
  };

  Match = Qorus.View.extend({
    additionalEvents: {
      "click a": "applyMatch"
    },
    tagName: 'li',
    template: _.template('<a href=\"#\"><strong><%= model.hint %></strong><br /><small><%= model.help %></small></a>'),
    applyMatch: function () {
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
          self.setActiveMatch(model);
        });
        
        frag.appendChild(v.el);
      }, this);
      
      this.el.appendChild(frag);
      return this;
    },
    show: function () {
      if (this.matches.length > 0) this.$el.show();
    },
    hide: function () {
      this.$el.hide();
    },
    setActive: function (next) {
      var matches = this.getView('.matches'),
          current = _.at(matches, this.active_match)[0];
      
      if (current) current.trigger('deactivate');
      if (next) {
        this.active_match++;        
      } else {
        this.active_match--;
      }
      
      return this.applyMatch();
    },
    setActiveMatch: function (model) {
      this.active_match = this.matches.indexOf(model);
    },
    next: function () {
      return this.setActive(true);
    },
    prev: function () {
      return this.setActive();
    },
    applyMatch: function () {
      var active; 
      
      active = this.getActiveMatch();
      active.trigger('activate');
      this.trigger('activate', active.model);
      
      return active;
    },
    getActiveMatch: function () {
      var matches = this.getView('.matches'),
          active;
      
      if (!matches) return null;
      
      if (this.active_match < 0) this.active_match = matches.length - 1;
      if (this.active_match >= matches.length) this.active_match = 0;
      
      return _.at(matches, this.active_match)[0];
    }
  });
  
  View = Qorus.View.extend({
    token: 'value',
    additionalEvents: {
      'keyup input.autocomplete': 'showSuggestions',
      'keydown input.autocomplete': 'preventDefault',
      'click .dropdown a': 'applyActiveHint'
//      'blur input.autocomplete': 'hideDropdown'
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
      this.activehint = null;
      var dd = this.insertView(new Matches(), '.dropdown');
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
    split: function () {
      return /\s/;
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
      var pos = this.getCaretPosition();
      var q = $target.val();
      var rpos = q.slice(0, pos).split('').reverse().join('').search(this.split());
      
      this.query = $target.val().slice(0, pos);
      
      if (rpos > 0) this.query = this.query.slice(rpos*-1);
//      console.log('q:', this.query, $target.val(), rpos, pos);
      return this;
    },
    showSuggestions: function (e) {
      var dd = this.getDropdown();
      // up and down arrow codes 38, 40
      // tab 9
      this.caret_pos = this.$clone.caret();
      
      if (/(37)|(39)|(38)|(40)|(13)/.test(e.keyCode)) {
        if (e.keyCode == 40) {
          dd.next();
        } else if (e.keyCode == 38) {
          dd.prev();
        } else if (e.keyCode == 13){
          if (this.getDropdown().getActiveMatch()) {
            this.applyActiveHint();
          } else {
            this.$el.parents('form').submit();
          }
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
      // var query = this.query.match(/(?=[^\s]*$)(.*)/)[1];
      var query = this.query;
      return ~item.toLowerCase().indexOf(query);
    },
    highlight: function () {
//      this.$clone.focus();
      var model = this.getDropdown().getActiveMatch().model,
          caret = this.getCaretPosition(),
          query = this.$clone.val(),
          left  = query.slice(caret).search(/\(/) + caret + 1,
          right = query.slice(caret).search(/\)/) + caret;
    
      this.setSelection(left, right);
    },
    hideDropdown: function (now) {
      // delay the hide of dropdown to allow click event execution
      _.delay(function($dd) { $dd.hide(); }, 50, this.$('.dropdown-menu'));
    },
    getCaretPosition: function () {
      return this.caret_pos;
    },
    applyActiveHint: function () {
      var $el   = this.$('.autocomplete'),
          rpos  = this.getCaretPosition(),
          lpos  = indexOfRight($el.val().slice(0, rpos).split(''), this.split()),
          model = this.getDropdown().getActiveMatch().model;
      
      lpos = (lpos > 0) ? lpos : 0;      
      
      $el.val(function (i, val) {
        var p1 = val.substr(0, lpos);
        var p2 = val.substr(rpos, val.length);
        return p1 + model.hint + ' ' + p2;
      });

      this.hideDropdown();
      this.highlight();
    },
    preventDefault: function (e) {
      if (/(38)|(40)/.test(e.keyCode)) {
        e.preventDefault();
      }
    },
    setSelection: function(startPos, endPos) {
        var input = this.$clone.get(0);
        input.focus();
        if (typeof input.selectionStart != "undefined") {
            input.selectionStart = startPos;
            input.selectionEnd = endPos;
        } else if (document.selection && document.selection.createRange) {
            // IE branch
            input.select();
            var range = document.selection.createRange();
            range.collapse(true);
            range.moveEnd("character", endPos);
            range.moveStart("character", startPos);
            range.select();
        }
    }
  });
  
  return View;
});