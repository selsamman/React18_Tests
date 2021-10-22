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
			console.log(`setting counter to ${state.counter + 1}`);
			++state.counter
		}, 50);
		return () => clearInterval(interval)
	}, [])
	console.log(`Render App count: ${state.counter}`);
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
				toggle content
			</button>
			{state.show && (
				<>
					<SlowComponent ix={1}/>
					<SlowComponent ix={2} />
					<SlowComponent ix={3}/>
					<SlowComponent ix={4}/>
					<SlowComponent ix={5}/>
				</>
			)}
		</div>
	);
}

const SlowComponent = React.memo(observer(function SlowComponent({ix}) {
	console.log(`Render SlowComponent ${ix} count: ${state.counter}`);
	let now = performance.now();
	while (performance.now() - now < 200) {
		// do nothing
	}
	return <h3>Counter: {state.counter}</h3>;
}));
export default observer(App);
