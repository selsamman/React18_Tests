import React, {
    useState, useTransition,
    Suspense, useRef
} from "react";


import "../styles.css";
import { fetchProfileData } from "./fakeApi";


function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0);

function FApp() {
  const [resource, setResource] = useState(
      initialResource
  );
  const [count, setCount] = useState(0);
  const [
    isPending,
    startTransition
  ] = useTransition({
    timeoutMs: 3000
  });
  const ref = useRef(true);
  if (!ref.current)
      ref.current = 1;
  else
      ref.current++
  console.log(`ref = ${ref.current}`);


    console.log(`Rendering App isPending ${isPending}`);
  return (
      <>
          <h2>Long Transition with useStartTransition! {count}</h2>
        <button disabled={isPending}
            onClick={() => {
              startTransition(() => {
                const nextUserId = getNextId(
                    resource.userId
                );
                setResource(
                    fetchProfileData(nextUserId)
                );
              });
            }}
        >
          Next
        </button>
          <button onClick={() => setCount(count + 1)}>Bump</button>
        <ProfilePage resource={resource} />
      </>
  );
}

function ProfilePage({ resource }) {
  return (
      <Suspense
          fallback={<h1>Loading profile...</h1>}
      >
        <ProfileDetails resource={resource} />
        <Suspense
            fallback={<h1>Loading posts...</h1>}
        >
          <ProfileTimeline resource={resource} />
        </Suspense>
      </Suspense>
  );
}

function ProfileDetails({ resource }) {
  console.log(`Render ProfilePage`);
  const user = resource.user.read();
  console.log(`Render ProfilePage ${user.name}`);
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  console.log(`Render ProfileTimeline`);
  const posts = resource.posts.read();
  console.log(`Render ProfileTimeline ${posts[0].text}`);
  return (
      <ul>
        {posts.map(post => (
            <li key={post.id}>{post.text}</li>
        ))}
      </ul>
  );
}
const Unrelated = function Unrelated () {
    console.log('Rendering Unrelated');
    return (<></>);
};
function App () {
    return (
        <>
            <Unrelated />
            <FApp />
        </>
    )
}
export default App;
