import React, { useState } from "react";
import { Animated, ScrollView } from "react-native";

const TabBarHideOnScroll = ({ children }: { children: React.ReactNode }) => {
  const [scrollY] = useState(new Animated.Value(0));

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true },
  );

  const tabBarTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={{ flex: 1 }}>
      <ScrollView scrollEventThrottle={16} onScroll={handleScroll}>
        {children}
      </ScrollView>

      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: tabBarTranslateY }],
        }}
      >
        {/* Your tabbar component here */}
      </Animated.View>
    </Animated.View>
  );
};

export default TabBarHideOnScroll;
