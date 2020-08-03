import request from '@/utils/request'
export default {
  getAllSubject() {
    return request({
      url: `/eduservice/edu-subject/getAllSubject`,
      method: 'get'
    })
  }
}
