/**
 * Created by Tebuy on 2017/4/27.
 */
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import  CommunaNavBar from '../main/GDCommunaNavBar';
import  SettingsCell from  './GDSettingCell';

export default class GDSetting extends Component {

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
            <Text style={styles.navbarTitleItemStyle}>设置</Text>
        );
    }
    //返回
    pop() {
        this.props.navigator.pop();
    }
    render() {
        return (
            <View style={styles.container}>
                {/*导航栏*/}
                <CommunaNavBar
                    leftItem={()=>this.renderLeftItem()}
                    titleItem={()=>this.renderTitleItem()}
                />
                {/*内容*/}
                <ScrollView style={styles.scrollViewStyle}>
                    {/*第一个cell*/}
                    <SettingsCell
                        leftTitle="淘宝天猫快捷下单"
                        isShowSwitch={true}
                    />
                    {/*第二个cell*/}
                    <SettingsCell
                        leftTitle="清理图片缓存"
                        isShowSwitch={false}
                    />
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
   container:{
        flex:1,
   },
    navbarLeftItemStyle:{
        width:20,
        height:20,
        marginLeft:15,
    },
    navbarTitleItemStyle:{
       fontSize:17,
        marginRight:50
    },
    navbarRightItemStyle:{
        width:20,
        height:20,
        marginRight:15,
    },
    scrollViewStyle:{
       backgroundColor:'white',
    }
});