import React,{Component} from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import generateVrFolder from '../../native/generateVrFolder'
import copyImageToScene from '../../native/copyImageToScene'
import getScenePath from '../../native/getScenePath'

import FlatButton from 'material-ui/FlatButton';

import styles from './index.css'
import * as vrActions from '../../actions/vr'
import * as sceneActions from '../../actions/scene'
import CreateVrModal from '../CreateVrModal'

class VrContainer extends Component{
    constructor(){
        super()
        this.state = {
            showCreateVrModal:false
        }
    }

    onAddClick(){
        this.setState({
            showCreateVrModal:true
        })
    }

    onCancelClick(){
        this.setState({
            showCreateVrModal:false
        })
    }

    onCreateClick(title,brief,isTmpImageReady){
        const {nextVrId,nextSceneId,selectedFolderId,addScene,addVr} = this.props

        addVr({
            id:nextVrId,
            title:title,
            brief:brief,
            folderId:selectedFolderId
        })

        addScene({
            id:nextSceneId,
            vrid:nextVrId,
            name:'test'
        })

        setTimeout(()=>{
            generateVrFolder(selectedFolderId,nextVrId,nextSceneId)
            .then(()=>{
                return copyImageToScene(getScenePath(selectedFolderId,nextVrId,nextSceneId))
            })
            .catch((e)=>{
                console.error(e)
            })
        },20)
        
        this.onCancelClick()
    }
    
    renderContent(){
        let  vrArr = this.getVrByFolderId()
        if(vrArr.length > 0){
            return (
                <h3>有内容哦</h3>
            )
        } else {
            return <h3>暂无内容</h3>
        }
    }

    getVrByFolderId(){
        const {selectedFolderId,vr} = this.props
        return vr.filter((item)=>{
            return item.folderId === selectedFolderId
        })
    }

    renderCreateVrModal(){
        const {showCreateVrModal} = this.state
        if(showCreateVrModal){
            return (
                <CreateVrModal onCancel={this.onCancelClick.bind(this)} onCreate={this.onCreateClick.bind(this)}></CreateVrModal>
            )
        }
    }

    render(){
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <div style={{paddingLeft:'10px'}} onClick={()=>{this.onAddClick()}}>
                        <i className={"fa fa-plus "+styles.plusIcon}/>
                        <FlatButton primary={true} label="创建全景" style={{height:'30px',lineHeight:'30px',paddingLeft:'20px'}}/>
                    </div>
                </div>
                <div className={styles.content}>
                    {this.renderContent()}         
                </div>
                {this.renderCreateVrModal()}
            </div>
        )
    }
}

function mapStateToProps(state){
    return {
        vr:state.vr,
        scene:state.scene,
        nextVrId:getNextId(state.vr,0),
        nextSceneId:getNextId(state.scene,0)
    }
}

const getNextId = (arr, startIndex) => {
    let id = startIndex;
    arr.map(item => {
        if (item.id > id) {
            id = item.id;
        }
    });
    return ++id;
};

function mapDispatchToProps(dispatch){
    return {
        ...bindActionCreators(vrActions,dispatch),
        ...bindActionCreators(sceneActions,dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(VrContainer)