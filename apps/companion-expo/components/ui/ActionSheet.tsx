import React, { useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const DISMISS_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  handleColor?: string;
}

export function ActionSheet({
  visible,
  onClose,
  children,
  backgroundColor = "#141419",
  borderColor = "#27272A",
  handleColor = "#3F3F46",
}: ActionSheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const closeSheet = useCallback(() => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(
      SCREEN_HEIGHT,
      { duration: 250 },
      (finished) => {
        if (finished) {
          runOnJS(handleDismiss)();
        }
      }
    );
  }, [backdropOpacity, translateY, handleDismiss]);

  useEffect(() => {
    if (visible) {
      translateY.value = SCREEN_HEIGHT;
      backdropOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withSpring(0, {
        damping: 24,
        stiffness: 240,
        mass: 0.8,
      });
    } else {
      translateY.value = SCREEN_HEIGHT;
      backdropOpacity.value = 0;
    }
  }, [visible, translateY, backdropOpacity]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Allow downward dragging, apply slight resistance when pulling upward
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      } else {
        translateY.value = event.translationY * 0.2;
      }
    })
    .onEnd((event) => {
      if (
        event.translationY > DISMISS_THRESHOLD ||
        event.velocityY > VELOCITY_THRESHOLD
      ) {
        // Dragged down far enough or fast enough -> Close
        backdropOpacity.value = withTiming(0, { duration: 180 });
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 220 },
          (finished) => {
            if (finished) {
              runOnJS(handleDismiss)();
            }
          }
        );
      } else {
        // Snap back up smoothly
        translateY.value = withSpring(0, {
          damping: 24,
          stiffness: 240,
          mass: 0.8,
        });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const animatedBackdropStyle = useAnimatedStyle(() => {
    const dynamicOpacity = interpolate(
      translateY.value,
      [0, SCREEN_HEIGHT * 0.5],
      [0.6, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity: backdropOpacity.value * dynamicOpacity,
    };
  });

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={closeSheet}
    >
      <View style={styles.modalOverlay}>
        {/* Animated Dark Backdrop with Tap-to-Close */}
        <TouchableWithoutFeedback onPress={closeSheet}>
          <Animated.View style={[styles.backdrop, animatedBackdropStyle]} />
        </TouchableWithoutFeedback>

        {/* Action Sheet Container with Pan Gesture Handler */}
        <Animated.View
          style={[
            styles.sheetContainer,
            {
              backgroundColor,
              borderColor,
            },
            animatedSheetStyle,
          ]}
        >
          {/* Pan Gesture Area over Top Handle Bar & Header area */}
          <GestureDetector gesture={panGesture}>
            <View style={styles.dragHandleBar}>
              <View style={[styles.dragHandle, { backgroundColor: handleColor }]} />
            </View>
          </GestureDetector>

          {/* Children Content (Header, ScrollView, etc.) */}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#000000",
  },
  sheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: Platform.OS === "ios" ? 34 : 24,
    maxHeight: "85%",
  },
  dragHandleBar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    width: "100%",
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
  },
});
