import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Avatar } from "react-native-elements";
import { Color } from "@/utils/global";
export default class MyAvatar extends Component {
  static defaultProps = {
    source: null,
    title: "这是一句话"
  };
  render() {
    return (
      <View style={styles.avatar}>
        <Avatar
          rounded
          size={92}
          icon={{
            name: "rocket",
            color: "#fff",
            type: "font-awesome"
          }}
          overlayContainerStyle={{
            backgroundColor: Color.primary
          }}
          activeOpacity={0.7}
        />
        <Text
          style={{
            textAlign: "center",
            color: "#555",
            marginTop: 20
          }}
        >
          {this.props.title}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    marginTop: 54
  }
});
