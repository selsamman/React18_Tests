import React, {startTransition, useEffect, useState} from "react";


function App() {

	const [show, setShow] = useState(false);
	const [count, setCount] = useState(1111);

	useEffect ( () => {
		const interval = setInterval(() => {

			setCount((counter) => {
				console.log("setting count to " + (counter + 1));
				return counter + 1
			})
		}, 50);
		return () => clearInterval(interval)
	}, []);

	return (
		<div className="App">
			<button
				onClick={() => {
					console.log(`onClick setting show to ${!show} count: ${count}`);
					startTransition(() => {
						setShow((show) => !show);
					});
				}}
			>
				toggle content
			</button>
			{show && (
				<>
					<SlowComponent ix={1} counter={count}/>
					<SlowComponent ix={2} counter={count}/>
					<SlowComponent ix={3} counter={count}/>
					<SlowComponent ix={4} counter={count}/>
					<SlowComponent ix={5} counter={count}/>
				</>
			)}
		</div>
	);
}

const SlowComponent = React.memo(function SlowComponent({ix, counter}) {
	console.log(`Render SlowComponent ${ix} count: ${counter}`);
	let now = performance.now();
	while (performance.now() - now < 200) {
		// do nothing
	}
	return <h3>Counter: {counter}</h3>;
});
export default App;
