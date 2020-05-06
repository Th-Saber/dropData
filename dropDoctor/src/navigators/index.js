import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

// 页面组件
import EnterPage from '@/pages/EnterPage';
import Tab from '@/layout/Nav/Nav';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import {User, HealthReport, Equipment, Contact, Address} from '@/pages/My';

const Stack = createStackNavigator();
export let Nav;
// 路由导航租组件
export default function routers() {
  const options = {
    header: () => null,
  };
  return (
    <NavigationContainer ref={e => (Nav = e)}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          // 添加这一行会实现安卓下页面的左右切换，默认是从下到上
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen options={options} name="Tab" component={Tab} />
        <Stack.Screen options={options} name="Login" component={Login} />
        <Stack.Screen options={options} name="Register" component={Register} />
        <Stack.Screen options={options} name="User" component={User} />
        <Stack.Screen
          options={options}
          name="HealthReport"
          component={HealthReport}
        />
        <Stack.Screen
          options={options}
          name="Equipment"
          component={Equipment}
        />
        <Stack.Screen options={options} name="Contact" component={Contact} />
        <Stack.Screen options={options} name="Address" component={Address} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
