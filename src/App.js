import React, {useState} from "react";
import "./styles.css";
import "./App.css";
import {setLogLevel} from "proxily";

const platforms = ["Native", "Proxily"];
const demos = ["LongTransition", "ShortTransition", "UseDeferred",  "Tearing"];

setLogLevel({transitions: true, render: true, propertyTracking: true, propertyChange: true});
setLogLevel({transitions: true, render: true, propertyTracking: true});

const App = function App() {
    const [selectedDemo, setSelectedDemo] = useState("LongTransition");
    const [selectedPlatform, setSelectedPlatform] = useState("Proxily");
    const Component = require('./' + selectedPlatform + '/' +  selectedDemo + selectedPlatform).default;
    //return (<div>hello</div>);
    return (
        <>
            <div className="platformSelect">
                <span className="title">State Manager:</span>
                {platforms.map(platform =>
                    <span key={platform} className={selectedPlatform === platform ? 'selected' : ''}>
                        <button onClick={() => setSelectedPlatform(platform)}>{platform}</button>
                    </span>
                )}
            </div>
            <div className="demoSelect">
                <span className="title">Demo:</span>
                {demos.map(demo =>
                    <span key={demo} className={selectedDemo === demo ? 'selected' : ''}>
                        <button onClick={() => setSelectedDemo(demo)}>{demo}</button>
                    </span>
                )}
            </div>
            <Component />
        </>
    )
};

export default App;
