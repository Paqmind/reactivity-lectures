import "babel/polyfill";
import {Component, renderComponent, tags} from "./lib";
import "../common/styles.css";

let {div, span, button} = tags;

// COMPONENTS ======================================================================================
class Box extends Component {
  render() {
    return (new div(this.props, [
      (new span({}, [this.props.value])).render(),
      (new button({}, [this.props.caption])).render(),
    ])).render();
  }
}

class App extends Component {
  constructor(props={}) {
    super(props, []);

    this.state = {
      box1: 0,
      box2: 0,
      box3: 0,
    };
  }

  inc1() { this.state.box1 += 1; }
  inc2() { this.state.box2 += 2; }
  inc3() { this.state.box3 += 3; }

  render() {
    return (new div(this.props, [
      (new Box({value: this.state.box1, caption: "+1", onClick: this.inc1.bind(this)})).render(),
      (new Box({value: this.state.box2, caption: "+2", onClick: this.inc2.bind(this)})).render(),
      (new Box({value: this.state.box3, caption: "+3", onClick: this.inc3.bind(this)})).render(),
    ])).render();
  }
}

// RUN =============================================================================================
let app = new App({className: "test"});

function render() {
  renderComponent(app, document.getElementById("app"));
  requestAnimationFrame(render);
}

render();
