<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="提交审核" />
    </el-steps>
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterAndVideos" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text">编辑</el-button>
                <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapterAndVideos: [],
      courseId: '',
      chapter: {
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: ''
      },
      dialogChapterFormVisible: false,
      dialogVideoFormVisible: false,
      saveVideoBtnDisabled: false
    }
  },

  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      // 根据id获取课程基本信息
      this.getChapterAndVideo()
    }
  },

  methods: {
    // ----------------------------------------------小节--------------------------------------------------------------
    openVideo(chapterId) {
      this.dialogVideoFormVisible = true
      this.video.sort = 0
      this.video.title = ''
      this.video.id = null
      this.video.free = 0
      this.video.chapterId = chapterId
      this.video.courseId = this.courseId
    },
    saveOrUpdateVideo() {
      this.addVideo()
    },
    addVideo() {
      video.addVideo(this.video).then((response) => {
        this.dialogVideoFormVisible = false
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.getChapterAndVideo()
      })
    },
    removeVideo(videoId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          video
            .deleteVideo(videoId)
            .then(() => {
              this.getChapterAndVideo()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch((response) => {
              // 失败
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch((response) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // ----------------------------------------------章节---------------------------------------------------------------
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      this.chapter.sort = 0
      this.chapter.title = ''
      this.chapter.id = null
    },
    openEditChapter(chapterId) {
      this.dialogChapterFormVisible = true
      chapter.getChapterInfo(chapterId).then((response) => {
        this.chapter = response.data.chapter
      })
    },
    addChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false
        this.$message({
          type: 'success',
          message: '新增成功!'
        })
        this.getChapterAndVideo()
      })
    },
    updateChapter() {
      chapter.updateChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.getChapterAndVideo()
      })
    },
    saveOrUpdate() {
      if (!this.chapter.id) {
        this.addChapter()
      } else {
        this.updateChapter()
      }
    },
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          chapter
            .deleteChapter(chapterId)
            .then(() => {
              this.getChapterAndVideo()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
            .catch((response) => {
              // 失败
              this.$message({
                type: 'error',
                message: '删除失败'
              })
            })
        })
        .catch((response) => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getChapterAndVideo() {
      chapter.getChapterAndVideo(this.courseId).then((response) => {
        this.chapterAndVideos = response.data.items
      })
    },
    previous() {
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next() {
      this.$router.push({ path: '/course/publish/' + this.courseId })
    }
  }
}
</script>
<style scoped>
.chanpterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chanpterList li {
  position: relative;
}
.chanpterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chanpterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>
