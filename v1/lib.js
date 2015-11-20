import {clone, forEach, keys, map, reduce, slice, values} from "ramda";
import {isPlainObject} from "../common/helpers";

/* NOTES
  1. Component serves also as VirtualDOM node. Not the case in React
  2. State solution is not builtin. Keep state in root component.
  3. No difference between Tags and Components (node tree is fractal). Not the case in React and original Bloop.
*/

class Component {
  // (Object -> Array) -> Component
  constructor(props={}, children=[]) {
    this.props = props;
    this.children = children;
    this.tag = "div";
  }

  // void -> Component
  render() {
    class Tag extends Component {
      constructor(props={}, children=[]) {
        super(props, children);
        this.tag = "div";
      }
    }

    return new this.constructor(this.props, map(child => child.render ? child.render() : child, this.children));
  }
}

function makeTag(tag) {
  class Tag extends Component {
    constructor(props={}, children=[]) {
      super(props, children);
      this.tag = tag;
    }
  }
  return Tag;
}

let tags = {
  div: makeTag("div"),
  span: makeTag("span"),
  a: makeTag("a"),
  p: makeTag("p"),
  em: makeTag("em"),
  strong: makeTag("strong"),
  hr: makeTag("hr"),
  br: makeTag("br"),
  img: makeTag("img"),
  h1: makeTag("h1"),
  h2: makeTag("h2"),
  h3: makeTag("h3"),
  h4: makeTag("h4"),
  ul: makeTag("ul"),
  li: makeTag("li"),
  form: makeTag("form"),
  button: makeTag("button"),
  input: makeTag("input"),
  textarea: makeTag("textarea"),
};

let mountId = 0;

function newMountId() {
  return mountId++;
}

function renderVirtualDOM(component) {
  if (component && component.tag) {
    let node = document.createElement(component.tag);

    forEach(key => {
      if (key.startsWith("on")) {
        node.addEventListener(slice(2, key.length, key).toLowerCase(), component.props[key]);
      }
      else {
        node[key] = clone(component.props[key]);
      }
    }, keys(component.props));

    forEach(child => {
      node.appendChild(renderVirtualDOM(child));
    }, component.children);

    return node;
  }
  else {
    return document.createTextNode(component);
  }
}

function doInsertVirtualDOM(component, node, virtualDOM) {
  let renderId = "render-" + newMountId();
  let dom = renderVirtualDOM(virtualDOM);
  component.renderId = renderId;
  dom.id = renderId;
  dom._virtualDOM = virtualDOM;
  node.innerHTML = "";
  node.appendChild(dom);
}

function renderComponent(component, node) {
  let virtualDOM = component.render ? component.render() : null;

  if (!component.renderId) {
    doInsertVirtualDOM(component, node, virtualDOM);
  }
  else {
    let mountedNode = document.getElementById(component.renderId);
    if (JSON.stringify(virtualDOM) != JSON.stringify(mountedNode._virtualDOM)) {
      doInsertVirtualDOM(component, node, virtualDOM);
    }
  }
  return virtualDOM;
}

export default {
  Component, tags, renderVirtualDOM, renderComponent,
};
