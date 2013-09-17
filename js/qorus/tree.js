define([
  'module',
  'underscore'
], function (self, _) {
  var TreeNodeBase = {
      initialize: function (id, opts) {
          this.id = id;
          this.opts = opts || {};
          this.children = [];
          this.parent_id = null;
      },
  
      size: function () {
         return this.children.length;  
      },
  
      hasChildren: function () {
          return this.size() > 0;
      },
  
      addChild: function (child) {
          child.parent_id = this.id;
          this.children.push(child);
      },
    
      get: function (opt) {
        if (opt in this.opts) {
          return this.opts[opt];
        }
        return undefined;
      },
      
      flatten: function (path, el_list, level) {
        el_list = el_list || [];
        level = level || 0;
        
        if (path !== undefined) {
          path = [path.toString(), this.id].join('-');
        } else {
          path = this.parent_id || 0;
        }
        console.log(path, this.id);
                
        if (level !== 0) {
          el_list.push({ 
            level: level, 
            el: this,
            path: path
          });
        }
        
        _.each(this.children, function (c) {
          c.flatten(path, el_list, level+1);
        });
          
        return el_list;
      }
    },  
    TreeNode = function (id) {
        this.initialize.apply(this, arguments);
    };

  _.extend(TreeNode.prototype, TreeNodeBase);


  // create tree from dataset with parent_id defined by attr
  function createTree(data, attr) {
    var tree = {};
    var root = new TreeNode(0);
    tree[0] = root;

    _.each(data, function (el, idx) {
        var node = new TreeNode(idx, el);
        tree[idx] = node;
    });

    _.each(tree, function (el) {
        var parent_id = el.get(attr);
        parent_id = (parent_id===null) ? 0 : parent_id;
  
        if (parent_id !== undefined) {
            tree[parent_id].addChild(el);
        }
    });
    
    return tree[0];
  }
  
  return {
    Node: TreeNode,
    createTree: createTree
  }
});