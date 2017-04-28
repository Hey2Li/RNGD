import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ListView,
    Dimensions,
    ActivityIndicator,
    Text,
    AsyncStorage,
    Navigator
} from 'react-native';
// 组件
import  CommunaNavBar from '../main/GDCommunaNavBar';
import NoDataView from '../main/GDNoDataView';
import CommunaCell from '../main/GDCommunaCell';
import CommunaDetail from '../main/GDCommunaDetail';
import Setting from '../hourList/GDSetting';

//第三方
import {PullList} from 'react-native-pull';

const {width, height} = Dimensions.get('window');

export default class GDHourList extends Component {
    constructor(props){
        super(props);
        this.state = {
            dataSource:new ListView.DataSource({rowHasChanged:(r1, r2) => r1!==r2}),
            loaded:false,
            prompt:'',
        };

        this.nexthourhour = '';     // 下一小时时间
        this.nexthourdate = '';     // 下一小时日期
        this.lasthourhour = '';     // 上一小时时间
        this.lasthourdate = '';     // 上一小时日期

        this.data = [];
        this.fetchData = this.fetchData.bind(this);
    }

    //网络请求的方法
    fetchData(resolve, date, hour){

        let params = {};

        if (date) {
            params = {
                "date":date,
                "hour":hour,
            }
        }

        HTTPBase.get('http://guangdiu.com/api/getranklist.php',params)
            .then((responseData)=>{

                //重新渲染
                this.setState({
                    dataSource:this.state.dataSource.cloneWithRows(responseData.data),
                    loaded:true,
                    prompt:responseData.displaydate + responseData.rankhour + '点档' + '（' +  responseData.rankduring + '）'
                });

                //关闭加载动画
                if (resolve !== undefined){
                    setTimeout(()=>{
                        resolve();
                    },1000);
                }

                //保留一些数据
                this.nexthourhour = responseData.nexthourhour;     // 下一小时时间
                this.nexthourdate = responseData.nexthourdate;     // 下一小时日期
                this.lasthourhour = responseData.lasthourhour;     // 上一小时时间
                this.lasthourdate = responseData.lasthourdate;
            }).catch((error)=>{
        })
    }

    //跳转到设置
    pushToSetting() {
        this.props.navigator.push({
            component: Setting,
        });
    }

    //中间标题
    renderTitleItem(){
        return(
            <Image source={{uri:'navtitle_rank_106x20'}} style={styles.navBarTitleItemStyle} />
        );
    }

    renderRightItem(){
        return(
            <TouchableOpacity onPress={()=>{this.pushToSetting()}}>
                <Text style={styles.navbarRightItemStyle}>设置</Text>
            </TouchableOpacity>
        );
    }

    componentDidMount(){
        this.fetchData();
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
    //跳转到详情页
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
    lastHour(){
        this.fetchData(undefined, this.lasthourdate, this.lasthourhour);
    }
    nextHour(){
        this.fetchData(undefined, this.nexthourdate, this.nexthourhour);
    }
    render() {
        return (
            <View style={styles.container}>
                <CommunaNavBar
                    titleItem={()=>this.renderTitleItem()}
                    rightItem={()=>this.renderRightItem()}
                />

                {/*提醒栏*/}
                <View style={styles.promptViewStyle}>
                    <Text>{this.state.prompt}</Text>
                </View>
                {/*根据网络状态决定是否渲染*/}
                {this.renderListView()}

                {/*操作栏*/}
                <View style={styles.operationViewStyle}>
                    <TouchableOpacity onPress={() => this.lastHour()}>
                        <Text style={{marginRight:10, fontSize:17, color:'green'}}>{"<" + "上一小时"}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.nextHour()}>
                        <Text style={{marginLeft:10, fontSize:17, color:'green'}}>{"下一小时" + ">"}</Text>
                    </TouchableOpacity>
                </View>
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
    navBarTitleItemStyle: {
        width:106,
        height:20,
        marginLeft:50
    },
    navbarRightItemStyle:{
        fontSize:17,
        color:'rgba(123,178,114,1.0)',
        marginRight:15
    },
    promptViewStyle:{
        width:width,
        height:44,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(250,250,250,1)',
    },
    operationViewStyle:{
        width:width,
        height:44,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'rgba(251,251,251,1)',
    }
});

