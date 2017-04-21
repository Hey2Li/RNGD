/**
 * Created by Tebuy on 2017/4/21.
 */
import React, {Component , PropTypes} from 'react';
import {
    StyleSheet,
    WebView,
    View,
    Text,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';

import CommunaNvBar from './GDCommunaNavBar';

export default class GDCommunaDetail extends Component{

    static propTypes = {
        url:PropTypes.string,
    };

    pop(){
        this.props.navigator.pop()
    }

    //左边按钮
    renderLeftItem(){
        return(
            <TouchableOpacity onPress={()=>{this.pop()}}>
                <Text>返回</Text>
            </TouchableOpacity>
        );
    }
    render(){
        return(
            <View style={styles.container}>
                <CommunaNvBar
                    leftItem={()=> this.renderLeftItem()}
                />
                <WebView
                    style={styles.webViewStyle}
                    source={{url:this.props.url, method:'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={false}
                />
            </View>
        );
    }
    componentWillMount(){
        DeviceEventEmitter.emit('isHiddenTabBar',true);
    }

    componentWillUnmount(){
        DeviceEventEmitter.emit('isHiddenTabBar',false);
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    } ,
    webViewStyle:{
        flex:1
    }
});