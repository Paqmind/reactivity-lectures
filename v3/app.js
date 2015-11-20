import h from "virtual-dom/h";
import diff from "virtual-dom/diff";
import patch from "virtual-dom/patch";
import createElement from "virtual-dom/create-element";
import hh from "hyperscript-helpers";
import Baobab from "baobab";

let {div, span, button} = hh(h);

// RENDERS =========================================================================================
function renderBox(props) {
  return div(props, [
    span({}, [props.value]),
    button({onclick: props.onClick}, [props.caption]),
  ]);
}

function renderApp(state) {
  return div({}, [
    renderBox({value: state.box1, caption: "+1", onClick: inc1}),
    renderBox({value: state.box2, caption: "+2", onClick: inc2}),
    renderBox({value: state.box3, caption: "+3", onClick: inc3}),
  ]);
}

// ACTIONS =========================================================================================
function inc1() {
  state.select("box1").apply(d => d + 1);
}

function inc2() {
  state.select("box2").apply(d => d + 2);
}

function inc3() {
  state.select("box3").apply(d => d + 3);
}

// STATE ===========================================================================================
let state = new Baobab({
  box1: 0,
  box2: 0,
  box3: 0,
});

// RUN =============================================================================================
let tree = renderApp(state.get());   // initial tree
let rootNode = createElement(tree);  // initial root DOM node
document.body.appendChild(rootNode); // should be in the document

state.on("update", function ({data}) {
  let {currentData, previousData} = data;
  let newTree = renderApp(currentData);
  let patches = diff(tree, newTree);
  rootNode = patch(rootNode, patches);
  tree = newTree;
});
