import React from "react";
import { Image, View, StyleSheet } from "react-native";

export default function ResponsiveImage({ source, uri, style, resizeMode = "cover", backgroundColor = "transparent" }) {
  const finalSource = uri ? { uri } : source;
  if (!finalSource) return <View style={[styles.wrap, style, { backgroundColor }]} />;

  return (
    <View style={[styles.wrap, style, { backgroundColor }]}>
      <Image source={finalSource} style={styles.image} resizeMode={resizeMode} fadeDuration={0} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: "100%" },
});
