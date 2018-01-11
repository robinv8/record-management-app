import React from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native';
import {SecureStore} from 'expo';
import {Ionicons} from '@expo/vector-icons';

export default class RecordDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      fbfx: '',// 所属分部分项,
      sqlId: ''
    }
  }

  static navigationOptions = ({navigation}) => {
    return {
      headerRight: <TouchableOpacity onPress={() => navigation.navigate('HistoryAudit', {SQLID: navigation.state.params.record.SQLID})}
                                     style={{
                                       flex: 1,
                                       alignItems: 'center',
                                       width: 50,
                                       height: 50,
                                       justifyContent: 'center'
                                     }}>
        <Ionicons name="md-time" size={25} color={'white'}/>
      </TouchableOpacity>
    }
  };
  componentDidMount = async () => {

    let bdc = (await SecureStore.getItemAsync('bd-content')).split(',');
    const projectName = await SecureStore.getItemAsync('projectName');
    const biaoduan = await SecureStore.getItemAsync('biaoduan');
    bdc.splice(0, 0, biaoduan);
    bdc.splice(0, 0, projectName);
    bdc = bdc.toString().replace(/,/g, '>');
    this.setState({
      fbfx: bdc,
    })
  }

  render() {
    const {record} = this.props.navigation.state.params;
    return (
        <View style={{backgroundColor: 'white'}}>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>资料名称</Text>
            </View>
            <View style={{paddingLeft: 48, flex: 1}}>
              <Text>{record.RepName}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>部位</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.PrjBW}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>建表日期</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.CreateDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text style={{width: 60}}>编辑日期</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.EditDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>完成日期</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.WGRQ}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>上传时间</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.SendDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>审核时间</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.JLCheckDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>审核人</Text>
            </View>
            <View style={{paddingLeft: 48}}>
              <Text>{record.CheckXM}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View style={{width: 60}}>
              <Text>所属分部分项</Text>
            </View>
            <View style={{paddingLeft: 48, flex: 1}}>
              <Text>{this.state.fbfx}</Text>
            </View>
          </View>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  tr: {
    flexDirection: 'row',
    minHeight: 50,
    alignItems: 'center',
    backgroundColor: 'rgb(242,239,239)',
    marginTop: 5,
    marginBottom: 2.5,
    paddingLeft: 12,
    paddingRight: 12,
  }
})