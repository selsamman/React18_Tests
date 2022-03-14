import React, { useEffect} from "react";
import {observable, observer, useObservableStartTransition} from "proxily";

let state = observable({
	counter: 0,
	show: false
});

function App() {
	const startTransition = useObservableStartTransition();
	useEffect ( () => {
		const interval = setInterval(() => {
			++state.counter;
			console.log(`setting counter=${state.counter}`);
		}, 50);
		return () => clearInterval(interval)
	}, [])
	console.log(`Render App counter=${state.counter}`);
	return (
		<div className="App">
			<button
				onClick={() => {
					console.log(`onClick setting show to ${!state.show} count: ${state.counter}`);
					startTransition(() => {
						state.show = !state.show;
					});
				}}
			>
				{state.show ? 'off' : 'on'}
			</button>
			{state.show && (
				<>
					<SlowComponent ix={1} counter={state.counter}/>
					<SlowComponent ix={2} counter={state.counter}/>
					<SlowComponent ix={3} counter={state.counter}/>
					<SlowComponent ix={4} counter={state.counter}/>
					<SlowComponent ix={5} counter={state.counter}/>
				</>
			)}
		</div>
	);
}

const SlowComponent = React.memo(observer(function SlowComponent({ix, counter}) {
	console.log(`Render SlowComponent ${ix} counter=${counter}`);
	let now = performance.now();
	while (performance.now() - now < 200) {
		// do nothing
	}
	return <h3>Counter: {counter}</h3>;
}));
export default observer(App);
