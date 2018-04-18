<template>
  <!-- <article-detail :is-edit='false'></article-detail> -->
  <div style="padding:.8em">
     <el-tabs v-model="activeName" type="border-card"  @tab-click="tabClickHandler" >
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
                <span>Refresh Page List</span>
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
              <el-button type="primary" icon="el-icon-edit" circle @click.prevent="gotoEditPage(page)" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle  @click.prevent="confirmDeletePage(page)" size="mini"></el-button>
              <!-- <img :src="page.image_path" alt="" style="width: 70%"> -->

              <!-- image viewer component -->
              <!-- <viewer :images="[page.image_path]" style="width: 70%">
                <img v-for="src in [page.image_path]" :src="src" :key="src">
              </viewer> -->
              <div class="viewer-wrapper">
                <viewer :options="viewerOptions" :images="[page.image_path]"
                        class="viewer" ref="viewer"
                         @inited="inited"
                >
                  <template slot-scope="scope">
                    <figure class="images">
                      <div class="image-wrapper" v-for="source in scope.images" :key="source">
                        <img class="image"
                            :src="source" :data-source="source" :alt="source.split('/').pop()"
                        >
                      </div>
                    </figure>
                  </template>
                </viewer>
              </div>  
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="Upload" name="upload">
          <h2>
            {{$t(page._id?'Edit Page':'Upload Page')}}  
            <el-button v-if="page._id" 
            circle @click.prevent="activeName='search'" 
            size="mini" icon="el-icon-back" ></el-button></h2> 
            <!--
              ["_id","codex", "grade","book_instance_code", "page_number",  "domain","area", "knowledge_unit", "learning_objective", "chapter_title","level_of_difficulty",   "file_path", "image_path","rowRef"]
            -->
          <el-form ref="form" :model="page" label-width="12em" size="mini" @submit.prevent="submitPageForm" >
            <el-row>
              <el-col v-for='field in ["codex", "grade","book_instance_code", "page_number",  "domain","area", "knowledge_unit", "learning_objective", "chapter_title","level_of_difficulty", "rowRef","parentRef"]'
                :span="8"
                :key="field"
              >
                <el-form-item 
                    :label="field"                                                             
                    :style="{'margin-bottom':'0.2em'}"
                >
                  <el-input v-model="page[field]"></el-input>
                </el-form-item> <!--   "file_path", "image_path", -->
              </el-col>
               <el-col v-for='field in ["file_path", "image_path"]'
                :span="24"
                :key="field"
              >
                <el-form-item 
                    :label="field"                                                             
                    :style="{'margin-bottom':'0.2em'}"
                >
                  <el-input v-model="page[field]"></el-input>
                </el-form-item> <!--   "file_path", "image_path", -->
              </el-col>
            </el-row>
           
           
            <el-form-item size="large">
              <el-button type="primary" @click.stop="submitPageForm" >{{page._id?'Update':'Create'}}</el-button>
              <el-button @click="activeName='search'">Back</el-button>
            </el-form-item>
          </el-form>
          {{page}}
          <el-row>
            <el-col :span="17">
              <img :src="page.image_path" alt="" style="width:85%">
            </el-col>
          </el-row>
        </el-tab-pane>
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
import { db, timestamp } from '../../../main'
import _ from 'lodash'

export default {
  name: 'createForm',
  components: { ArticleDetail },
  data() {
    return {
      pages: [],
      page: {},
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
    inited(viewer) {
      this.$viewer = viewer
    },
    tabClickHandler() {
      this.page = {}
    },
    gotoEditPage(page) {
      // Set Current Page to pass in parameter
      this.page = page
      // goto  another tab;
      this.activeName = 'upload'
    },
    confirmDeletePage(page) {
      this.$confirm('This will permanently delete the Page. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // Delete Record
        db.collection('pages').doc(page._id).delete()
        this.$message({
          type: 'success',
          message: 'Delete completed'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Delete canceled'
        })
      })
    },
    submitPageForm($evt) {
      console.log($evt, this.page)
      if (this.page._id) {
        db.collection('pages').doc(this.page._id).update({
          updated_at: timestamp,
          ...this.page
        }).then(submit_response => console.log(submit_response))
      } else {
        db.collection('pages').add({
          updated_at: timestamp,
          user: 'S',
          ...this.page
        })
      }
    },
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
        width: calc(83% - 20px);
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
