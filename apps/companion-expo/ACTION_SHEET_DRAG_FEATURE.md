# ActionSheet Drag-to-Close Gesture Feature Technical Report

## Overview
This document summarizes the research, technical approach, challenges faced, and recommended roadmap for implementing an interactive drag-to-close BottomSheet / ActionSheet in `apps/companion-expo`.

---

## 1. Initial Objectives
- Allow users to drag down the Prayer Timings ActionSheet modal to dismiss it cleanly.
- Ensure smooth slide-in and slide-out transitions.
- Maintain a scrollable vertical list of prayer times inside the modal.

---

## 2. Technical Approach Taken

### Architecture
We attempted a native React Native implementation using raw `PanResponder` and `Animated.Value`:
- **Gesture Capture**: `PanResponder` attached to a top drag handle / header bar.
- **Vertical Displacement (`panY`)**: An `Animated.Value` tracking downward drag displacement (`gestureState.dy`).
- **Release Handling**: Checking downward displacement (`dy > threshold`) or velocity (`vy > threshold`) to trigger dismissal or spring back up.
- **Modal Wrapper**: Standard React Native `<Modal>` component.

---

## 3. Issues & Challenges Encountered

### 🔴 Issue 1: JS Thread vs Native Animation Driver Desynchronization
- **Symptom**: Immediately upon releasing the finger after dragging down, the sheet jumped back to position `0` (top) before animating down.
- **Root Cause**: 
  - `panY.setValue(gestureState.dy)` during `onPanResponderMove` updates the `Animated.Value` on the JavaScript thread.
  - When `Animated.timing(panY, { useNativeDriver: true })` triggered on gesture release, the native animation driver initialized the animation from its last stored *native driver value* (`0`), snapping the view back to `0` on frame 1 before animating down to `SCREEN_HEIGHT`.
  - Switching to `useNativeDriver: false` synchronized JS & Animated states, but shifted animation work back onto the JS thread.

### 🔴 Issue 2: Conflict with React Native `<Modal>` Slide Animations
- **Symptom**: Double-sliding, flickering, and layout pops on opening and closing.
- **Root Cause**: 
  - React Native's `<Modal animationType="slide">` uses OS-level modal view controller slide transitions.
  - Combining native modal slide animations with custom `translateY` transforms created race conditions between native window mounting and React component lifecycle unmounting.

### 🔴 Issue 3: Touch Responder Termination (`onPanResponderTerminate`)
- **Symptom**: Dragging down sometimes froze or snapped back abruptly without triggering dismissal.
- **Root Cause**: 
  - Nested `<TouchableWithoutFeedback>` wrappers (used for backdrop tap-to-close) intercepted touch release events on iOS.
  - On iOS, touch interception dispatches `onPanResponderTerminate` rather than `onPanResponderRelease`. Without explicit, identical termination handling, gesture state was cancelled mid-flight.

---

## 4. Recommendations for Future Implementation

To implement a smooth 60/120 FPS drag-to-close ActionSheet in the future, we recommend one of the following production-grade solutions:

### 🏆 Recommended Approach A: `@gorhom/bottom-sheet` (Industry Standard)
- **Library**: [`@gorhom/bottom-sheet`](https://gorhom.dev/react-native-bottom-sheet/)
- **Why**:
  - The industry-standard bottom sheet library for React Native & Expo.
  - Native gesture handling out of the box with zero jump/flicker bugs.
  - Built-in support for snap points (e.g. `['50%', '85%']`), drag handle, backdrop dimming (`BottomSheetBackdrop`), and nested scrolling (`BottomSheetScrollView`).

### 🛠️ Recommended Approach B: Reanimated + Gesture Handler
- **Libraries**: `react-native-reanimated` + `react-native-gesture-handler`
- **Why**:
  - `Gesture.Pan()` from `react-native-gesture-handler` runs entirely on the UI thread.
  - `useSharedValue` and `useAnimatedStyle` from `react-native-reanimated` update positions directly on the native rendering thread.
  - Prevents all JS-to-Native bridge desynchronization jumps.

---

## 5. Current Working State in `companion-expo`
- **Updated Clean Layout Retained**:
  1. Prayer times are in a clean, scrollable vertical list with emojis and status badges (`NEXT` / `NOW`).
  2. "Alerts On" and modal close ("✕") buttons are in separate flex rows with zero visual overlap.
  3. ActionSheet modal uses clean native `<Modal animationType="slide">` presentation.
