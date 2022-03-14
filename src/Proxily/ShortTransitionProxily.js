import React, {  memo } from "react";
import "../styles.css";
import {observable, observer, useObservableTransition} from 'proxily';
let l = console.log;
let renders = 0;

const state = observable({
    result: {text : "hello"},
    input: {text : "hello"}
});


const UseTransition = observer(function App() {

    const [,startTransition] = useObservableTransition();
    function handleChange(e) {
        state.input.text = e.target.value;
        startTransition(() => {
            state.result.text = e.target.value;
            /*
            React will start rendering off-screen.  The off-screen version will get state with new result.text
            while the on-screen will get state with old result.text  During this transition the input control
            displays updated value so the user gets immediate feedback.  Eventually the off-screen components are
            moved on-screen and the lists appear to catch up.  Note that this distinction is only possible
            because result and input are objects which have independent snapshots.
            */
        });
      }
  l(`Render App (${++renders}) -- input: ${state.input.text} result: ${state.result.text}`);
  return (
      <div className="App">
          <h1>Responsive Input  - useObservableTransition</h1>
          <label>
              Type into the input: <input value={state.input.text} onChange={handleChange}/>
          </label>
          <p style={{background: state.result.text !== state.input.text ? "yellow" : ""}}>
              Delayed Input: <b>{state.result.text}</b>
          </p>
          <p>
              Even though{" "}
              <b>
                  each list item in this demo artificially blocks the main thread for 3
                  milliseconds
              </b>
              , the app is able to stay responsive.
          </p>
          <hr/>
          <MySlowList text={state.result.text}/>
      </div>
  );
});

const MySlowList =  memo (({ text }) => {
    l("render slowlist");
    let items = [];
    for (let i = 0; i < 50; i++) {
        items.push(<ListItem key={i}>{"Result " + i + " for " + text}</ListItem>);
    }
    return (
        <>
            <p>
                <b>Results for "{text}":</b>
            </p>
            <ul className="List">{items}</ul>
        </>
    );
});

function ListItem({ children }) {
    let now = performance.now();
    while (performance.now() - now < 10) {
        // Note: this is an INTENTIONALLY EMPTY loop that
        // DOES NOTHING for 3 milliseconds for EACH ITEM.
        //
        // It's meant to emulate what happens in a deep
        // component tree with calculations and other
        // work performed inside components that can't
        // trivially be optimized or removed.
    }
    //l("item", children);
    return <div className="ListItem">{children}</div>;
}
export default UseTransition;

