import React, { Component } from 'react';
import {
  StyleSheet,
  View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions,
    Navigator,
    ActivityIndicator,
} from 'react-native';
// 组件
import  CommunaNavBar from '../main/GDCommunaNavBar';
import  HalfHourHot from '../hourList/GDHalfHourHot';
import Search from '../home/GDSearch';
import NoDataView from '../main/GDNoDataView';
import CommunaHotCell from '../main/GDCommunaHotCell';
import HTTPBase from '../http/HTTPBase';
//第三方
import {PullList} from 'react-native-pull';

const {width, height} = Dimensions.get('window');

export default class GDHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1!==r2}),
            loaded:false,
        };
        this.fetchData = this.fetchData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    //网络请求的方法
    fetchData(resolve){

        let params = {"count":5}

        HTTPBase.post('http://guangdiu.com/api/getlist.php',params,{})
            .then((responseData)=>{
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                });
                if (resolve !== undefined){
                    setTimeout(()=>{
                        resolve();
                    },1000);
                }
            }).catch((error)=>{

        })
        // let formData = new FormData();
        // formData.append("count","5");
        // formData.append("mall","京东商城");
        // fetch('http://guangdiu.com/api/getlist.php',{
        //     method:'POST',
        //     headers:{},
        //     body:formData,
        // })
        //     .then((response) => response.json())
        //     .then((responseData)=>{
        //         this.setState({
        //             dataSource:this.state.dataSource.cloneWithRows(responseData.data),
        //             loaded:true,
        //         });
        //         if (resolve !== undefined){
        //             setTimeout(()=>{
        //                 resolve();
        //             },1000);
        //         }
        //     })
        //     .done();
    }
  //跳转到半小时热门
    pushToHalfHourHot(){
      this.props.navigator.push({
          component:HalfHourHot,
          animationType:Navigator.SceneConfigs.FloatFromBottom,
      });
    }
    pushToSearch() {
        this.props.navigator.push({
            component: Search,
        });
    }
    renderLeftItem(){
     return(
         <TouchableOpacity onPress={()=>{
             this.pushToHalfHourHot()
         }}>
           <Image source={{uri:'hot_icon_20x20'}} style={styles.navbarLeftItemStyle} />
         </TouchableOpacity>
     );
    }
    renderTitleItem(){
        return(
            <TouchableOpacity>
              <Image source={{uri:'navtitle_home_down_66x20'}} style={styles.navbarTitleItemStyle} />
            </TouchableOpacity>
        );
    }
    renderRightItem(){
      return(
          <TouchableOpacity onPress={()=>{this.pushToSearch()}}>
            <Image source={{uri:'search_icon_20x20'}} style={styles.navbarRightItemStyle} />
          </TouchableOpacity>
      );
    }
    componentDidMount(){
        this.fetchData();
    }
    renderRow(rowData){
        return(
            <CommunaHotCell
                image={rowData.image}
                title={rowData.title}
            />
        );
    }
    loadMore(){
        fetch('http://guangdiu.com/api/gethots.php')
            .then((response) => response.json())
            .then((responseData)=>{
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                });
            })
            .done()
    }

    renderFooter(){
        return (
            <View style={{height:100}}>
                <ActivityIndicator style={{alignItems:'center', justifyContent:'center', marginTop:30}}/>
            </View>
        );
    }
    renderListView(){
        if (this.state.loaded === false){
            return(
                <NoDataView/>
            );
        }else {
            return (
                <PullList
                    onPullRelease={(resolve) => this.fetchData(resolve)}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    showsHorizontalScrollIndicator={false}
                    style={styles.listViewStyle}
                    initialListSize={5}
                    renderHeader={this.renderHeader}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={60}
                    renderFooter={this.renderFooter}
                />
            );
        }
    }
  render() {
    return (
        <View style={styles.container}>
            <CommunaNavBar
              leftItem={()=>this.renderLeftItem()}
              titleItem={()=>this.renderTitleItem()}
              rightItem={()=>this.renderRightItem()}
            />
            {/*根据网络状态决定是否渲染*/}
            {this.renderListView()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
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
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
        width:66,
        height:20,
    },
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight:15,
    },
    listViewStyle:{
        width:width,
    },
});
