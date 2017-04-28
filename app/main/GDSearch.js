import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions,
    ActivityIndicator,
    TextInput,
    Text,
    AsyncStorage,
} from 'react-native';
// 组件
import  CommunaNavBar from './GDCommunalNavBar';
import NoDataView from '../main/GDNoDataView';
import CommunaCell from './GDCommunalCell';
import CommunaDetail from './GDCommunalDetail';
//第三方
import {PullList} from 'react-native-pull';

const {width, height} = Dimensions.get('window');
const  dismissKeyboard = require('dismissKeyboard');//获取键盘弹回方法

export default class GDSearch extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1!==r2}),
            loaded:false,
            isModal:false,
        };
        this.data = [];
        this.changeText = '';
        this.fetchData = this.fetchData.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    //网络请求的方法
    fetchData(resolve){

        if (!this.changeText) return;
        let params = {
            "q":this.changeText,
        };

        HTTPBase.get('http://guangdiu.com/api/getresult.php',params)
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
                let searchLastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('searchLastID',searchLastID.toString());
            }).catch((error)=>{

        })
    }

    //加载更多数据
    loadMoreData(value){

        //读取id
        let params = {
            "q":this.changeText,
            "sinceid":value
        };

        HTTPBase.get('http://guangdiu.com/api/getresult.php',params)
            .then((responseData)=>{
                //拼接数据
                this.data = this.data.concat(responseData.data);

                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(this.data),
                    loaded:true,
                });

                //存储数组的中最后一个元素的ID
                let searchLastID = responseData.data[responseData.data.length - 1].id;
                AsyncStorage.setItem('searchLastID',searchLastID.toString());
            }).catch((error)=>{

        })
    }

    //返回
    pop() {
        //回收键盘
        dismissKeyboard();
        this.props.navigator.pop();
    }

    renderLeftItem(){
        return(
            <TouchableOpacity onPress={()=>{
                this.pop()
            }}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image source={{uri:'back'}} style={styles.navbarLeftItemStyle} />
                    <Text>返回</Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderTitleItem(){
        return(
            <Text style={styles.navbarTitleItemStyle}>搜索全网折扣</Text>
        );
    }

    //加载更多
    loadMore(){
        //读取存储的id
        AsyncStorage.getItem('searchLastID')
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

    render() {
        return (
            <View style={styles.container}>
                <CommunaNavBar
                    leftItem={()=>this.renderLeftItem()}
                    titleItem={()=>this.renderTitleItem()}
                />
                {/*顶部工具栏*/}
                <View style={styles.toolsViewStyle}>
                    {/*输入框*/}
                    <View style={styles.inputViewStyle}>
                        <Image source={{uri:'search_icon_20x20'}} style={styles.searchImageStyle}/>
                        <TextInput
                            style={styles.textInputViewStyle}
                            keyboardType="default"
                            placeholder="请输入搜索关键字"
                            placeholderTextColor='gray'
                            autoFocus={true}
                            clearButtonMode="while-editing"
                            onChangeText={(text) => {this.changeText = text}}
                            onEndEditing={() => this.fetchData()}
                        />
                    </View>
                    {/*右边*/}
                    <View style={{marginRight:8}}>
                       <TouchableOpacity onPress={() => this.pop()}>
                           <Text style={{color:'green'}}>取消</Text>
                       </TouchableOpacity>
                    </View>
                </View>
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
        fontSize:17,
        color:'black',
        marginRight:50
    },
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight:15,
    },
    toolsViewStyle:{
        width:width,
        height:44,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'white',
        justifyContent:'space-between',
    },
    inputViewStyle:{
        height:35,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(239,239,241,1.0)',
        marginLeft:10,
        borderRadius:5,
    },
    searchImageStyle:{
        width:15,
        height:15,
        marginLeft:8,
    },
    listViewStyle:{
        width:width,
    },
    textInputViewStyle:{
        width:width * 0.75,
        height:35,
        marginLeft:8
    }
});

