<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>

    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写" />
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择"
          @change="subjectLevelOneChanged"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number
          v-model="courseInfo.lessonNum"
          :min="0"
          controls-position="right"
          placeholder="请填写课程的总课时数"
        />
      </el-form-item>

      <!-- 课程简介-->

      <el-form-item label="课程简介">
        <!-- <el-input v-model="courseInfo.description" controls-position="right" /> -->
        <tinymce v-model="courseInfo.description" :height="300" />
      </el-form-item>

      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduoss/fileoss/upload'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>

      <el-form-item label="课程价格">
        <el-input-number
          v-model="courseInfo.price"
          :min="0"
          controls-position="right"
          placeholder="免费课程请设置为0元"
        />元
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: { Tinymce },
  data() {
    return {
      courseInfo: {
        title: '',
        subjectParentId: '',
        subjectId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover:
          'https://edu-filebysorlin.oss-cn-beijing.aliyuncs.com/f537c8160924ab182069896438fae6cd7b890b33.jpg',
        price: 0
      },
      courseId: '',
      saveBtnDisabled: false, // 保存按钮是否禁用
      teacherList: [],
      subjectOneList: [], // 一级分类列表
      subjectTwoList: [], // 二级分类列表
      BASE_API: process.env.VUE_APP_BASE_API // 接口API地址
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.getCourseInfo()
    } else {
      this.getAllTeacher()
      this.getOneSubject()
    }
  },

  methods: {
    getCourseInfo() {
      course.getCourseInfo(this.courseId).then((response) => {
        this.courseInfo = response.data.courseInfoVo
        subject.getAllSubject().then((response) => {
          this.subjectOneList = response.data.items
          for (const index in this.subjectOneList) {
            var subjectOne = this.subjectOneList[index]
            if (this.courseInfo.subjectParentId === subjectOne.id) {
              this.subjectTwoList = subjectOne.children
            }
          }
        })
        this.getAllTeacher()
      })
    },
    handleAvatarSuccess(res, file) {
      this.courseInfo.cover = res.data.url
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg,image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    subjectLevelOneChanged(value) {
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          this.courseInfo.subjectId = ''
        }
      }
    },
    getOneSubject() {
      subject.getAllSubject().then((response) => {
        this.subjectOneList = response.data.items
      })
    },
    getAllTeacher() {
      course.getAllTeacher().then((response) => {
        this.teacherList = response.data.items
      })
    },
    addCourseInfo() {
      course.addCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          type: 'success',
          message: '添加课程分类成功'
        })
        this.$router.push({ path: '/course/chapter/' + response.data.courseId })
      })
    },
    updateCourseInfo() {
      course.updateCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          type: 'success',
          message: '修改课程分类成功'
        })
        this.$router.push({ path: '/course/chapter/' + this.courseId })
      })
    },
    next() {
      if (!this.courseInfo.id) {
        this.addCourseInfo()
      } else {
        this.updateCourseInfo()
      }
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
