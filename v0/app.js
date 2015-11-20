// https://gist.github.com/jlongster/3f32b2c7dce588f24c92#file-a-increment-js

import Bloop from "./lib";

let dom = Bloop.dom;

// COMPONENTS ======================================================================================
let Box = Bloop.createClass({
  getInitialState: function () {
    return {
      number: 0
    };
  },

  updateNumber: function () {
    this.state.number++;
  },

  render: function () {
    return dom.div(
      dom.span(this.state.number),
      dom.button({ onClick: this.updateNumber }, "Increment")
    );
  }
});

// RUN =============================================================================================
let box = new Box();

function render() {
  Bloop.renderComponent(box, document.body);
  requestAnimationFrame(render);
}

render();
