/**
 * Created by Tebuy on 2017/4/24.
 */
var RealmBase = {};

import Realm from 'realm';

const HomeSchema = {
    name:'HomeData',
    properties:{
        id:'int',
        title:'string',
        image:'string',
        mall:'string',
    }
}

const HTSchema = {
    name:'HTData',
    properties:{
        id:'int',
        title:'string',
        image:'string',
        mall:'string',
    }
}

//初始化
let realm = new Realm({schema:[HomeSchema,HTSchema]});

//增加
RealmBase.write = function (schema, data) {
    realm.write(()=>{
        for (let i = 0; i < data.length; i++){
            let temp = data[i];
            realm.create(schema, {id:temp.id, title:temp.title, image:temp.image, mall:temp.mall});
        }
    })
}

//查询全部数据
RealmBase.loadAll = function (schema) {
    return realm.objects(schema);
}

//条件查询
RealmBase.filtered = function (schema, filtered) {
    //获取对象
    let objects = realm.objects(schema);
    //筛选
    let object = objects.filtered(filtered);

    if (object) {//有对象
        return object;
    }else {
        return '未找到数据';
    }
}

//删除所有数据
RealmBase.removeAllData = function (schema) {
    realm.write(()=>{
        //获取对象
        let objects = realm.objects(schema);
        //删除表
        realm.delete(objects);
    })
}

global.RealmBase = RealmBase;