import React from 'react';
import {Platform} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Home from './src/Home';
import Login from './src/Login';
import Record_1 from './src/Record_1';
import RecordDetail from './src/RecordDetail';
import Report from './src/Report'

const App = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  Home: {
    screen: Home,
    navigationOptions: {
      headerTitle: '甘肃省公路工程档案资料管理系统',
      headerStyle: {
        marginTop: Platform.OS === 'ios' ? 0 : 25,
        backgroundColor: '#1f1f1f',
      },
      headerTintColor: 'white'
    }
  },
  Record_1: {
    screen: Record_1,
    navigationOptions: {
      headerStyle: {
        marginTop: Platform.OS === 'ios' ? 0 : 25,
        backgroundColor: '#1f1f1f'
      },
      headerTintColor: 'white'
    }
  },
  RecordDetail: {
    screen: RecordDetail,
    navigationOptions: {
      headerTitle: '资料详情',
      headerStyle: {
        marginTop: Platform.OS === 'ios' ? 0 : 25,
        backgroundColor: '#1f1f1f',
      },
      headerTintColor: 'white'
    }
  },
  Report: {
    screen: Report,
    navigationOptions: {
      headerTitle: '检查记录表',
      headerStyle: {
        marginTop: Platform.OS === 'ios' ? 0 : 25,
        backgroundColor: '#1f1f1f',
      },
      headerTintColor: 'white'
    }
  }
});

export default App;
