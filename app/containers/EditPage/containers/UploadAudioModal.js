import React, { Component } from 'react';

// import Dialog from 'material-ui/Dialog';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import TextField from '@material-ui/core/TextField';
import FlatButton from '@material-ui/core/Button';

// import TextField from 'material-ui/TextField';
// import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
import styles from '../../../styles/createSceneModal.css'//../styles/createSceneModal.css
import openAudio from '../../../native/openAudio'
import CopyAudioToAudioTmp from '../../../native/copyAudioToTmpAudio'
import getPathOfAudio from '../../../native/getPathOfAudio'
import ReactAudioPlayer from 'react-audio-player';

class UploadPicModal extends Component{
    constructor(){
        super()
        this.state = {tempAudioReady:false,previewImg:null,audioName:null}
    }
    renderUploadPic(){
        const {audioName} = this.state
        if(!audioName){
            return <div className={styles.imgContainer}>等待上传</div>
        } else {
            let audioSrc = getPathOfAudio(true,audioName)
            return (
                <div className={styles.imgContainer}>
                    <ReactAudioPlayer
                        src={audioSrc}
                        controls
                        style={{width:'100px'}}
                    />
                    {/* <img className={styles.thumb} src={imgUrl}/> */}
                </div>
            )
        }
    }

    onUploadClick(){
        openAudio()
        .then(res=>{
            if(res && res[0]){
                let path = res[0]
                return CopyAudioToAudioTmp(path)
            }
        })
        .then((name)=>{
            console.log(name)
            setTimeout(()=>{
                this.setState({audioName:name})
            },300)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    onConfirmClick(){
        const {audioName} = this.state
        const {onConfirm,onCancel} = this.props;
        if(!audioName){
            onCancel()
        } else {
            onConfirm(audioName)
        }
    }

    render(){
        const {onConfirm,onCancel} = this.props;
        // const actions = [
        //     <FlatButton label="取消" onClick={()=>{onCancel()}} primary />,
        //     <FlatButton label="确认" onClick={()=>{this.onConfirmClick()}}primary />
        // ];
        return (
            <Dialog
                open
                onClose={()=>{onCancel()}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">添加音乐</DialogTitle>
                <DialogContent style={{width:'500px'}}>
                    <div style={{display:'inline-block',width:'100%',height:'260px',verticalAlign:'top'}}>
                        <FlatButton onClick={this.onUploadClick.bind(this)} label="添加音乐" primary={true} style={{marginLeft:'47px'}}>添加音乐</FlatButton>
                        {this.renderUploadPic()}
                    </div>
                </DialogContent>
                <DialogActions>
                    <FlatButton onClick={()=>{onCancel()}}>取消</FlatButton>,
                    <FlatButton onClick={this.onConfirmClick.bind(this)}>确认</FlatButton>
                </DialogActions>
            </Dialog>
        )
        // return (
        //     <Dialog title={'添加音乐'} open actions={actions}>
        //         <div style={{display:'inline-block',width:'100%',height:'260px',verticalAlign:'top'}}>
        //             <RaisedButton onClick={this.onUploadClick.bind(this)} label="添加音乐" primary={true} style={{marginLeft:'47px'}}/>
        //             {this.renderUploadPic()}
        //         </div>
        //     </Dialog>
        // )
    }
}

export default UploadPicModal