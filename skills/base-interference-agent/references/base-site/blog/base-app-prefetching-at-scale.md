# blog/base-app-prefetching-at-scale

Source: https://www.base.org/blog/base-app-prefetching-at-scale.md

# Building The New Base App: Prefetching at Scale

> TL;DR We reduced navigation blocking time by 80-100% and eliminated loading shimmers entirely. Here's how.

- Date: 2026-01-21
- Author: Léo Galley
- URL: https://www.base.org/blog/base-app-prefetching-at-scale

## Background: The challenge

A year ago, we made a bold decision: evolve Coinbase Wallet into the [Base App](https://join.base.app/), an onchain everything app that brings social, trading, payments, app discovery, and earning into one place. Our goal was to build a consumer-grade experience that rivals the best social apps, while gracefully handling onchain challenges like transaction confirmations and real-time blockchain data syncing. But we also knew it was critical to balance security and quality with speed and scale. To do this, we carefully considered how to handle loading states.

We started with loading skeletons (or shimmer UIs). They serve a single purpose: to keep users engaged while data is being fetched. Instead of staring at a blank screen or a spinning loader, users see a visual placeholder that mimics the final layout of the content.

But loading skeletons are ultimately an elegant **band-aid**, and we set out to do better. They help mask slow APIs or heavy computations by giving users something to look at while they wait. While they improve the overall user experience, they don't address the root cause of slow performance.

As the content is being fetched, the skeleton itself must be rendered first, followed by the actual content once it’s loaded. This double render cycle can affect performance, particularly on less powerful devices. The result? An additional delay that might ironically make the app feel slower, especially in low network conditions or on resource-constrained devices.

One could also argue the repeated, jumpy flash of gray shimmers isn’t as elegant as we thought. See our current Profile loading timeline:

![Profile Loading States](https://www.base.org/images/blog/base-app-prefetching-at-scale/01.webp 'Profile Loading States')

This pattern addresses a backend bottleneck : Loading data from multiple sources, all at once can be slow. It introduces a waterfall of layout loading state while various parts of the screen are being fetched.

However, this came at the tradeoff of making the user's experience substantially worse.

We wanted to do better. So we built a behavioral prefetching system in the new Base App to anticipate user behavior and deliver content instantly.

## Solution: Behavioral, data-driven prefetching

We have _data_ on the navigation habits between different links and screens. E.g: Users on the Feed are more inclined to navigate to a **Cast** than a **Profile**.

We also know when links are **in the viewport**. We can use this to design a simple prefetching algorithm:

```
score = conversionRate * visibility * manual priority
```

And start prefetching screens data accordingly:

![](https://www.base.org/images/blog/base-app-prefetching-at-scale/02.webp)

A simple idea in principle, with many caveats.

### **Overfetching**

There can be hundreds of links on any given screen — so how can we reduce scope and only prefetch visible items? Unfortunately react-native doesn’t have yet an [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) so we came up with a few alternatives below.

> **Note:** These snippets are meant to be educational / inspirational, copy-pasting as-is won’t work.

### Measure & onLayout

With react’s [New architecture](https://reactnative.dev/architecture/landing-page), we can leverage the useLayoutEffect & [measure method](https://reactnative.dev/docs/the-new-architecture/layout-measurements)

```
function PrefetchOnVisible({ children, prefetchQuery }) {
 const ref = useRef (null);
 const prefetchManager = PrefetchManager.getInstance();

 // Synchronous, first-frame measure
 useLayoutEffect(() => {
 ref.current.measure((_x, _y, _width, _height, _pageX, pageY) => {

 // Within Viewport?
 const isComponentVisible = pageY = 0;
 if (!isComponentVisible) return;

 prefetchManager.process(prefetchQuery);
 });
 }, [prefetchQuery]);

 return {children} ;
}
```

For legacy Architecture, we can fallback to **onLayout** callback:

```
function PrefetchOnVisible({ children, prefetchQuery }) {
 const ref = useRef (null);
 const prefetchManager = PrefetchManager.getInstance();

 // Asynchronous, next frame measure
 const onLayout = useCallback(() => {
 ref.current.measure((_x, _y, _width, _height, _pageX, pageY) => {

 // Within Viewport?
 const isComponentVisible = pageY = 0;
 if (!isComponentVisible) return;

 prefetchManager.process(prefetchQuery);
 });
 }, [prefetchQuery]);

 return (

 {children}

 );
}
```

Then wrap our links accordingly:

```
function ProfileLink({ children, profileId }) {
 const navigateToProfile = useCallback(() => {
 navigate('Profile', { profileId });
 }, [profileId]);

 const profileQuery = useProfileScreenContentQuery(profileId);

 return (

 {children}

 );
```

If **ProfileLink** is within the viewport when the screen renders, **ProfileQuery** will be fetched & cached. Navigation to the profile will become instant.

However, this only works for static, non-scrollable screens: useLayoutEffect and useLayout only fire when the layout changes.

### Virtualized list: renderItem & onViewableItemsChanged

Most if not all virtualized lists ([FlatList](https://reactnative.dev/docs/flatlist#onviewableitemschanged), [FlashList](https://shopify.github.io/flash-list/docs/usage#onviewableitemschanged) & [LegendList](https://www.legendapp.com/open-source/list/v2/props/#onviewableitemschanged)) have two methods we’re interested in:

- [renderItem](https://reactnative.dev/docs/flatlist#required-renderitem)
- [onViewableItemsChanged](https://reactnative.dev/docs/flatlist#onviewableitemschanged)

We can wrap these methods to keep track of when an item is visible on the screen:

Let’s start by wrapping renderItem function with a provider to share the item’s index:

```
function usWrappedRenderItem({ renderItem, listId }) {

 // Wrap list items with a provider surfacing the index of the item
 return useCallback((args) => (

 {renderItem(args)}

 ), [renderItem]);
}
```

All children within this function can now access their index within the list & the listId:

```
const { index, listId } = useListItemVisibility()
```

Next let’s wrap the onViewableItemsChanged callback:

```
 function useVisibilityTracker({ onViewableItemsChanged, listId }) {

 // 1. Keep track of mounted list
 useEffect(
 function trackListVisibility() {
 visibilityTracker.registerList(listId);

 return visibilityTracker.removeList(listId);
 },
 [listId],
 );

 // 2 Update visible items when array of visible items changes
 const updateVisibleItems = useCallback((visibleIndexes: Set ) => {
 visibilityTracker.setVisibleItems(listId, visibleIndexes);
 }, [listId]);

 // 3. Debounce to avoid rapid-fire updates while scrolling
 const debouncedUpdateVisibleItems = useDebouncedCallback(updateVisibleItems, 150);

 // 4. Return the wrapped onViewableItemsChanged callback
 return useCallback((event: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {

 // Call the original callback first
 onViewableItemsChanged?.(event);

 // Get visible indexes
 const { viewableItems } = event;
 const visibleIndexes = new Set(
 viewableItems.filter(({ isViewable }) => !!isViewable).map(({ index }) => index),
 );

 debouncedUpdateVisibleItems(visibleIndexes);
 }, [debouncedUpdateVisibleItems, onViewableItemsChanged]);
}
```

And finally, use this in our lists:

```
const wrappedRenderItem = useWrappedRenderItem({
 renderItem,
 listId: 'MyList',
});

 const wrappedOnViewableItemsChanged = useVisibilityTracker({
 onViewableItemsChanged
 listId: 'MyList',
});

return (
 {
 visibilityTracker.subscribe('listId', (visibleIndexes) => {

 // Item index is not in the viewport, return
 if(!visibleIndexes.has(index)) return;

 // Item is in the viewport, prefetch !
 prefetchManager.process(prefetchQuery);
 });

 return () => visibilityTracker.unsubscribe();
 }, []);

 return children;
};
```

The hard part is done, and what’s next is we have  scroll-aware viewport context and can prefetch data accordingly.

### **Backend strain:**

Even when fetching only visible data, this can still mean hundreds of requests per user, multiplied across hundreds of thousands of users.

### It’s queue time

An on-device queue gives us flexibility and safety, we can add delay, max concurrent requests & even a set maximum request per minutes:

![](https://www.base.org/images/blog/base-app-prefetching-at-scale/03.webp)

We also can set these queue options based on device class: A last-gen iPhone Pro can prefetch hundreds of queries in seconds, but a low-end Android phone will start struggling almost immediately.

### Killswitches

Even the most moderate queue settings and conservative visibility tracking can’t avoid overfetching entirely: We added fine-grained killswitches by defining “Triggers,” e.g. Link to a screen & “Target” e.g. The screen.

If our profile backend sees an abnormal strain from prefetching, we can disable specific prefetching flow like “search results → profile”, or disable profile prefetching entirely.

![](https://www.base.org/images/blog/base-app-prefetching-at-scale/04.webp)

Now that frontend won’t overfetch, and we have multiple mitigations in place for our backend. Time for the elephant in the room: DevX

### **DevX**

We have 20+ classes, components, context, helpers, hooks. How can we make the process of _implementing_ prefetching easy?

**Solution:** a single API for prefetching target & triggers:

```
function createPrefetchableComponent( { query, prefetchTarget, options }, Component) {

 // Wraps "target" component
 const PrefetchableComponent = memo(function PrefetchableComponent({ variables }) {

 // Fetching & refresh methods
 const queryRef = useLazyLoadQuery(query, variables, options);
 const { refresh, isRefreshing } = useRefreshQuery(query, variables);

 const props = { queryRef, refresh, isRefreshing, variables };

 return 
 });

 // Attach the Trigger component with the query & prefetchTarget
 PrefetchableComponent.TriggerComponent = memo(function TriggerComponent({ children }) {
 return {children} ;
 });

 return PrefetchableComponent;
}
```

> **_Note:_** _This is a heavily simplified snippet, in practice it’s a typescript fiesta._

Then use this to wrap our prefetchable components:

```
const PrefetchableProfile = createPrefetchableComponent({
 query: profileQuery,
 prefetchTarget: 'profile'
}, function Profile({data, refresh}) {

 // ...

})
```

And finally around our triggers:

```
 function ProfileLink({ children, profileId }) {
 const navigateToProfile = useCallback(() => {
 navigate('Profile', { profileId });
 }, [profileId]);

 return (

 {children}

 );
```

Add a couple AI rules and context on top, and implementing prefetching becomes one-shotable.

## Results

#### Smooth UX

Previously, navigating between tabs led to a shimmer fest:

https://www.youtube.com/watch?v=W9Cq9H-TOYA

With prefetching enabled, navigation & rendering is instant:

https://www.youtube.com/watch?v=PDdOG2-2ocM

We added debugging tools to let us “see” the prefetching in action

https://www.youtube.com/watch?v=6mxZC4wk3ms

![](https://www.base.org/images/blog/base-app-prefetching-at-scale/05.webp)

#### Performance

We measure our app’s performance via a [unified scoring system](https://www.coinbase.com/blog/performance-vitals-a-unified-scoring-system-to-guide-performance-health-and-prioritization) introduced at Coinbase:

- **NTBT**: Navigation Total Blocking Time
- **ART**: Above the fold Rendering Time
- **TRT**: Total Rendering Time

Together, these metrics capture how quickly users can interact, see initial content, and view the fully loaded screen.

See performance comparison results on High End devices:

**NTBT: -80-100%**\
\
The data is available in cache, no suspense is triggered and navigation is instant

```
| Screen | Before | After | Diff (%) |
|---------------|--------|-------|----------|
| Search | 44 | 0 | -100% |
| Transact | 183 | 25 | -86.3% |
| Notifications | 48 | 0 | -100% |
| Wallet | 126 | 38 | -69.8% |
| Profile | 229 | 0 | -100% |
```

**TRT & ART: -70-80%**

We skip the loading steps entirely, the screen renders near-instantly in its final state.

```
| Screen | Before | After | Diff (%) |
|---------------|--------|-------|----------|
| Search | 283 | 33 | -88.3% |
| Transact | 765 | 141 | -81.6% |
| Notifications | 447 | 127 | -71.6% |
| Wallet | 849 | 128 | -84.9% |
| Profile | 511 | 94 | -81.6% |
```

We saw similar results on low end devices

**NTBT: -60%**\
\
The data is available in cache, but de-serialization is still expensive on low end devices.\
\
**TRT & ART: -40%**

Rendering is faster but still expensive on low end devices.

---

## Try it out today

Download the [Base app](https://join.base.app/) and experience instant, seamless navigation for yourself—no shimmers, no waiting, just the onchain everything app the way it's meant to feel.

---

## Appendix: Rendering, Tech Stack & RN New Architecture

Curiously, a few screens remained stubbornly slow even with prefetching enabled. What's going on?

All our investigations pointed to the same conclusion: Our stack was aging.

Running React Native **0.77.3** in legacy mode meant missing out on bug fixes & new features.

The New Architecture, its flashy new Fabric UI rendering engine and bridgeless native call should also streamline rendering.

But more importantly, it blocked us from upgrading third‑party libraries like FlashList V2, Reanimated V4, and many others that have already moved to the [New Architecture](https://reactnative.dev/architecture/landing-page).\
\
In theory, it’s just a matter of switching a flag somewhere in the app config:

```
-newArchEnabled=true
+newArchEnabled=false
```

Sounds easy enough right?
