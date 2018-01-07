import React from 'react';
import {WebView,View,Text} from 'react-native';

export default class Report extends React.Component {
  render() {
    const {id} = this.props.navigation.state.params;
    return (
        <View style={{flex:1}}>
          <WebView
              source={{uri: `http://61.178.231.106:9725/TempFile/${id}.html`}}
              scalesPageToFit={true}
              style={{flex:1}}
          />
          <View style={{alignItems:'center',height:40,justifyContent:'center'}}>
            <Text>审核通过</Text>
          </View>
        </View>

    )
  }
}