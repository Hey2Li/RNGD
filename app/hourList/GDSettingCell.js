/**
 * Created by Tebuy on 2017/4/27.
 */
import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Switch,
    Platform,
} from 'react-native';


export default class GDSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            isOn:false,
        };
    }
    static propTypes = {
        leftTitle:PropTypes.string,
        isShowSwitch:PropTypes.bool,
    }
    renderRightContent() {
        let component;

        if (this.props.isShowSwitch) { //显示Switch按钮
            component = <Switch value={this.state.isOn} onValueChange={
                () => {this.setState({isOn:!this.state.isOn})}
                }/>
        }else {
            component = <Image source={{uri:'icon_cell_rightArrow'}} style={styles.arrowStyle}/>

        }
        return component;
    }
    render() {
        return (
            <View style={styles.container}>
              {/*左边*/}
              <View>
                  <Text>{this.props.leftTitle}</Text>
              </View>

                {/*右边*/}
                <View style={styles.rightViewStyle}>
                    {this.renderRightContent()}
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'row',
        height:Platform.OS === 'ios' ? 44 : 36,
        justifyContent:'space-between',
        alignItems:'center',
        borderBottomColor:'gray',
        borderBottomWidth:0.5,
        marginLeft:15,
    },
    arrowStyle:{
        width:10,
        height:10,
        marginRight:30
    },
    rightViewStyle:{
        marginRight:15,
    }
});