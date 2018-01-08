import React from 'react';
import {WebView, View, Text,Dimensions} from 'react-native';

export default class Report extends React.Component {
  constructor() {
    super();
  }

  render() {
    const {id,CheckPass} = this.props.navigation.state.params;
    let CheckPassText = '';
    switch (CheckPass) {
      case 1:
        CheckPassText = "审核通过";
        break
      case 2:
        CheckPassText = "审核未通过";
        break
      case 3:
        CheckPassText = "已删除";
        break
      case 99:
        CheckPassText = "未通过已撤回";
        break
      case 100:
        CheckPassText = "重新上传";
        break
      default:
        CheckPassText = "未审核";
    }
    return (
        <View style={{flex: 1}}>
          <WebView
              source={{uri: `http://61.178.231.106:9725/TempFile/${id}.html`}}
              scalesPageToFit={true}
          />
          <View style={{alignItems: 'center', height: 40, justifyContent: 'center'}}>
            <Text>{CheckPassText}</Text>
          </View>
        </View>

    )
  }
}