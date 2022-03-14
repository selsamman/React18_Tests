import React, {memo} from "react";
import "../styles.css";
import {
    getCurrentValue,
    observable,
    observer,
    useObservableTransition,

} from 'proxily';

let l = console.log;
let renders = 0;

const state = observable({
    text: "hello",
});


const Demo = observer(function App() {

    const [,startTransition] = useObservableTransition();
    const handleChange = (e) => {
        //state.text = e.target.value;
        startTransition(() => state.text = e.target.value)
    };
    const currentText = getCurrentValue(state, state => state.text);

    l("render app text=" + state.text + " currentText=" + currentText);

    return (
        <div className="App">
            <h1>Responsive Input - useDeferredObservable</h1>
            <label>
                Type into the input: <input value={currentText} onChange={handleChange}/>
            </label>
            <p style={{background: state.text !== currentText ? "yellow" : ""}}>
                text = {state.text} currentText = {currentText}
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
            <MySlowList text={state.text}/>
        </div>
    );
});

const MySlowList = memo(({text}) => {
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

function ListItem({children}) {
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

