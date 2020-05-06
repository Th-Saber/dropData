import React, {Component} from 'react';
import {BackHandler} from 'react-native';

import {
  addNavigationHelpers,
  NavigationActions,
  createAppContainer,
} from 'react-navigation';
import {AppStackNavigator} from '@/navigators/AppNavigator';
import Nav from '@/navigators/NavigationService';
import {addListener} from '@/navigators/reduxHelper';
import {connect} from 'react-redux';

const StacksOverTab = createAppContainer(AppStackNavigator); //包裹渲染成组件

export class AppNav extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }
  onBackPress = () => {
    const {dispatch, nav} = this.props;
    dispatch(NavigationActions.back());
    return !(nav.index === 0);
  };
  handleNavigationChange = (route, value) => {};
  render() {
    return (
      <StacksOverTab
        ref={navigatorRef => {
          Nav.setTopLevelNavigator(navigatorRef); //设置顶层导航
        }}
        // navigation={addNavigationHelpers({
        //   dispatch: this.props.dispatch,
        //   state: this.props.nav,
        //   addListener, // 关键所在
        // })}
        onNavigationStateChange={this.handleNavigationChange}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppNav);
