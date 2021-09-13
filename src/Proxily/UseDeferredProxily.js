import React, { startTransition, useState, memo } from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import {
    observable,
    observer,
    setLogLevel,
    useDeferredObservable,
    useObservableTransition,
    useTransactable,
    useTransaction
} from 'proxily';
let l = console.log;
let renders = 0;

const state = observable({
    text : "hello",
});
setLogLevel({transitions: true});

const Demo = observer(function App() {

    const [slowText, setDeferredObservable] = useDeferredObservable(state.text);
    function handleChange(e) {
        state.text = e.target.value;
        setDeferredObservable(() => {
            state.text = e.target.value;
        });
      }
  l(`Render App (${++renders}) -- input: ${state.text} result: ${slowText}`);
  return (
      <div className="App">
          <h1>Responsive Input  - useDeferredObservable</h1>
          <label>
              Type into the input: <input value={state.text} onChange={handleChange}/>
          </label>
          <p style={{background: state.text !== slowText ? "yellow" : ""}}>
              Delayed Input: <b>{slowText}</b>
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
          <MySlowList text={slowText}/>
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
export default Demo;

