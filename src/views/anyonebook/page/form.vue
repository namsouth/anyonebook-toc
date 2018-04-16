<template>
  <!-- <article-detail :is-edit='false'></article-detail> -->
  <div style="padding:.8em">
     <el-tabs v-model="activeName" type="border-card" >
        <el-tab-pane label="Search" name="search">
          <el-row>
            <el-col  :span="4">
              <el-input placeholder="Book Instance Code" v-model="filter.book_instance_code"  :span="4"></el-input>
            </el-col>
            <el-col  :span="4">
              <el-input placeholder="Domain" v-model="filter.domain"  :span="4"></el-input>
            </el-col>
            <el-col  :span="4">
              <el-input placeholder="Area" v-model="filter.area"  :span="4"></el-input>
            </el-col>
            <el-col  :span="4">
              <el-input placeholder="Chapter Title" v-model="filter.chapter_title"  :span="4"></el-input>
            </el-col>
            <el-col  :span="4">
              <el-input placeholder="Knowledge Unit" v-model="filter.knowledge_unit"  :span="4"></el-input>
            </el-col>
            <el-col  :span="4">
              <el-input placeholder="Grade" v-model="filter.grade"  :span="4"></el-input>
            </el-col>
            <el-col  :span="4" style="margin-top: .5em">
              <el-button 
              @click.prevent="refreshPageList"
              type="primary" plain>
                {{$t('Refresh Page List')}}
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="page in pages" :key="page.id" :span="6" style="padding-left:.5em; padding-bottom:.8em; padding-top:1em">
              <span style="font-size:1.3em;font-weight:bold">{{page.chapter_title}}</span> <br>
              <span>{{page.domain}}</span> - <span>{{page.area}}</span> <br> 
              <span style="font-size:0.75em;color:grey">
              [{{page.grade}}]  {{page.book_instance_code}} ( {{page.page_number}} )
              </span> <br>
              <!-- <img :src="page.image_path" alt="" style="width: 70%"> -->

              <!-- image viewer component -->
              <!-- <viewer :images="[page.image_path]" style="width: 70%">
                <img v-for="src in [page.image_path]" :src="src" :key="src">
              </viewer> -->
              <div class="viewer-wrapper" style="width: 85%">
                <viewer :options="viewerOptions" :images="[page.image_path]"
                        class="viewer" ref="viewer"
                >
                  <template slot-scope="scope">
                    <img v-for="src in [page.image_path]" :src="src" :key="src" style="width: 98.5%" >
                  </template>
                </viewer>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Upload" name="upload">Upload  / Edit </el-tab-pane>
     </el-tabs>
  </div>
</template>

<script>
/**
 * @TODO: Upload PDF to Firebase storage
 * @TODO: Write Cloud Function Generate Thumbnail
 * @TODO: Retreive /Update /Delete Record from FireStore
 * @TODO: Modify Seraching Condition for the Record in FireStore
 * @TODO: Show Page Preview
 * @TODO: Upload Syllabus
 */
import ArticleDetail from './components/ArticleDetail'
import { db } from '../../../main'
import _ from 'lodash'

export default {
  name: 'createForm',
  components: { ArticleDetail },
  data() {
    return {
      pages: [],
      query_code: 'Mat_AnyOne_4A_S',
      filter: {},
      activeName: 'search',
      viewerOptions: {
        inline: true,
        button: false,
        navbar: false,
        title: false,
        toolbar: true,
        tooltip: false,
        movable: true,
        zoomable: true,
        rotatable: true,
        scalable: true,
        transition: true,
        fullscreen: true,
        keyboard: false,
        url: 'data-source'
      }
    }
  },
  methods: {
    refreshPageList() {
      let pageRef = db.collection('pages').where('user', '==', 'S')
      for (const key in this.filter) {
        console.log(key)
        if (key && this.filter[key] && this.filter[key].trim) {
          pageRef = pageRef.where(key, '==', this.filter[key])
        }
      }
      pageRef
        .limit(70)
        .get()
        .then(snapshot => {
          // console.log(snapshot)
          const _arr = []
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data())
            _arr.push({ _id: doc.id, ...doc.data() })
          })
          // this.pages = [..._arr]
          this.pages = _.orderBy(_arr, ['book_instance_code', 'level_of_difficulty', 'page_number', 'created_by'])
        })
        .catch(err => console.log(err))
    }
  },
  // firestore() {
  //   return {
  //     pages: db.collection('pages').where('book_instance_code', '==', 'Mat_AnyOne_4A_S').orderBy('page_number').limit(70)
  //   }
  // }
  created() {
    // this.refreshPageList()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .viewer-wrapper {
    position: relative;
    background: #333;
    height: 100%;
  }
  .methods {
    margin-bottom: 1em;
    flex-wrap: wrap;
    & > * {
      margin-right: 0.75rem;
    }
  }
  .options-panel {
    .panel-block {
      padding: 0;
      .checkbox {
        display: block;
        width: 100%;
        margin: 0;
        padding: 0.5em 0.75em;
      }
    }
  }
  .viewer {
    height: 100%;
    .images {
      height: 100%;
      display: flex;
      justify-content: center;
      align-content: center;
      align-items: center;
      flex-wrap: wrap;
      padding: 5px;
      .image-wrapper {
        display: inline-block;
        width: calc(33% - 20px);
        margin: 5px 5px 0 5px;
        .image {
          width: 100%;
          cursor: pointer;
          display: inline-block;
        }
      }
    }
  }
</style>
