/**
 * Created by Tebuy on 2017/4/21.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ListView,
    DeviceEventEmitter,
    Dimensions,
    Navigator
} from 'react-native';

import CommunaNavBar from '../main/GDCommunalNavBar';
import CommunaHotCell from '../main/GDCommunalHotCell';
import NoDataView from '../main/GDNoDataView';
import CommunaDetail from '../main/GDCommunalDetail';

import {PullList} from 'react-native-pull';

const {width, height} = Dimensions.get('window');

export default class GDUSHalfHourHot extends Component {

    constructor(props){
        super(props);
        //初始状态
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1!==r2}),
            loaded:false,
        };
        this.fetchData = this.fetchData.bind(this);
    }

    //
    static defaultProps = {
        removeModal:{}
    }

    //网络请求的方法
    fetchData(resolve){
        let params = {
          "c":"us"
        };
        HTTPBase.get('http://guangdiu.com/api/gethots.php',params)
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
            });
    }

    pushToDetail(value){
        this.props.navigator.push({
            component:CommunaDetail,
            params:{
                url:'http://guangdiu.com/go.php' + '?' + 'id=' + value,
            }
        });
    }
    //返回每一行cell的样式
    renderRow(rowData){
        return(
            <TouchableOpacity onPress={()=>this.pushToDetail(rowData.id)}>
                <CommunaHotCell
                    image={rowData.image}
                    title={rowData.title}
                />
            </TouchableOpacity>
        );
    }

    componentWillMount(){
        DeviceEventEmitter.emit('isHiddenTabBar',true);
    }

    componentWillUnmount(){
        DeviceEventEmitter.emit('isHiddenTabBar',false);
    }
    componentDidMount(){
        this.fetchData();
    }
    popToHome(data) {
        this.props.removeModal(data);
        // this.props.navigator.pop();
    }
    renderTitleItem(){
        return(
            <Text style={styles.navbarTitleItemStyle}>近半小时热门</Text>
        );
    }
    renderRightItem(){
        return(
            <TouchableOpacity onPress={()=>this.popToHome(false)}>
                <Text style={styles.navbarRightItemStyle}>关闭</Text>
            </TouchableOpacity>
        );
    }
    //返回ListView的头部
    renderHeader(){
        return(
            <View style={styles.headerPromptStyle}>
                <Text>根据每条折扣的点击进行统计，每5分钟更新一次</Text>
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
                />
            );
        }
    }

    render(){
        return (
            <View style={styles.container}>
                <CommunaNavBar
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
        backgroundColor:'white',
    },
    navbarTitleItemStyle:{
        fontSize:17,
        color:'black',
        marginLeft:50
    },
    navbarRightItemStyle:{
        fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight:15
    },
    listViewStyle:{
        width:width,
    },
    headerPromptStyle:{
        height:44,
        width:width,
        backgroundColor:'rgba(239,239,239,0.5)',
        alignItems:'center',
        justifyContent:'center',
    }
});

