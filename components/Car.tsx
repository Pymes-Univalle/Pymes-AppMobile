import {
    View,
    Text,
    Image,
    ImageProps,
    ViewProps,
    TextProps,
    StyleSheet,
  } from "react-native";
  
  export const CardImage = ({ source, style, ...props }: ImageProps) => {
    return (
      <Image
        {...props}
        source={source}
        style={[styles.image, style]}
        resizeMode="cover"
      />
    );
  };
  
  export const CardContent = ({ children, style, ...props }: ViewProps) => {
    return (
      <View {...props} style={[styles.content, style]}>
        {children}
      </View>
    );
  };
  
  export const CardTitle = ({ children, style, ...props }: TextProps) => {
    return (
      <Text {...props} style={[styles.title, style]}>
        {children}
      </Text>
    );
  };
  
  export const Card = ({ children, style, ...props }: ViewProps) => {
    return (
      <View
        {...props}
        style={[styles.card, style]}
      >
        {children}
      </View>
    );
  };

  const styles = StyleSheet.create({
    image: {
      width: "100%",
      height: 64,
      borderRadius: 10,
    },
    content: {
      padding: 6,
    },
    title: {
      color: "#000",
      fontSize: 18,
      fontWeight: "bold",
    },
    card: {
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      width: "100%",
      maxWidth: 200,
    },
  });