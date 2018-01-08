import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class RecordDetail extends React.Component {
  render() {
    const {record} = this.props.navigation.state.params;
    return (
        <View style={{backgroundColor: 'white'}}>
          <View style={styles.tr}>
            <View>
              <Text>资料名称</Text>
            </View>
            <View style={{paddingLeft: 48,flex:1}}>
              <Text>{record.RepName}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text>部位</Text>
            </View>
            <View style={{marginLeft: 48}}>
              <Text>{record.PrjBW}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text>建表日期</Text>
            </View>
            <View style={{marginLeft: 48}}>
              <Text>{record.CreateDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text>编辑日期</Text>
            </View>
            <View style={{marginLeft: 48}}>
              <Text>{record.EditDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text>完成日期</Text>
            </View>
            <View style={{marginLeft: 48}}>
              <Text>{record.WGRQ}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text>审核时间</Text>
            </View>
            <View style={{marginLeft: 48}}>
              <Text>{record.JLCheckDT}</Text>
            </View>
          </View>
          <View style={styles.tr}>
            <View>
              <Text>审核人</Text>
            </View>
            <View style={{marginLeft: 48}}>
              <Text>{record.CheckXM}</Text>
            </View>
          </View>
        </View>
    )
  }
}
const styles = StyleSheet.create({
  tr: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    backgroundColor: 'rgb(242,239,239)',
    marginTop: 5,
    marginBottom: 2.5,
    paddingLeft: 12,
    paddingRight: 12,
  }
})