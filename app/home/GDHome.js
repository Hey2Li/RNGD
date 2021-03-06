import React, { Component } from 'react';
import {
  StyleSheet,
  View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions,
    ActivityIndicator,
    Modal,
    AsyncStorage,
    Navigator
} from 'react-native';
// 组件
import  CommunaNavBar from '../main/GDCommunalNavBar';
import  HalfHourHot from './GDHalfHourHot';
import Search from '../main/GDSearch';
import NoDataView from '../main/GDNoDataView';
import CommunaCell from '../main/GDCommunalCell';
import CommunaDetail from '../main/GDCommunalDetail';
import CommunaSiftMenu from '../main/GDCommunalSiftMenu';
//第三方
import {PullList} from 'react-native-pull';

//数据
import HomeSiftData from '../data/HomeSiftData.json';

const {width, height} = Dimensions.get('window');

export default class GDHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1!==r2}),
            loaded:false,
            isHalfHourHotModal:false,
            isSiftModal:false,
        };
        this.data = [];
        this.fetchData = this.fetchData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }


    //网络请求的方法
    fetchData(resolve){

        let params = {"count":10};

        HTTPBase.get('http://guangdiu.com/api/getlist.php',params)
            .then((responseData)=>{
                //清空数组
                this.data = [];

                //拼接数据
                this.data = this.data.concat(responseData.data);

                //重新渲染
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });

                //关闭加载动画
                if (resolve !== undefined){
                    setTimeout(()=>{
                        resolve();
                    },1000);
                }

                //存储数组的中最后一个元素的ID
                let cnlastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('cnlastID',cnlastID.toString());
                //存储数组中的第一个元素的ID
                let cnfirstID = responseData.data[0].id;
                AsyncStorage.setItem('cnfirstID',cnfirstID.toString());

                //清空本地存储的数据
                RealmBase.removeAllData('HomeData');

                //存储到本地
                RealmBase.create('HomeData', responseData.data);
            }).catch((error)=>{
                //拿到本地存储的的数据展示出来，如果没有数据就显示无数据页面
                this.data = RealmBase.loadAll('HomeData');

                //重新渲染
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                })

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

    //加载更多数据
    loadMoreData(value){

        //读取id

        let params = {
            "count":10,
            "sinceid":value
        };

        HTTPBase.get('http://guangdiu.com/api/getlist.php',params)
            .then((responseData)=>{
                //拼接数据
                this.data = this.data.concat(responseData.data);

                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });

                //存储数组的中最后一个元素的ID
                let cnlastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('cnlastID',cnlastID.toString());
            }).catch((error)=>{

        })
    }

    //网络请求的方法
    loadSiftData(mall, cate){

        let params = {};

        if (mall === "" && cate === ""){
            this.fetchData(undefined);
            return;
        }

        if (mall === ""){ //cate有值
            params = {
                "cate":cate,
            };
        }else {
            params = {
                "mall":mall
            };
        }

        HTTPBase.get('http://guangdiu.com/api/getlist.php',params)
            .then((responseData)=>{
                //清空数组
                this.data = [];

                //拼接数据
                this.data = this.data.concat(responseData.data);

                //重新渲染
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });

                //关闭加载动画
                if (resolve !== undefined){
                    setTimeout(()=>{
                        resolve();
                    },1000);
                }

                //存储数组的中最后一个元素的ID
                let cnlastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('cnlastID',cnlastID.toString());

            }).catch((error)=>{

        })
    }

    //跳转到半小时热门
    pushToHalfHourHot(){
        this.setState({
            isHalfHourHotModal:true,
        })
      // this.props.navigator.push({
      //     component:HalfHourHot,
      //     animationType:Navigator.SceneConfigs.FloatFromBottom,
      // });
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

    //显示筛选菜单
    showSiftMenu() {
        this.setState({
            isSiftModal:true,
        });
    }


    renderTitleItem(){
        return(
            <TouchableOpacity
                onPress={() => {this.showSiftMenu()}}
            >
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

    //加载更多
    loadMore(){
        //读取存储的id
        AsyncStorage.getItem('cnlastID')
            .then((value)=>{
                //数据加载操作
                this.loadMoreData(value);
            })
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

    pushToDetail(value){
        this.props.navigator.push({
            component:CommunaDetail,
            params:{
                url:'http://guangdiu.com/go.php' + '?' + 'id=' + value,
            }
        });
    }

    //填充cell
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>this.pushToDetail(rowData.id)}>
                <CommunaCell
                    image={rowData.image}
                    title={rowData.title}
                    mall={rowData.mall}
                    pubTime={rowData.pubtime}
                    fromSite={rowData.fromsite}
                />
            </TouchableOpacity>
        );
    }

    onRequestClose(){
        this.setState({
            isHalfHourHotModal:false,
            isSiftModal:false,
        })
    }
    closeModal(data){
        this.setState({
            isHalfHourHotModal:data,
            isSiftModal:false,
        })
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

                {/*初始化近半小时热门*/}
                <Modal
                    animationType='slide'
                    translucent={false}
                    visible={this.state.isHalfHourHotModal}
                    onRequestClose={() => this.onRequestClose()}
                >
                    <Navigator
                        initialRoute={{
                            name:'halfHourHot',
                            component:HalfHourHot
                        }}

                        renderScene={(route, navigator = {})=>{
                            let Component = route.component;
                            return <Component
                                removeModal={(data)=>this.closeModal(data)}
                                {...route.params}
                                navigator={navigator}/>
                        }}
                    />
                </Modal>

                {/*初始化筛选菜单*/}
                <Modal
                    pointerEvents={'box-none'}
                    animationType='none'
                    translucent={true}
                    visible={this.state.isSiftModal}
                    onRequestClose={() => this.onRequestClose()}
                >
                    <CommunaSiftMenu
                        removeModal={(data)=>this.closeModal(data)}
                        data={HomeSiftData}
                        loadSiftData = {(mall, cate) => this.loadSiftData(mall, cate)}/>
                </Modal>
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

