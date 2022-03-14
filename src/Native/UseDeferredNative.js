import React, {useState, memo, useContext, useDeferredValue} from "react";

import "../styles.css";
let l = console.log;

const SlowTextContext = React.createContext("");
const UseTransition = function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text);

  function handleChange(e) {
      l("setText=" + e.target.value);
    setText(e.target.value);
  }
    l("Render App current=" + text + " deferred=" + deferredText);

    return (
            <div className="App">
                <h2>Responsive Input  - useDeferredState</h2>
                <label>
                    Type into the input: <input value={text} onChange={handleChange}/>
                </label>
                <p>
                    Even though{" "}
                    <b>
                        each list item in this demo artificially blocks the main thread for 3
                        milliseconds
                    </b>
                    , the app is able to stay responsive.
                </p>
                <hr/>
                <MySlowList text={deferredText}/>
            </div>

    )
}

const MySlowList =  memo (({text}) => {
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
