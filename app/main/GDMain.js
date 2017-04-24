import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  Image,
  DeviceEventEmitter,
    AsyncStorage,

} from 'react-native';
import TabNavigator from 'react-native-tab-navigator';
import Home from '../home/GDHome';
import HT from '../ht/GDHt';
import HourList from '../hourList/GDHourList';
import HTTPBase from '../http/HTTPBase';

export default class RNGD extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedTab:'home',
        isHiddenTabBar:false,
        cnBadgeText:'',
        usBadgeText:''
    };

  }
  //设置跳转动画
    setNavAnimationType(route){
      if (route.animationType){
          let conf = route.animationType;
          //关闭手势操作
          conf.gestures = null;
          return conf;
      }else {
          return Navigator.SceneConfigs.PushFromRight;
      }
    }
  //返回TabBar
  renderTabBarItem(title, selectedTab, image, selectedImage, component,badgeText){
      return(
        <TabNavigator.Item
            selected={this.state.selectedTab === selectedTab}
            title={title}
            renderIcon={() => <Image source={{uri:image}} style={styles.tabbarIconStyle}/>}
            renderSelectedIcon={() => <Image source={{uri:selectedImage}} style={styles.tabbarIconStyle}/>}
            onPress={() => this.setState({ selectedTab: selectedTab })}
            badgeText={badgeText == 0 ? '' : badgeText}
        >
             <Navigator
              initialRoute={{
                name:selectedTab,
                component:component
              }}

              configureScene={(route)=> this.setNavAnimationType(route)}
              renderScene={(route, navigator) =>{
                  let Component = route.component;
                  return <Component {...route.params} navigator = {navigator}/>
              }}
          />
        </TabNavigator.Item>
      );
    }
  render() {
    return (
      <TabNavigator
        tabBarStyle={this.state.isHiddenTabBar !== true ? {}:{height:0, overflow:'hidden'}}
        sceneStyle={this.state.isHiddenTabBar !== true ? {}:{paddingBottom:0}}
      >
        {this.renderTabBarItem("首页",'home','tabbar_home_30x30','tabbar_home_selected_30x30',Home,this.state.cnBadgeText)}
        {this.renderTabBarItem("海淘",'ht','tabbar_abroad_30x30','tabbar_abroad_selected_30x30',HT,this.state.usBadgeText)}
        {this.renderTabBarItem("小时风云榜",'hourlist','tabbar_rank_30x30','tabbar_rank_selected_30x30',HourList)}
      </TabNavigator>
    );
  }

    tongZhi(data){
      this.setState({
          isHiddenTabBar:data,
      });
    }
  componentDidMount(){
        //注册通知
      this.subscription = DeviceEventEmitter.addListener('isHiddenTabBar',data => {this.tongZhi(data)});

      let cnfirstID = 0;
      let usfirstID = 0;

      //定时器
      setInterval(() => {
          //取出id
          AsyncStorage.getItem('cnfirstID')
              .then((value)=>{
                  cnfirstID = parseInt(value);
              });
          AsyncStorage.getItem('usfirstID')
              .then((value)=>{
                  usfirstID = parseInt(value);
              });

          if (cnfirstID !== 0 && usfirstID !== 0){
              //拼接参数
              let params = {
                  "cnmaxid":cnfirstID,
                  "usmaxid":usfirstID,
              }

              //网络请求
              HTTPBase.get('http://guangdiu.com/api/getnewitemcount.php',params)
                  .then((responseData)=>{
                        this.setState({
                            cnBadgeText:responseData.cn,
                            usBadgeText:responseData.us,
                        });
                        console.log(responseData);
                  })
          }
      },30000);
    }
  componentWillUnmount(){
      this.subscription.remove();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  tabbarIconStyle:{
    height:30,
    width:30,
  }
});

