define(function (require) {
  var _        = require('underscore'),
      Qorus    = require('qorus/qorus'),
      settings = require('settings'),
      Model;

  Model = Qorus.Model.extend({
    idAttribute: "username",
    urlRoot: settings.REST_API_PREFIX + '/users/',

    /**
     * Checks user permissions
     * @param {string|Array} permission - Permission or list of permission to Checks
     * @returns {Bool}
     */
    hasPermissions: function (perm) {
      if (typeof perm === 'string' && this.get('permissions'))
        return this.get('permissions').indexOf(perm) > -1;

      if(_.isArray(perm) && this.get('permissions'))
        return _.intersection(this.get('permissions'), perm).length > 0;

      return false;
    },

    /**
     * Returns list of actions available for user editation
     * @returns {Array.<Object>}
     */
    getControls: function () {
      var controls = [];

      controls.push({ action: 'edit', icon: 'edit', title: 'Edit', css: 'warning' });
      controls.push({ action: 'delete', icon: 'remove', title: 'Remove', css: 'danger' });

      return controls;
    },

    /**
     * Performs action with the user
     * @param {Object} options
     * @param {string} options.action
     * @returns {Object} this
     */
    doAction: function (opts) {
      if (opts.action === "delete") this.destroy();
      return this;
    },

    /**
     * Custome override of isNew function returns true if User is not synced with server
     * @returns {Bool}
     */
    isNew: function () {
      if (this.is_new)
        return true;

      return Model.__super__.isNew.apply(this, arguments);
    },

    /**
     * Gets UI user preferences from User.storage[com.qoretech.ui]
     * @returns {Object}
     */
    getPreferences: function () {
      var store = this.get('storage')['com.qoretech.ui'];

      return store;
    },

    /**
     * Saves UI user preferences into User.storage[com.qoretech.ui]
     * @param {String} key
     * @param {*} value
     */
    setPreferences: function (key, value) {
      var store = this.getPreferences() || {};
      var pref = this.get('storage');

      store[key] = value;

      pref['com.qoretech.ui'] = store;
      this.save();
    }
  });

  return Model;
});
