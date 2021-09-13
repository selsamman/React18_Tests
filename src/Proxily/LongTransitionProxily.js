import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import "../styles.css";
import {
    observer,
    observable,
    useObservableTransition,
    suspendable,
    setLogLevel,
} from "proxily";
import {fetchPosts, fetchUser} from "../Native/fakeApi";


const state = observable({
    userId: 0,
    get user() {
        return fetchUser(this.userId);
    },
    get posts() {
        return fetchPosts(this.userId);
    },
});

suspendable(state, 'user', {preFetch: true});
suspendable(state, 'posts', {preFetch: true});

function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

const FApp = observer (function App() {
   const [isPending, startObservableTransition] = useObservableTransition({});
   console.log(`Rendering App isPending ${isPending}`);
   return (
      <>
          <h2>Long Transition with useObservableStartTransition</h2>
        <button disabled={isPending}
            onClick={() => {
              startObservableTransition(() => {
                state.userId = getNextId(state.userId);
              });
            }}
        >
          Next
        </button>
        <ProfilePage />
      </>
  );
});

const ProfilePage = observer(function ProfilePage() {
  return (
      <Suspense
          fallback={<h1>Loading profile...</h1>}
      >
        <ProfileDetails/>
        <Suspense
            fallback={<h1>Loading posts...</h1>}
        >
          <ProfileTimeline/>
        </Suspense>
      </Suspense>
  );
})

const ProfileDetails = observer(function ProfileDetails() {
  console.log(`Render ProfilePage`);
  const {user} = state;
  console.log(`Render ProfilePage ${user.name}`);
  return <h1>{user.name}</h1>;
});

const ProfileTimeline = observer(function ProfileTimeline() {
    console.log(`Render ProfileTimeline`);
  const {posts} = state;
  console.log(`Render ProfileTimeline ${posts[0].text}`);
  return (
      <ul>
        {posts.map(post => (
            <li key={post.id}>{post.text}</li>
        ))}
      </ul>
  );
});

function App () {
    return (
        <>
            <Unrelated />
            <FApp />
        </>
    )
}
const Unrelated = observer(function Unrelated () {
    console.log('Rendering Unrelated');
    return (<></>);
});
export default observer(App);
