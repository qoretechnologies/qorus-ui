define(function (require) {
  require('sprintf');
  
  var _             = require('underscore'),
      $             = require('jquery'),
      React         = require('react'),
      utils         = require('utils'),
      slugify       = require('qorus/helpers').slugify,
      ModalView     = require('jsx!views.react/components/modal'),
      Svg           = require('jsx!views.react/components/svg'),
      CodeView      = require('jsx!views.react/components/code'),
      LoaderView    = require('jsx!views.react/components/loader'),
      TabsView      = require('jsx!views.react/components/tabs').TabsView,
      TabPane       = require('jsx!views.react/components/tabs').TabPane,
      MetaTableView = require('jsx!views.react/components/metatable'),
      Step          = require('models/step'),
      Diagram, ContentView, FunctionView;

  FunctionView = React.createClass({
    render: function () {
      var meta = _.omit(this.props.func, ['body']);
    
      return (
        <div className="step-function">
          <TabsView className="nav nav-pills">
            <TabPane name="Code">
              <div className="step-source">
                <MetaTableView data={ _.pick(meta, ['version', 'description', 'source'])} />
                <CodeView code={ this.props.func.body } />
              </div>
            </TabPane>
            <TabPane name="Meta">
              <MetaTableView data={ meta } />
            </TabPane>
          </TabsView>
        </div>
      );
    }
  });

  ContentView = React.createBackboneClass({
    render: function () {
      var model     = this.props.model, 
          body      = <LoaderView />, 
          tabs      = [],
          functions = model.get('functions'),
          step      = _.omit(model.toJSON(), 'functions');

      if (functions) {
        _.each(functions, function (f) {
          tabs.push(
            <TabPane name={ f.type }>
              <FunctionView func={f} />
            </TabPane>
          );
        });
        
        tabs.push(
          <TabPane name="Info">
            <MetaTableView data={ step } />
          </TabPane>
        );
        
        body = <TabsView model={ this.model }>{ tabs }</TabsView>;
      }

      return (
        <div className="modal-body">
        { body }
        </div>
      );
    }
  });

  Diagram = React.createClass({
    onClick: function (e, step) {
      // this.refs.modal.setState({ step: step, hide: false });
      this.showModal(step);
    },
  
    createDiagram: function () {
      var self    = this,
          levels  = this.props.model.mapSteps(),
          text_width = _.max(_.flatten(levels, true), function (obj) { return _.size(obj.fullname); }).fullname.length,
          bw      = Math.max(100, text_width*8),
          bh      = Math.ceil(bw/4),
          pad     = 10,
          lh      = _.size(levels),
          lw      = Math.max(3, _.max(_.map(levels, function (l) { return _.size(l); }))),
          sw      = Math.max(lw*(2*pad+bw)),
          sh      = lh*(2*pad+bh)
          ;
      
      var boxes = {};
      
      var s_groups = [];
      var s_masks  = [];
      var s_paths  = [];
      
      _.each(levels, function (level, idx) {
        var i = idx;
        
        _.each(level, function (step, idx) {
          var w = _.size(level);
          var box_w = sw / w;
          var ii = idx + 1;
          var p = w + 1;
          var cx = (box_w*ii - box_w/2) - (bw/2);
          var cy = (bh+2*pad) * i;
          var slug = slugify(step.name);
          var el, params, mask_el;
          
          
          if (step.type == 'start') {
            params = {
              cx: cx+bw/2,
              cy: cy+bh/2,
              rx: bw/2,
              ry: bh/2,
              className: "box " + step.type
            };
            
            el = <Svg.Ellipse  {...params} key={ 'b-' + slug } />;
            mask_el = <Svg.Ellipse {..._.extend({}, params, { fill: '#fff', className: undefined })} key={ 'bm-' + slug }/>;
          } else {
            params = {
              x: cx,
              y: cy,
              rx: 5,
              ry: 5,
              className: "box " + step.type,
              width: bw,
              height: bh
            };
            
            el = <Svg.Rect {...params} key={ 'b-' + slug }/>;
            mask_el = <Svg.Rect {..._.extend({}, params, { fill: '#fff', className: undefined })} key={ 'bm-' + slug } />;
          }
       

          var mask = <Svg.Mask id={slugify(step.name)} elements={[mask_el]} key={ 'mask-' + slug }/>;
          var text = <Svg.Text text={ step.fullname } x={ cx+bw/2 } y={ cy+bh/2 } style={ { mask: "url('#" + slugify(step.name) +"')" }} key={ 't-' + slug } />;
          
          s_groups.push(<Svg.Group elements={[el, text]} onClick={ self.onClick } step={ step } key={ 'g-' + slug } />);
          s_masks.push(mask);
          
          var id = step.id.toString();
          
          boxes[id] = { 
            cx: cx+bw/2,
            cy: cy+bh/2,
            links: step.links_to
          };
        });
      });
      
      _.each(boxes, function (box) {
        _.each(box.links, function (link) {
          var bl = boxes[link];
          var v = box.cy - bh/2 - pad;
          var path = sprintf("M%d,%d L%d,%d L%d,%d L%d,%d", box.cx, box.cy, box.cx, v, bl.cx, v, bl.cx, bl.cy);

          s_paths.push(<Svg.Path d={path} stroke="#000" fill="none" key={   slugify(path) } />);
        });
      });
      
      return {
        attributes: { 'viewBox': [0,0,sw,sh].join(' ')},
        boxes: s_groups,
        paths: s_paths,
        masks: s_masks
      };
    },
  
    render: function () {
      var dia = this.createDiagram();
    
      return (
        <div>
          <svg version="1.1" id="workflow-diagram" className="diagram" xmlns="http://www.w3.org/2000/svg" {...dia.attributes}>
            <defs>
              { dia.masks }
            </defs>
            { dia.paths }
            { dia.boxes }
          </svg>
        </div>
      );
    },
    
    showModal: function (step) {
      var model = new Step({ stepid: step.id }).fetch();
      var modal = <ModalView title={ step.name }><ContentView model={ model } /></ModalView>;
      var el = $('<div class="modal-container" />').appendTo('body');
      React.render(modal, el[0]);
    }
  
  });
  
  return Diagram;
});