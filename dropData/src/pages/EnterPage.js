import React, {Component} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {storage} from '@/storage';
import permission from '@/utils/permission';
import Nav from '@/navigators/NavigationService';
export class EnterPage extends Component {
  componentDidMount = async () => {
    //   获取权限
    await permission.check('PHOTO');
    await permission.check('CAMERA');
    await permission.check('LOCATION');
    storage.load('userdata', userdata => {
      setTimeout(() => {
        Nav.resetRouter(userdata ? 'Nav' : 'Login');
      }, 1000);
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/imgs/EnterPage_2.jpg')}
          style={{flex: 1}}
          resizeMode="cover"
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default EnterPage;
