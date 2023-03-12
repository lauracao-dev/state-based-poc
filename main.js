import "./style.css";
import { watchEffect, computed } from "vue";
import {
  useStorage,
  useActiveElement,
  useToggle,
  useAsyncState,
} from "@vueuse/core";

/*
  |--------------------------------------------------------------------------
  | STATE-BASED LOGIC (can be copied directly to a Vue.js project)
  |--------------------------------------------------------------------------
*/

// simple toggle composable
const [showCounter, toggle] = useToggle(true);

// reactive ref being loaded from local storage
const count = useStorage("my-count", 0);

// computeds
const toggleText = computed(() => `Show counter: ${showCounter.value}`);
const countText = computed(() => `Current count: ${count.value}`);
const doubleCountText = computed(() => `Double count: ${count.value * 2}`);

// composable that gives us reactive state based on async function
const { state, isReady, isLoading } = useAsyncState(async () => {
  await new Promise((r) => setTimeout(r, 2000));
  return "State based POC";
}, "Loading title...");

// composable that detects active element
const activeElement = useActiveElement();
const activeElementText = computed(
  () => `Current active element tag: ${activeElement.value?.tagName || "null"}`
);

function handleIncreaseCountClick() {
  count.value = count.value + 1;
}

/*
  |--------------------------------------------------------------------------
  | RENDERER - typical thing that Vue would do for us automatically
  |--------------------------------------------------------------------------
*/

// watchEffect tracks all its reactive dependencies automatically and executes the function when any of them change
watchEffect(() => {
  const titleEl = document.getElementById("state");
  titleEl.innerText = state.value;

  const toggleEl = document.getElementById("toggle");
  toggleEl.innerText = toggleText.value;
  toggleEl.onclick = () => toggle();

  const counterContainerEl = document.getElementById("counterContainer");
  counterContainerEl.style.display = showCounter.value ? "block" : "none";

  const counterEl = document.getElementById("counter");
  counterEl.onclick = handleIncreaseCountClick;
  counterEl.innerText = countText.value;

  const doubleEl = document.getElementById("double");
  doubleEl.innerText = doubleCountText.value;

  const activeEl = document.getElementById("activeEl");
  activeEl.innerText = activeElementText.value;
});
