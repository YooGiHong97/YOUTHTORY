<template>
  <div>
    <div class="suggest-register-page">
      <GlobalMain title="자율게시판 글쓰기" />
      <form enctype="multipart/form-data" @submit.prevent="onSubmit">
        <section class="form-row">
          <div class="input-label">
            게시글 제목
          </div>
          <div>
            <input type="text" name="commu_sub" v-model="form.commu_sub" placeholder="게시글의 제목을 작성해주세요." @change="onCommuSub">
          </div>
        </section><br>
        <section class="form-row">
          <div class="input-label">
            URL 등록
          </div>
          <div>
            <input type="text" name="video_url" v-model="form.video_url" placeholder="게시글의 제목을 작성해주세요." @change="onVideoUrl">
          </div>
        </section><br>
        <section class="form-row">
          <div class="input-label">
            게시글 작성
          </div>
          <div>
            <input type="text" name="commu_con" v-model="form.commu_con" placeholder="게시글의 제목을 작성해주세요." @change="onCommuCon">
          </div>
        </section><br>
        <section class="form-row">
          <div class="form-group">
            <p class="files-message"> 500kb 미만인 첨부가능한 확장자( IMG, PNG, JPG, JPEG, WORD, PDF )</p>
          </div>
        </section>
        <section id="rowsss" class="form-row">
          <div class="form-group">
            <input type="file" @change="onFileUpload">
          </div>
        </section>
        <section class="form-row warning">
          <div class="input-label">
            게시글 작성 주의사항
          </div>
          <div>
            <ul>
              <li>
                ✤ TEST 1
              </li>
              <li>
                ✤ TEST 2
              </li>
              <li>
                ✤ TEST 3
              </li>
              <li>
                ✤ TEST 4
              </li>
              <li>
                ✤ TEST 5
              </li>
            </ul>
          </div>
          <div class="agree-checkbox">
            <input id="agree" v-model="form.agree" type="checkbox" name="">
            <label for="agree">제안글 작성에 대한 주의사항을 확인하였으며, 위 사항에 동의합니다.</label>
          </div>
          <div class="submit-btns">
            <el-button @click="goPage('/freeboard-list')">
              돌아가기
            </el-button>
            <button @click="registerFreeboard">
              게시글 {{ isEditMode ? '수정' : '등록' }}
            </button>
          </div>
        </section>
      </form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import GlobalMain from '~/components/shared/GlobalMain'

export default {
  components: {
    GlobalMain
  },
  props: true,
  async asyncData ({ store, route }) {
    console.log(store)
    if (route.query.idx) {
      const { query: { type } } = route
      const isChildrenType = type === 'children'
      await store.dispatch('GET_FREEBOARD_DETAIL', { idx: route.query.idx, isChildrenType })
    }
  },
  data () {
    return {
      FILE: null,
      user_idx: '',
      name: '',
      commu_sub: '',
      commu_con: '',
      video_url: '',
      form: {
        commu_sub: '',
        commu_con: '',
        name: '',
        video_url: '',
        agree: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'getUserInfo',
      'getFreeboardDetail',
      'isLoggedIn'
    ]),
    isEditMode () {
      return !!this.$route.query.idx
    },
    isChildrenType () {
      const { type } = this.$route.query
      return type === 'children'
    }
  },
  created () {
    if (this.isEditMode) {
      const {
        commu_sub: commuSub,
        commu_con: commuCon,
        name: Name,
        video_url: videoUrl
      } = this.getFreeboardDetail
      this.form.commu_sub = commuSub
      this.form.commu_con = commuCon
      this.form.name = Name
      this.form.video_url = videoUrl
    }
  },
  methods: {
    onCommuSub (event) {
      console.log('TARGET:', event.target)
      this.commu_sub = event.target.value
    },
    onVideoUrl (event) {
      console.log('TARGET2:', event.target)
      this.video_url = event.target.value
    },
    onCommuCon (event) {
      console.log('TARGET3:', event.target)
      this.commu_con = event.target.value
    },
    onFileUpload (event) {
      console.log('TARGET4:', event.target.files[0])
      this.FILE = event.target.files[0]
    },
    async onSubmit () {
      try {
        // console.log('main', this.FILE)
        // console.log('commu_sub', this.commu_sub)
        // console.log('video_url', this.video_url)
        // console.log('commu_con', this.commu_con)
        // console.log('idx', this.getFreeboardDetail.idx)
        // upload file
        // formdata object
        const formData = new FormData()
        // append the values with key, value pair
        formData.append('main', this.FILE)
        formData.append('idx', this.getFreeboardDetail.idx)
        formData.append('commu_sub', this.commu_sub)
        formData.append('video_url', this.video_url)
        formData.append('commu_con', this.commu_con)
        formData.append('name', this.getUserInfo.user_name)
        formData.append('user_idx', this.getUserInfo.idx)
        // const config = { headers: { 'content-type': 'multipart/form-data'} }
        await this.$axios.$post(this.isEditMode ? '/community/community_update.do' : '/community/community_insert.do', formData)
      } catch (e) {
        console.error(e)
      }
    },
    async registerFreeboard () {
      try {
        const {
          commu_sub: commuSub,
          commu_con: commuCon,
          name: Name,
          video_url: videoUrl,
          agree
        } = this.form
        const isValidForm = this.isChildrenType
          ? !!(commuSub && commuCon)
          : !!(commuSub && commuCon && agree)
        if (!isValidForm) { return alert('게시글 내용을 입력해주세요.') }
        if (!this.isLoggedIn) {
          alert('로그인 후 게시글을 등록해주세요.')
          return
        }
        const dynamicParams = this.isEditMode
          ? {
              idx: this.$route.query.idx,
              user_idx: this.getUserInfo.idx
            }
          : {
              commu_user_name: this.getFreeboardDetail.commu_user_name,
              commu_user_idx: this.getUserInfo.idx
            }
        const params = {
          commu_sub: commuSub,
          commu_con: commuCon,
          name: Name,
          video_url: videoUrl,
          ...dynamicParams
        }
        const url = this.isEditMode ? '/community/community_update.do' : '/community/community_insert.do'
        await this.$axios.$get(url, { params })
        alert(`게시글이 정상 ${this.isEditMode ? '수정' : '등록'}되었습니다.`)
        const path = '/freeboard-list'
        this.$router.push(path)
      } catch (e) {
        console.error(e)
      }
    },
    goPage (path) {
      this.$router.push(path)
    }
  }
}
</script>
<style scoped lang="scss">
.container {
  max-width: 600px;
}
</style>
