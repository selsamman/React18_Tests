import React, {startTransition, useState, memo, useEffect, useRef} from "react";
import "./styles.css";
import "./App.css";
import {setLogLevel} from "proxily";

const platforms = ["Native", "Proxily"];
const demos = ["LongTransition", "ShortTransition", "UseDeferred",  "Tearing"];

setLogLevel({transitions: true, render: true, propertyTracking: true, propertyChange: true});

const log = console.log;
let refNumber = 1;
const App = function App() {
    const [selectedDemo, setSelectedDemo] = useState("LongTransition");
    const [selectedPlatform, setSelectedPlatform] = useState("Proxily");
    const Component = require('./' + selectedPlatform + '/' +  selectedDemo + selectedPlatform).default;
    let ref  = useRef(null);
    if (!ref.current)
        ref.current = refNumber++;
    log('render ' + ref.current);
    const [foo, setFoo] = useState ( () => log('useState CB') );
    useEffect (() => {
        log('use effect ' + ref.current);
        return () => log('unmount ' + ref.current);
    },[]);
    //return (<div>hello</div>);
    return (
        <>
            <div className="platformSelect">
                <span className="title">State Manager:</span>
                {platforms.map(platform =>
                    <span className={selectedPlatform === platform ? 'selected' : ''}>
                        <button onClick={() => setSelectedPlatform(platform)}>{platform}</button>
                    </span>
                )}
            </div>
            <div className="demoSelect">
                <span className="title">Demo:</span>
                {demos.map(demo =>
                    <span className={selectedDemo === demo ? 'selected' : ''}>
                        <button onClick={() => setSelectedDemo(demo)}>{demo}</button>
                    </span>
                )}
            </div>
            <Component />
        </>
    )
};

export default App;
