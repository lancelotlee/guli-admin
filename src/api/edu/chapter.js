import request from '@/utils/request'
export default {
  getChapterAndVideo(courseId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterAndVideo/${courseId}`,
      method: 'get'
    })
  },
  addChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/addChapter/`,
      method: 'post',
      data: chapter
    })
  },
  getChapterInfo(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/getChapterInfo/${chapterId}`,
      method: 'get'
    })
  },
  updateChapter(chapter) {
    return request({
      url: `/eduservice/edu-chapter/updateChapter/`,
      method: 'put',
      data: chapter
    })
  },
  deleteChapter(chapterId) {
    return request({
      url: `/eduservice/edu-chapter/${chapterId}`,
      method: 'delete'
    })
  }
}
