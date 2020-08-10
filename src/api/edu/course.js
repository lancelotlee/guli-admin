import request from '@/utils/request'
export default {
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/edu-course/addEduCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  getAllTeacher() {
    return request({
      url: `/eduservice/edu-teacher/findAll`,
      method: 'get'
    })
  },
  getCourseInfo(courseId) {
    return request({
      url: `/eduservice/edu-course/getCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/edu-course/updateCourseInfo`,
      method: 'put',
      data: courseInfo
    })
  },
  getCoursePublishInfo(courseId) {
    return request({
      url: `/eduservice/edu-course/getPublishCourseInfo/${courseId}`,
      method: 'get'
    })
  },
  publishCourse(courseId) {
    return request({
      url: `/eduservice/edu-course/publishCourse/${courseId}`,
      method: 'put'
    })
  },
  getCourseList(current, limit, courseQuery) {
    return request({
      url: `/eduservice/edu-course/getCourseList/${current}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },
  deleteCourse(courseId) {
    return request({
      url: `/eduservice/edu-course/deleteCourse/${courseId}`,
      method: 'delete'
    })
  }
}
