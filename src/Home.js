import React, {PropTypes} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform} from 'react-native';
import ModalPicker from 'react-native-modal-selector'
import Toast, {DURATION} from 'react-native-easy-toast'

const {width} = Dimensions.get('window');
export default class Home extends React.Component {


  constructor() {
    super();
    this.state = {
      name: '',
      leftMenu: [],
      menu: [],
    }
    this.getLeftMenus()
  }

  async getLeftMenus() {
    const result = await fetch('http://61.178.231.106:9725/Home/GetLeftMenus?node=root').then(result => result);
    const newResult = JSON.parse(result._bodyText)[0].children[0].children.map(item => {
      item.key = item.id;
      item.label = item.text;
      return item;
    });
    this.setState({
      leftMenu: newResult,
      menu: []
    })

  }

  async getMenu(pid) {
    const result = await fetch(`http://61.178.231.106:9725/Home/GetMenus?PrjID=${pid}&node=root`)
        .then(result => result);
    const newResult = JSON.parse(result._bodyText)[0].children.map(item => {
      item.key = item.id;
      item.label = item.text;
      return item;
    });
    this.setState({
      menu: newResult,
      pid: pid
    })
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
        <View style={styles.container}>
          <View>
            <ModalPicker data={this.state.leftMenu}
                         onChange={(option) => {
                           this.getMenu(option.key);
                           this.setState({name: option.label})
                         }}
                         initValue="选择项目"/>
          </View>
          <View>
            <ModalPicker data={this.state.menu}
                         onChange={(option) => {
                           this.setState({id: option.id});
                           this.setState({name: option.label})
                         }}
                         initValue="选择标段"/>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.grid_wrap}>
              <TouchableOpacity style={[styles.grid_item, styles.item_left]}
                                onPress={() => {
                                  const {pid, id} = this.state;
                                  if (pid && id) {
                                    navigate('Record_1', {pid: pid, id: id, deep: 1})
                                  } else {
                                    this.refs.toast.show('请选择项目和标段！');
                                  }
                                }}>
                <Text style={styles.item_text}>资料查看</Text>
              </TouchableOpacity>
              <View style={[styles.grid_item, styles.item_right]}>
                <Text style={styles.item_text}>不合格数据统计</Text>
              </View>
            </View>
            <View style={styles.grid_wrap}>
              <TouchableOpacity onPress={() => {
                const {pid, id} = this.state;
                if (pid && id) {
                  navigate('Record_1', {pid: pid, id: id, deep: 1, showType: 1})
                } else {
                  this.refs.toast.show('请选择项目和标段！');
                }
              }} style={[styles.grid_item, styles.item_left]}>
                <Text style={styles.item_text}>监理审核</Text>
              </TouchableOpacity>
              <View style={[styles.grid_item, styles.item_right]}>
                <Text style={styles.item_text}>统计台账</Text>
              </View>
            </View>
            <View style={styles.grid_wrap}>
              <View style={[styles.grid_item, styles.item_left]}>
                <Text style={styles.item_text}>二维码扫描</Text>
              </View>
              <View style={[styles.grid_item, styles.item_right]}>
                <Text style={styles.item_text}>现场抢修</Text>
              </View>
            </View>
            <View style={styles.grid_wrap}>
              <View style={[styles.grid_item, styles.item_left]}>
                <Text style={styles.item_text}>设置</Text>
              </View>
              <View style={[styles.grid_item, styles.item_right]}>
                <Text style={styles.item_text}>更多</Text>
              </View>
            </View>
          </View>
          <Toast ref="toast"></Toast>

        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid_item: {
    backgroundColor: 'rgb(0,142,255)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  item_left: {
    marginLeft: 12,
    marginRight: 6
  },
  item_right: {
    marginRight: 12,
    marginLeft: 6
  },
  item_text: {
    color: 'white'
  },
  grid_wrap: {
    flexDirection: 'row',
    height: width * 0.2,
    marginBottom: 12
  }
});
