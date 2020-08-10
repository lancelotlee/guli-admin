import request from '@/utils/request'
export default {
  addVideo(video) {
    return request({
      url: `/eduservice/edu-video/addVideo/`,
      method: 'post',
      data: video
    })
  },
  deleteVideo(videoId) {
    return request({
      url: `/eduservice/edu-video/${videoId}`,
      method: 'delete'
    })
  },
  deleteAliVideo(videoSourceId) {
    return request({
      url: `/eduvod/video/removeVideo/${videoSourceId}`,
      method: 'delete'
    })
  }
}
