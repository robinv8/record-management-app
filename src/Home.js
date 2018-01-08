import React, {PropTypes} from 'react';
import {StyleSheet, Text, View, Dimensions, TouchableOpacity, Platform, Image} from 'react-native';
import ModalPicker from 'react-native-modal-selector'
import Toast, {DURATION} from 'react-native-easy-toast'
import {Ionicons} from '@expo/vector-icons';

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

          <View style={{borderBottomWidth: 1, borderBottomColor: '#d6d6d6', height: 40,justifyContent:'center'}}>
            <ModalPicker data={this.state.leftMenu}
                         style={{marginBottom: 10, flex: 1}}
                         selectStyle={{borderWidth: 0, alignItems: 'flex-start'}}
                         cancelText='取消'
                         onChange={(option) => {
                           this.getMenu(option.key);
                           this.setState({name: option.label})
                         }}
                         initValue="选择项目"/>
            <Ionicons name="ios-arrow-dropdown-outline" size={15} color='#838383' style={{position:'absolute',right:13,}}/>
          </View>
          <View style={{borderBottomWidth: 1, borderBottomColor: '#d6d6d6', marginBottom: 10, height: 40,justifyContent:'center'}}>
            <ModalPicker data={this.state.menu}
                         cancelText='取消'
                         style={{marginBottom: 10,flex:1}}
                         selectStyle={{borderWidth: 0, alignItems: 'flex-start'}}
                         onChange={(option) => {
                           this.setState({id: option.id});
                           this.setState({name: option.label})
                         }}
                         initValue="选择标段"/>
            <Ionicons name="ios-arrow-dropdown-outline" size={15} color='#838383' style={{position:'absolute',right:13,}}/>
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
                <Image source={require('../assets/zlck.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>资料查看</Text>
              </TouchableOpacity>
              <View style={[styles.grid_item, styles.item_right]}>
                <Image source={require('../assets/bhgsjtj.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
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
                <Image source={require('../assets/jlsh.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>监理审核</Text>
              </TouchableOpacity>
              <View style={[styles.grid_item, styles.item_right]}>
                <Image source={require('../assets/tjtz.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>统计台账</Text>
              </View>
            </View>
            <View style={styles.grid_wrap}>
              <View style={[styles.grid_item, styles.item_left]}>
                <Image source={require('../assets/qrcode.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>二维码扫描</Text>
              </View>
              <View style={[styles.grid_item, styles.item_right]}>
                <Image source={require('../assets/xcjc.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>现场检测</Text>
              </View>
            </View>
            <View style={styles.grid_wrap}>
              <View style={[styles.grid_item, styles.item_left]}>
                <Image source={require('../assets/setting.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>设置</Text>
              </View>
              <View style={[styles.grid_item, styles.item_right]}>
                <Image source={require('../assets/more.png')} resizeMode={Image.resizeMode.contain}
                       style={{width: 28, height: 28}}/>
                <Text style={styles.item_text}>更多</Text>
              </View>
            </View>
          </View>
          <Toast ref="toast"></Toast>
          <View style={{backgroundColor: 'rgb(0,142,255)', height: 38, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'white'}}>数据@甘肃交通质监局</Text>
          </View>
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
    marginTop: 8,
    color: 'white',
  },
  grid_wrap: {
    flexDirection: 'row',
    height: width * 0.2,
    marginBottom: 12
  }
});
