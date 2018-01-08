import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Ionicons} from '@expo/vector-icons';
import {NavigationActions} from 'react-navigation';
import Toast, {DURATION} from 'react-native-easy-toast'
import Store from 'react-native-store';

const {width} = Dimensions.get('window');
const DB = {
  'login': Store.model('login'),
}
export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      userName: '',
      userPwd: '',
      checkedView: [],
      checkStatus: false
    }

  }

  componentDidMount() {
    // Return all items
    DB.login.find().then(resp => this.setState({userName: resp.userName}));
  }

  login() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json; charset=utf-8');
    fetch(`http://61.178.231.106:9725/Home/Login?ran=${Math.random()}`, {
      method: 'post',
      headers: myHeaders,
      mode: 'cors',
      body: JSON.stringify({
        userName: this.state.userName,
        userPwd: this.state.userPwd
      })
    }).then(response => {
      const json = JSON.parse(response._bodyText);
      if (json.result) {
        DB.login.add({
          userName: this.state.userName,
        })
        if (this.state.checkStatus) {
          DB.login.add({
            userPwd: this.state.userPwd
          })
        } else {

        }

        //this.toHome();
      } else {
        this.refs.toast.show(json.msg);
      }
    })
  }

  check() {
    this.setState({
      checkedView: !this.state.checkStatus ? <Ionicons name="ios-checkmark-outline" size={18} color='white'/> : [],
      checkStatus: !this.state.checkStatus
    })
  }

  toHome() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({routeName: 'Home'})],
    });

    this.props.navigation.dispatch(resetAction);
  }

  render() {

    return (
        <View style={styles.container}>
          <KeyboardAwareScrollView style={styles.title_wrap}>
            <View style={{marginBottom: 50}}>
              <Image source={require('../assets/title.png')} resizeMode={Image.resizeMode.contain}
                     style={{width: width - 100}}></Image>
            </View>
            <View style={[styles.input_wrap, {marginBottom: 12}]}>
              <View style={{
                width: 42,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1
              }}>
                <Ionicons name="md-person" size={24}/>
              </View>
              <View style={{flex: 1, paddingLeft: 42}}>
                <TextInput style={{height: 42, padding: 0,}}
                           onChangeText={(userName) => this.setState({userName})}
                           value={this.state.userName} placeholder="请输入您的账户"
                           underlineColorAndroid='transparent'></TextInput>
              </View>
            </View>
            <View style={[styles.input_wrap, {marginBottom: 12}]}>
              <View style={{
                width: 42,
                height: 42,
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                zIndex: 1
              }}>
                <Ionicons name="md-lock" size={24}/>
              </View>
              <View style={{flex: 1, paddingLeft: 42}}>
                <TextInput style={{height: 42, padding: 0}}
                           onChangeText={(userPwd) => this.setState({userPwd})}
                           value={this.state.userPwd} placeholder="请输入您的密码"
                           underlineColorAndroid='transparent'></TextInput>
              </View>
            </View>
            <TouchableWithoutFeedback onPress={() => this.check()}>
              <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                <View style={{
                  width: 12,
                  height: 12,
                  borderWidth: 1,
                  borderColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {this.state.checkedView}
                </View>
                <Text style={{color: 'white', marginLeft: 5}}>记住密码</Text>
              </View>
            </TouchableWithoutFeedback>
            <View style={{flex: 1, flexDirection: 'row', height: 42, marginTop: 12}}>
              <TouchableOpacity onPress={() => this.login()}
                                style={[styles.button, {flex: 2, marginRight: 3}]}>
                <Text style={styles.buttonText}>登录</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      userName: '',
                      userPwd: ''
                    })
                  }}
                  style={[styles.button, {flex: 1}]}>
                <Text style={styles.buttonText}>重置</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
          <Toast ref="toast"></Toast>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008cff',
  },
  title_wrap: {
    flex: 1,
    paddingTop: 80,
    paddingLeft: 50,
    paddingRight: 50
  },
  text_1: {
    letterSpacing: 1,
    color: '#bf1717',
    fontSize: 25,
    marginBottom: 22
  },
  text_2: {
    letterSpacing: 1,
    color: '#bf1717',
    fontWeight: 'bold',
    fontSize: 32
  },
  input_wrap: {
    height: 42,
    flex: 1,
    backgroundColor: 'white'
  },
  button: {
    height: 42,
    backgroundColor: 'rgb(4,50,144)',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
});
