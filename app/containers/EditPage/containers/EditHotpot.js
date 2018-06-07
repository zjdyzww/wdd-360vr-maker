import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect'
import { bindActionCreators } from 'redux';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';

import * as hotpotActions from '../../../actions/hotpot'
import * as PicActions from '../../../actions/picture'
import getPathOfSceneHeadImg from '../../../native/getPathOfSceneHeadImg'

import UploadPicModal from './UploadPicModal'
import CopyImageTmpToImage from '../../../native/copyImageTmpToImage'
import PicListModal from './PicListModal'
import getPathOfImage from '../../../native/getPathOfImage'

import EditSelectScene from './EditSelectScene'
import EditPicture from './EditPicture'
import EditText from './EditText'
import EditPicAndText from './EditPicAndText'
import EditAudio from './EditAudio'

class EditHotSpot extends Component{
    constructor(){
        super()
        this.titleRef = React.createRef()
        this.summaryRef = React.createRef()
        this.state = {
            hotSpotType:1,
            sceneId:null,
            isAdd:false,
            showPicList:false,
            picList:[],
            picTextList:[]
        }
    }

    render(){
        return (
            <div style={{padding:'5px'}}> 
                {this.renderHotpotList()}
                {this.renderEditHotPot()}                
            </div>
        )
    }

    resetState(){
        this.setState({hotSpotType:1,sceneId:null,isAdd:false})
    }

    onAddHotpotClick(){
        this.setState({isAdd:true,sceneId:null})
    }

    selectHotSpot(id){
        const {updateHotspotSelect} = this.props
        updateHotspotSelect(id)
    }

    handleTypeChange(event, index, value){
        this.setState({hotSpotType:value});
    }

    handleScenClick(id){
        this.setState({sceneId:id})
    }

    handleCloseEditHotspot(){
        const {updateHotspotSelect} = this.props
        this.setState({isAdd:false})
        updateHotspotSelect(null)
    }

    onEditConfirmClick(){ 
        const {isAdd,sceneId,hotSpotType} = this.state
        if(isAdd){
            if(sceneId != null){
                const {addHotpot} = this.props;
                if(hotSpotType == 1){
                    console.log()
                }
                addHotpot({action:'switch',target:sceneId})
            }
            this.setState({isAdd:false})
        }
    }

    onEditDeleteClick(){
        const {delHotpot,hotpotSelected,updateHotspotSelect} = this.props 
        delHotpot(hotpotSelected)
        updateHotspotSelect(null)
    }

    renderHotpotList(){
        const {isAdd} = this.state
        const {hotpotSelected} = this.props
        if(hotpotSelected == null &&　!isAdd){
            const {hotpotList} = this.props

            let hotpotArr = hotpotList.map((item,i)=>{
                return (
                    <div key={item.id} onClick={()=>{this.selectHotSpot(item.id)}}>
                        {item.id}
                    </div>
                )
            })

            return (
                <div style={{borderBottom:'1px solid #eee'}}>
                    <span>
                        <i className='fa fa-dot-circle-o'></i>
                        <span style={{
                            marginLeft:'5px'
                        }}>热点编辑</span> 
                        <FlatButton label="添加热点" primary onClick={this.onAddHotpotClick.bind(this)} />
                    </span>
                    <div>
                        {`当前场景共有热点${hotpotList.length}个`}
                    </div>
                    <div>
                        {hotpotArr}
                    </div>
                </div>  
            )
        }
    }

    renderEditHotPot(){
        const {isAdd} = this.state
        const {hotpotSelected} = this.props
        if(hotpotSelected != null || isAdd){
            return (
                <div>
                    <div style={{borderBottom:'1px solid #eee'}}>
                        <span>
                            <i className='fa fa-dot-circle-o'></i>
                            <span style={{
                                marginLeft:'5px',
                                marginRight:'85px'
                            }}>编辑</span>
                            <FlatButton onClick={()=>{this.handleCloseEditHotspot()}} label="关闭" primary/>
                        </span>
                    </div>
                    <div>
                        <SelectField style={{width:'200px'}} floatingLabelText="热点类型" value={this.state.hotSpotType} onChange={(event, index, value)=>{this.handleTypeChange(event, index, value)}}>
                            <MenuItem value={1} primaryText="切换" />
                            <MenuItem value={2} primaryText="相册" />
                            <MenuItem value={3} primaryText="文本" />
                            <MenuItem value={4} primaryText="图文" />
                            <MenuItem value={5} primaryText="音频" />
                            <MenuItem value={6} primaryText="视频" />
                        </SelectField>
                        <div style={{position: 'absolute',left: '0',right: '0',bottom: '35px',top: '117px',margin: '5px',padding: '5px',border: '2px solid #eee',borderRadius: '5px',overflowY:'auto'}}>
                            {this.renderSwitchScene()}
                            {this.renderPicList()}
                            {this.renderShowText()}
                            {this.renderShowPicAndText()}
                            {this.renderShowAudio()}
                        </div>
                    </div>
                    <div style={{position:'fixed',bottom:0}}>
                        <FlatButton label="确定" onClick={()=>{
                            this.onEditConfirmClick()
                        }} primary/>
                        {
                            isAdd ? null :
                            <FlatButton label="删除" onClick={()=>{
                                this.onEditDeleteClick()
                            }} secondary/>
                        }
                    </div>
                </div>
            )
        }
    }

    renderPicList(){
        if(this.state.hotSpotType == 2){
            const {addPicture} =  this.props
            return (
                <EditPicture list={[]} addPicture={addPicture}></EditPicture>
            )
        }
    }

    renderSwitchScene(){
        if(this.state.hotSpotType == 1){
            const {sceneList,folderId,vrId} = this.props            
            return (
                <EditSelectScene selectId={null} sceneList={sceneList} folderId={folderId} vrId={vrId}></EditSelectScene>
            )
        }
    }

    renderShowText(){
        if(this.state.hotSpotType == 3){
            return (
                <EditText></EditText>
            )
        }
    }

    renderShowPicAndText(){
        if(this.state.hotSpotType == 4){
            const {addPicture} = this.props 
            return (
                <EditPicAndText list={[]} addPicture={addPicture}></EditPicAndText>
            )
        }
    }

    renderShowAudio(){
        if(this.state.hotSpotType == 5){
            return (
                <EditAudio url={null}></EditAudio>
            )
        }
    }
}

function mapDispatchToProps(dispatch){
    return {
        ...bindActionCreators(hotpotActions,dispatch),
        ...bindActionCreators(PicActions,dispatch)
    }
}

const selector = createSelector(
    state => state.vr.list,
    state => state.hotpot.list,
    state => state.scene.list,
    state => state.router.location.pathname,
    state => state.scene.sceneSelected,
    state => state.hotpot.selected,

    (vrList,hotpotList,sceneList,pathname,sceneSelected,hotpotSelected)=>{
        return {
            vrList : vrList,
            hotpotList : filterHotSpot(hotpotList,sceneSelected),
            sceneList : filterScene(sceneList,pathname,sceneSelected),
            pathname : pathname,
            vrId: pathname.split('/')[2],
            folderId:findFolderId(vrList,pathname),
            sceneSelected:sceneSelected,
            hotpotSelected:hotpotSelected
        }
    }
)

function filterHotSpot(list,sceneSelected){
    return list.filter((item)=>{
        return item.sceneId == sceneSelected
    })
}

function filterScene(list,pathname,selectedSceneId){
    var vrId = pathname.split('/')[2]
    return list.filter((item)=>{
        return item.vrid == vrId && item.id !== selectedSceneId
    })
}

function findFolderId(vrList,pathname){
    var vrId = pathname.split('/')[2]
    let item = vrList.find((item)=>{
        return item.id == vrId
    })
    return item ? item.folderId : -1
}

export default connect(selector,mapDispatchToProps)(EditHotSpot)
