import React from 'react'
import {View, Text, FlatList, TouchableNativeFeedback, TouchableOpacity, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {SecureStore} from 'expo';
import Toast, {DURATION} from 'react-native-easy-toast'

export default class Record_1 extends React.Component {
  static navigationOptions = ({navigation}) => {
    if (navigation.state.params.deep > 1) {
      return {
        title: navigation.state.params.text,
      }
    } else {
      return {
        title: navigation.state.params.showType === 1 ? '监理审核' : '资料查看'
      }
    }
  }

  constructor() {
    super();
    this.state = {
      listData: [],
      isDetail: false,
      reportList: [],
      listView: [],
      refreshing: false,
      showType: 0,
      page: 1,
      limit: 10,
      noRecord: false
    }
  }

  componentWillMount() {
    const {params} = this.props.navigation.state;
    this.getMenu(params.pid, params.id);
  }

  /**
   * 审核
   * @param id sqlId
   * @param type 1通过 0不通过
   */
  audit(type) {
    const items = this.state.reportList.filter(item => item.checked);
    if (items.length < 1) {
      this.refs.toast.show('请选择要操作的记录！');
      return;
    }
    const ids = items.map(item => item.SQLID + '*#*');
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json; charset=utf-8');
    fetch('http://61.178.231.106:9725/RightMain/AuditReport', {
      method: 'post',
      body: JSON.stringify({
        AuditId: ids.toString().replace(/,/g, ''),
        Type: type
      }),
      headers: myHeaders
    }).then(result => {
      if (result._bodyText) {
        this.componentWillMount();
      }
    })
  }

  async getReportList(id, page, showType, limit, start) {
    const {params} = this.props.navigation.state;
    showType = params.showType || '';
    const result = await fetch(`http://61.178.231.106:9725/RightMain/GetReportList?id=${id}&showType=${showType || 0}&page=${page || 1}&start=${start || 0}$limit=${limit || 15}`).then(result => result);
    if (result._bodyText) {
      let newResult = JSON.parse(result._bodyText).rows.map(item => {
        item.key = item.GUID;
        return item;
      });
      if (page > 1) {
        newResult = this.state.reportList.map(item => item);
        this.setState({
          reportList: newResult,
          noRecord: newResult.length <= 0
        })

      } else {
        this.setState({
          reportList: newResult,
          noRecord: newResult.length <= 0
        })
      }

    }
  }

  check(index) {
    const newList = this.state.reportList;
    newList[index].checked = !newList[index].checked;
    this.setState({reportList: newList});
  }

  allCheck() {
    const newList = this.state.reportList;
    newList.map(item => {
      item.checked = !item.checked;
      return item
    });
    this.setState({reportList: newList});
  }

  getListView(item, index) {
    const {navigate, state} = this.props.navigation;
    let CheckPassText = '';
    switch (item.CheckPass) {
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
    return <View style={{
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
      backgroundColor: 'rgb(242,239,239)',
      marginTop: 5,
      marginBottom: 2.5
    }}>
      <View style={{flex: 4, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity
            style={{flex: 1, alignItems: 'center', display: state.params.showType === 1 ? 'flex' : 'none'}}
            onPress={() => this.check(index)}>
          <Image source={item.checked ? require('../assets/checked.png') : require('../assets/uncheck.jpg')}
                 resizeMode={Image.resizeMode.contain} style={{width: 20}}/>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 4, flexDirection: 'row', alignItems: 'center'}} onPress={() => {
          const myHeaders = new Headers();
          myHeaders.append('Content-Type', 'application/json; charset=utf-8');
          fetch('http://61.178.231.106:9725/RightMain/GetReportUrl', {
            method: 'post',
            headers: myHeaders,
            body: JSON.stringify({
              SQLID: item.SQLID,
              type: 1
            })
          }).then(result => {
            if (result._bodyText) {
              result = JSON.parse(result._bodyText);
              if (result.success) {
                navigate('Report', {
                  id: item.SQLID,
                  CheckPass: item.CheckPass
                })
              }
            }
          })
        }}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
                style={{color: item.CheckPass === 1 ? 'rgb(0,133,72)' : '#59a5ef'}}>{CheckPassText}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <Text
                style={{color: item.CheckPass === 1 ? 'rgb(0,133,72)' : 'red'}}>{item.CheckPass === 1 ? (item.Num === 0 || item.Num === 1 ? 100 : (100 / item.Num).toFixed(2)) : 0.00}%</Text>
          </View>
          <View style={{flex: 2, alignItems: 'center'}}>
            <Text style={{color: 'rgb(0,0,0)'}}>{item.RepName}</Text>
          </View>
        </TouchableOpacity>

      </View>

      <TouchableOpacity onPress={() => navigate('RecordDetail', {record: item})}
                        style={{flex: 1, alignItems: 'center', height: 50, justifyContent: 'center'}}>
        <View style={{
          width: 18,
          height: 18,
          borderRadius: 18,
          borderWidth: 2,
          borderColor: '#5a5d5a',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Ionicons name="md-more" size={14}/>
        </View>
      </TouchableOpacity>
    </View>
  }

  addMore() {
    this.setState({page: this.state.page + 1});
    this.getReportList(this.state.reportId, this.state.page)

  }

  async getMenu(pid, id) {
    const result = await fetch(`http://61.178.231.106:9725/Home/GetMenus?PrjID=${pid}&node=${id}`)
        .then(result => result);
    if (result._bodyText) {
      const newResult = JSON.parse(result._bodyText).map(item => {
        item.key = item.id;
        return item;
      });
      this.setState({listData: newResult});
    } else {
      this.getReportList(id);
      this.setState({isDetail: true, reportId: id})
    }
  }

  refresh() {
    this.getReportList(this.state.reportId);
  }

  render() {
    const {navigate} = this.props.navigation;
    const {params} = this.props.navigation.state;
    let backColor = '';
    switch (params.deep) {
      case 1:
        backColor = 'rgb(15,168,55)';
        break;
      case 2:
        backColor = 'rgb(222,159,24)';
        break;
      case 3:
        backColor = '#3cc8bd';
        break;
      case 4:
        backColor = '#577bd6'
        break;
      default:
        backColor = 'red'

    }
    if (!this.state.isDetail) {
      return (<FlatList data={this.state.listData}
                        renderItem={({item}) =>
                            <TouchableNativeFeedback
                                onPress={async () => {
                                  let bdc = await SecureStore.getItemAsync('bd-content') || [];

                                  bdc = typeof bdc === 'object' ? bdc : bdc.split(',');
                                  bdc.push(item.text);
                                  await SecureStore.setItemAsync('bd-content', bdc.toString());
                                  navigate('Record_1', {
                                    pid: params.pid,
                                    id: item.key,
                                    text: item.text,
                                    deep: params.deep + 1,
                                    showType: params.showType
                                  })
                                }}>
                              <View style={{
                                height: 50,
                                marginLeft: 12,
                                marginRight: 12,
                                borderBottomWidth: 0.5,
                                borderBottomColor: '#cacaca',
                                alignItems: 'center',
                                flexDirection: 'row'
                              }}>
                                <View style={{
                                  width: 17,
                                  height: 17,
                                  backgroundColor: `${backColor}`,
                                  borderRadius: 17,
                                  marginRight: 5
                                }}/>
                                <Text>{item.text}</Text>
                              </View>
                            </TouchableNativeFeedback>

                        }/>)
    }
    if (this.state.noRecord) {
      return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>暂无记录！</Text>
      </View>
    }
    let auditView = [];
    if (params.showType === 1) {
      auditView = <View style={{flexDirection: 'row'}}>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 40}}
                          onPress={() => this.audit(1)}>
          <Text style={{color: '#59a5ef'}}>审核通过</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 40}}
                          onPress={() => this.audit(0)}>
          <Text>审核不通过</Text>
        </TouchableOpacity>
      </View>
    }
    return (
        <View style={{flex: 1}}>
          <View style={{flexDirection: 'row', height: 35, alignItems: 'center', backgroundColor: 'rgb(119,119,119)',}}>
            <TouchableOpacity style={{flex: 1, alignItems: 'center', display: params.showType === 1 ? 'flex' : 'none'}}
                              onPress={() => this.allCheck()}>
              <Image
                  resizeMode={Image.resizeMode.contain} style={{width: 20}}
                  source={(this.state.reportList.length > 0 && this.state.reportList.filter(item => !item.checked).length < 1 ) ? require('../assets/checked.png') : require('../assets/uncheck.jpg')}/>
            </TouchableOpacity>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>资料状态</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>合格率</Text>
            </View>
            <View style={{flex: 2, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>资料名称</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{color: 'white'}}>详情</Text>
            </View>
          </View>

          <FlatList
              onRefresh={() => this.refresh()}
              refreshing={this.state.refreshing}
              onEndReachedThreshold={0.1}
              onEndReached={() => this.addMore()}
              style={{backgroundColor: 'white'}} data={this.state.reportList}
              renderItem={({item, index}) => this.getListView(item, index)}/>
          {auditView}
          <Toast ref="toast"></Toast>
        </View>
    );
  }
}