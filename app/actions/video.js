import { createAction } from 'redux-act'
import Modals from '../modals'

export const dUpdateAllVideo = createAction('update_all_video')

export function updateAllVideo(arr){
    return (dispatch)=>{
        dispatch(dUpdateAllVideo(arr))
    }
}

export function addVideo(obj){
    return (dispatch)=>{
        Modals.Video.add(obj)
        .then(()=>{
            return Modals.Video.findAll()
        })
        .then((arr)=>{
            dispatch(updateAllVideo(arr))
        })
    }
}

export function updateVideoFromLocal(){
    return (dispatch)=>{
        Modals.Video.findAll()
        .then((arr)=>{
            dispatch(updateAllVideo(arr))
        })
    }
}