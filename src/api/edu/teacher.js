import request from '@/utils/request'

export default {
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/eduservice/edu-teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },
  deleteTeacherId(id) {
    return request({
      url: `/eduservice/edu-teacher/remove/${id}`,
      method: 'delete'
    })
  },
  addTeacher(teacher) {
    return request({
      url: `/eduservice/edu-teacher`,
      method: 'post',
      data: teacher
    })
  },
  getTeacherInfo(id) {
    return request({
      url: `/eduservice/edu-teacher/${id}`,
      method: 'get'
    })
  },
  updateTeacher(teacher) {
    return request({
      url: `/eduservice/edu-teacher`,
      method: 'put',
      data: teacher
    })
  }
}
