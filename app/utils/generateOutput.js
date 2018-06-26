const {
    native_require,
    electron_app_output_path,
    electron_app_scene_path,
    electron_app_pic_path,
    electron_app_audio_path,
    electron_app_vr_path,
    electron_app_root_path
} = window

import {IMG_NAME_ARR} from '../constants.js'
import {getProductionXml} from './xmlBuilder2'

const fse = require('fs-extra')
const fs = native_require('fs')
const path = native_require('path')
const swig = require('swig')

export function GenerateOutput(vrItem,sceneList,hotpotList){
    let config = {}
    let vrPath = path.resolve(electron_app_output_path,`./vr-${vrItem.id}`)

    let picPath = path.resolve(vrPath,'./picture')
    let audioPath = path.resolve(vrPath,'./audio')
    let scenePathArr = []
    let hotspots = []
    let picArr = []
    let audioArr = []
    for(let i=0;i<sceneList.length;i++){
        scenePathArr.push(sceneList[i].id)
    }
    for(let i = 0;i<sceneList.length;i++){
        for(let j=0;j<hotpotList.length;j++){
            if(hotpotList[j].sceneId == sceneList[i].id){
                hotspots.push(hotpotList[j])
            }
        }
    }
    for(let i = 0;i< hotspots.length;i++){
        let actionObj = JSON.parse(hotspots[i].action)
        if(actionObj.type == 'pictures'){
            let list = actionObj.pics
            for(let j=0;j<list.length;j++){
                if(picArr.indexOf(list[j]) < 0){
                    picArr.push(list[j])
                }
            }
        } else if(actionObj.type == 'picAndText'){
            let list = actionObj.picArr
            for(let j=0;j<list.length;j++){
                if(picArr.indexOf(list[j].pic) < 0){
                    picArr.push(list[j].pic)
                }
            }
        } else if(actionObj.type == 'audio'){
            audioArr.push(actionObj.url)
        }
    }


    if(fs.existsSync(vrPath)){
        fse.removeSync(vrPath)
    }

    if(!fs.existsSync(vrPath)){
        fs.mkdirSync(vrPath)
    }

    for(let i = 0;i<sceneList.length;i++){
        let scene = sceneList[i]
        let srcPath = path.resolve(electron_app_vr_path,`./folder_${vrItem.folderId}_vr_${vrItem.id}/scene_${scene.id}`)
        let destPath = path.resolve(vrPath,`./scene_${scene.id}`)
        if(!fs.existsSync(destPath)){
            fs.mkdirSync(destPath)
        }
        for(let j=0;j<IMG_NAME_ARR.length;j++){
            fse.copySync(path.resolve(srcPath,`./${IMG_NAME_ARR[j]}`),path.resolve(destPath,`./${IMG_NAME_ARR[j]}`))
        }
    }

    if(!fs.existsSync(picPath)){
        fs.mkdirSync(picPath)
    }

    for(let i=0;i<picArr.length;i++){
        let srcPath = path.resolve(electron_app_pic_path,`./${picArr[i]}`)
        let destPath = path.resolve(picPath,`./${picArr[i]}`)
        fse.copySync(srcPath,destPath)
    }

    if(!fs.existsSync(audioPath)){
        fs.mkdirSync(audioPath)
    }

    for(let i=0;i<audioArr.length;i++){
        let srcPath = path.resolve(electron_app_audio_path,`./${audioArr[i]}`)
        let destPath = path.resolve(audioPath,`./${audioArr[i]}`)
        fse.copySync(srcPath,destPath)
        console.log(destPath)
    }

    const template = swig.compileFile(path.resolve(electron_app_root_path, '../../html/pano.html'))

    fs.writeFileSync(path.resolve(vrPath, './index.html'), template({ title: '666' }))

    fse.copySync(path.resolve(electron_app_root_path, '../krpano/api_export_jiemi2.xml'), path.resolve(vrPath, './api_export.xml'))

    fs.writeFileSync(path.resolve(vrPath, './data.xml'), getProductionXml(vrItem,sceneList,hotpotList))

    fse.copySync(path.resolve(electron_app_root_path, './js/offline.js'), path.resolve(vrPath, './offline.js'))

    fse.copySync(path.resolve(electron_app_root_path, './js/viewer.js'), path.resolve(vrPath, './viewer.js'))

    fse.copySync(path.resolve(electron_app_root_path, '../krpano/krpano.js'), path.resolve(vrPath, './krpano.js'))

    fse.copySync(path.resolve(electron_app_root_path, '../krpano/krpano.swf'), path.resolve(vrPath, './krpano.swf'))

    fse.copySync(path.resolve(electron_app_root_path, '../krp'), path.resolve(vrPath, './krp'))

    fse.copySync(path.resolve(electron_app_root_path, '../krp/hotspotIcons'), path.resolve(vrPath, './hotspots'))
}