import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';
import CommunaNavBar from '../main/GDCommunaNavBar';
export default class GDHourList extends Component {
  renderTitleItem(){
    return(
      <TouchableOpacity>
        <Text style={styles.navbarTitleItemStyle}>小时风云榜</Text>
      </TouchableOpacity>
  );
  }
  renderRightItem(){
    return(
        <TouchableOpacity>
          <Text style={styles.navbarRightItemStyle}>设置</Text>
        </TouchableOpacity>
    );
  }
  render() {
    return (
        <View style={styles.container}>
            <CommunaNavBar
              titleItem={()=>this.renderTitleItem()}
              rightItem={()=>this.renderRightItem()}
            />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'yellow',
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
});

