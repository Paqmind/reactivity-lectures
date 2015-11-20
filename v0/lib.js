// https://gist.github.com/jlongster/11192270

import _ from "lodash";

var Bloop = {};

var mountId = 0;
function newMountId() {
  return mountId++;
}

Bloop.createClass = function(proto) {
  function _component(props, children) {
    if(this.constructor !== _component) {
      return new _component(props, children);
    }

    var args = _.toArray(arguments);
    if(!(_.isPlainObject(props) && !props._type)) {
      children = props;
      props = null;
      args.unshift(null);
    }

    if(!Array.isArray(children)) {
      children = args.slice(1);
    }

    _.keys(proto).forEach(function(k) {
      var val = proto[k];
      if(_.isFunction(val)) {
        val = val.bind(this);
      }
      this[k] = val;
    }, this);

    this.props = props;
    this.state = this.getInitialState ? this.getInitialState() : null;

    if(props && props.state) {
      _.keys(this.state).forEach(function(k) {
        props.state[k] = this.state[k];
      }, this);
      this.state = props.state;
      delete props.state;
    }

    this.children = children;
    this._type = "custom";

    if(this.init) {
      this.init();
    }
  }

  _component.prototype = Object.create(Bloop.createClass.prototype);
  _component.prototype.constructor = _component;

  return _component;
};

Bloop.renderComponent = function(comp, node) {
  var virtualDOM = comp.render();
  var changed = false;

  if(!comp.mountId) {
    comp.mountId = 'rerender-' + newMountId();
    var mount = document.createElement('div');
    mount.id = comp.mountId;
    mount._virtualDOM = virtualDOM;
    mount.appendChild(renderVirtualDOM(virtualDOM));
    node.appendChild(mount);

    if(comp.componentDidRender) {
      comp.componentDidRender();
    }
  }
  else {
    var mount = document.querySelector('#' + comp.mountId);
    var prevDOM = mount._virtualDOM;

    if(serializeVirtualDOM(virtualDOM) !== serializeVirtualDOM(prevDOM)) {
      var dom = renderVirtualDOM(virtualDOM);

      changed = true;
      mount.innerHTML = '';
      mount.appendChild(dom);
      mount._virtualDOM = virtualDOM;

      if(comp.componentDidRender) {
        comp.componentDidRender();
      }
    }
  }

  return changed;
};

Bloop.renderComponentToString = function(comp) {
  return renderVirtualDOMToString(comp.render());
};

function serializeVirtualDOM(dom) {
  var str = dom._type;
  if(dom.props) {
    _.keys(dom.props).forEach(function(k) {
      var prop = dom.props[k];
      if(_.isFunction(prop)) {
        str += k + 'function';
      }
      else if(k === 'style') {
        str += _.values(dom.props[k]).toString();
      }
      else if(dom.props[k]) {
        str += k + dom.props[k].toString();
      }
    });
  }
  if(dom.children) {
    dom.children.forEach(function(child) {
      if(child) {
        str += child._type ? serializeVirtualDOM(child) : child;
      }
    });
  }
  return str;
}

function renderVirtualDOM(comp) {
  if(comp && comp._type) {
    // render native thing
    var node = document.createElement(comp._type);
    var props = comp.props;
    var children = comp.children;

    if(props) {
      for(var k in props) {
        if(props.hasOwnProperty(k)) {
          if(k.indexOf('on') === 0) {
            node.addEventListener(k.substring(2).toLowerCase(), props[k]);
          }
          else if(k === 'style') {
            var styles = props[k];
            _.keys(styles).forEach(function(k) {
              node.style[k] = styles[k];
            });
          }
          else {
            node[k] = props[k];
          }
        }
      }
    }

    children.forEach(function(child) {
      if(child != null) {
        node.appendChild(renderVirtualDOM(child));
      }
    });

    return node;
  }
  else {
    return document.createTextNode(comp);
  }
}

function renderVirtualDOMToString(comp) {
  if(comp && comp._type) {
    var node = '<' + comp._type;
    var props = comp.props;
    var children = comp.children;

    if(props) {
      for(var k in props) {
        if(props.hasOwnProperty(k)) {
          if(k.indexOf('on') !== 0 && k !== 'style') {
            var val = props[k];
            if(k === 'className') {
              k = 'class';
            }
            else {
              k = k.replace(/[A-Z]/g, function(s) { return '-' + s.toLowerCase(); });
            }

            node += ' ' + k + '="' + val + '"';
          }
        }
      }
    }

    node += '>';

    children.forEach(function(child) {
      if(child != null) {
        node += renderVirtualDOMToString(child);
      }
    });

    node += '</' + comp._type + '>';
    return node;
  }
  else {
    return comp;
  }
}

function DOMCreator(type) {
  return function(props, children) {
    var args = _.toArray(arguments);
    if(!(_.isPlainObject(props) && !props._type)) {
      children = props;
      props = null;
      args.unshift(null);
    }

    if(!Array.isArray(children)) {
      children = args.slice(1);
    }

    return {
      _type: type,
      props: props,
      children: children.map(function(child) {
        if(child instanceof Bloop.createClass) {
          return child.render();
        }
        return child;
      })
    };
  };
}

Bloop.dom = {
  div: DOMCreator('div'),
  span: DOMCreator('span'),
  a: DOMCreator('a'),
  p: DOMCreator('p'),
  em: DOMCreator('em'),
  img: DOMCreator('img'),
  form: DOMCreator('form'),
  button: DOMCreator('button'),
  ul: DOMCreator('ul'),
  li: DOMCreator('li'),
  header: DOMCreator('header'),
  h1: DOMCreator('h1'),
  h2: DOMCreator('h2'),
  h3: DOMCreator('h3'),
  h4: DOMCreator('h4'),
  input: DOMCreator('input'),
  textarea: DOMCreator('textarea')
};

export default Bloop;
