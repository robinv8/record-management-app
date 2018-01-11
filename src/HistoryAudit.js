import React from 'react';
import {View, Text, FlatList, TouchableNativeFeedback, TouchableOpacity, Image} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export default class HistoryAudit extends React.Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      reportList: [],
      noRecord: false,
      visible: true
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;
    this.getAuditList(params.SQLID);
  }

  async getAuditList(id, page, limit, start) {
    const result = await fetch(`http://61.178.231.106:9725/RightMain/GetAuditList?SQLID=${id}&page=${page || 1}&start=${start || 0}$limit=${limit || 15}`).then(result => result);
    if (result._bodyText) {
      let newResult = JSON.parse(result._bodyText).rows.map(item => {
        item.key = item.SQLID;
        return item;
      });
      if (page > 1) {
        newResult = this.state.reportList.map(item => item);
        this.setState({
          reportList: newResult,
          noRecord: newResult.length <= 0,
          visible: false
        })

      } else {
        this.setState({
          reportList: newResult,
          noRecord: newResult.length <= 0,
          visible: false
        })
      }

    }
  }

  getListView(item, index) {
    const {navigate, state} = this.props.navigation;
    let CheckPassText = '';
    switch (item.CheckPass) {
      case 1:
        CheckPassText = "合格";
        break
      default:
        CheckPassText = "不合格";
    }
    return <View style={{
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      backgroundColor: 'rgb(242,239,239)',
      marginTop: 5,
      marginBottom: 2.5
    }}>
      <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text
              style={{color: item.CheckPass === 1 ? 'rgb(0,133,72)' :item.CheckPass === 0?'#013cc1': '#c40000'}}>{CheckPassText}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text>{item.CheckXM}</Text>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <Text style={{color: 'rgb(0,0,0)'}}>{item.JLCheckDT}</Text>
        </View>

      </View>
    </View>
  }

  refresh() {
    const {params} = this.props.navigation.state;
    this.getAuditList(params.SQLID);
  }

  addMore() {
    const {params} = this.props.navigation.state;
    this.setState({page: this.state.page + 1});
    this.getReportList(tparams.SQLID, this.state.page)
  }

  render() {
    if (this.state.visible) {
      return (
          <Spinner visible={true} textContent={"加载中……"} textStyle={{color:'#000',fontSize:15}}></Spinner>
      );
    }
    if (this.state.noRecord) {
      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>暂无记录！</Text>
      </View>
    }
    return (
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', height: 35, alignItems: 'center', backgroundColor: 'rgb(119,119,119)',}}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>合格资料</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>审核人</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>审核时间</Text>
            </View>
          </View>

          <FlatList
              onRefresh={() => this.refresh()}
              refreshing={this.state.refreshing}
              onEndReachedThreshold={0.1}
              onEndReached={() => this.addMore()}
              style={{backgroundColor: 'white'}} data={this.state.reportList}
              renderItem={({item, index}) => this.getListView(item, index)}/>
        </View>
    );
  }
}