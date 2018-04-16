<template>
  <!-- <article-detail :is-edit='false'></article-detail> -->
  <div style="padding:.8em">
     <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="Search" name="search">
          <el-row>
            <el-col  :span="20">
              <el-input placeholder="Please input" v-model="query_code"></el-input>
              <el-input placeholder="Please input" v-model="query_code"></el-input>
              <el-input placeholder="Please input" v-model="query_code"></el-input>
              <el-input placeholder="Please input" v-model="query_code"></el-input>
              <el-input placeholder="Please input" v-model="query_code"></el-input>
              <el-input placeholder="Please input" v-model="query_code"></el-input>
            </el-col>
            <el-col  :span="4">
              <el-button type="primary" plain @click.prevent="refreshPageList">Refresh List</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-for="page in pages" :key="page.id" :span="6" style="padding-left:.5em; padding-bottom:.8em; padding-top:1em">
              <span style="font-size:1.3em;font-weight:bold">{{page.chapter_title}}</span> <br>
              <span>{{page.domain}}</span> - <span>{{page.area}}</span> <br> 
              <span style="font-size:0.75em;color:grey">
              [{{page.grade}}]  {{page.book_instance_code}} ( {{page.page_number}} ), {{page.rowRef}} {{page.id}}
              </span> <br>
              <!-- <img :src="page.image_path" alt="" style="width: 70%"> -->

              <!-- image viewer component -->
              <!-- <viewer :images="[page.image_path]" style="width: 70%">
                <img v-for="src in [page.image_path]" :src="src" :key="src">
              </viewer> -->
              <div class="viewer-wrapper">
                <viewer :options="viewerOptions" :images="[page.image_path]"
                        class="viewer" ref="viewer"
                >
                  <template slot-scope="scope">
                    <img v-for="src in [page.image_path]" :src="src" :key="src" style="width: 70%">
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

export default {
  name: 'createForm',
  components: { ArticleDetail },
  data() {
    return {
      pages: [],
      query_code: 'Mat_AnyOne_4A_S',
      activeName: 'search', 
      viewerOptions:  { "inline": true, "button": false, "navbar": false, "title": false, "toolbar": true, "tooltip": false, "movable": true, "zoomable": true, "rotatable": true, "scalable": true, "transition": true, "fullscreen": true, "keyboard": false, "url": "data-source" }
    }
  },
  methods: {
    refreshPageList() {
      db.collection('pages')
        .where('book_instance_code', '==', this.query_code)
        .orderBy('page_number').limit(70)
        .get().then(
          snapshot => {
            // console.log(snapshot)
            const _arr = []
            snapshot.forEach(doc => {
              console.log(doc.id, '=>', doc.data())
              _arr.push({ _id: doc.id, ...doc.data() })
            })
            this.pages = [..._arr]
          }
        )
    }
  },
  // firestore() {
  //   return {
  //     pages: db.collection('pages').where('book_instance_code', '==', 'Mat_AnyOne_4A_S').orderBy('page_number').limit(70)
  //   }
  // }
  created() {
    console.log('Created')
    //this.refreshPageList()
  }
}
</script>
