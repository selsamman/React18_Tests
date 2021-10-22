import React, {startTransition, useState, memo, useContext} from "react";
import "../styles.css";
let l = console.log;

const SlowTextContext = React.createContext("");
const UseTransition = function App() {

  const [text, setText] = useState("hello");
  const [slowText, setSlowText] = useState(text);

  function handleChange(e) {
    setText(e.target.value);
    startTransition(() => {
      setSlowText(e.target.value);
      l("setting " + e.target.value);
    });
  }
    l("Render App " + text + " " + slowText);

    return (
        <SlowTextContext.Provider value={slowText}>
            <div className="App">
                <h2>Responsive Input  - startTransition</h2>
                <label>
                    Type into the input: <input value={text} onChange={handleChange}/>
                </label>
                <p style={{background: slowText !== text ? "yellow" : ""}}>
                    <DelayedInput />
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
        </SlowTextContext.Provider>
    )
}
const DelayedInput = () => {
    const slowText = useContext(SlowTextContext);
    return (
        <span>
            Delayed Input: <b>{slowText}</b>
        </span>
    )
}
const MySlowList =  memo (() => {
    const text = useContext(SlowTextContext);
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
