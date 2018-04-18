<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card"  @tab-click="tabClickHandler" >
      <el-tab-pane label="Search" name="search">
        <!-- Search Parameter Form -->
        <el-form ref="form"  label-width="9.5em" size="mini">
          <el-row class="custom-compact-form">
            <el-col  :span="8">
              <el-form-item label="Syllabus Code">
                <el-input v-model="filter.syllabus_code"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :span="8">
              <el-form-item label="Domain">
                <el-input v-model="filter.domain"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :span="8">
              <el-form-item label="Area">
                <el-input v-model="filter.area"></el-input>
              </el-form-item>
            </el-col>
            <el-col  :span="8">
              <el-form-item label="Knowledge Unit">
                <el-input v-model="filter.knowledge_unit"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
             <el-col  :span="8">
              <el-button 
              @click.prevent="getDomainList"
              type="primary" plain>
                <span>Refresh Domain List</span>
              </el-button>
            </el-col>
          </el-row>        
        </el-form>

        <!-- Record Listing -->
        <!--
           {
            "syllabus_code": "hk_maths_2000",
            "domain": "數",
            "area": "三位、四位、五位及多位數",
            "knowledge_unit": "多位數",
            "learning_objective": "大數量的估計",
            "particular": "認識大數量的估計",
            "grade": 5,
            "level_of_difficulty": 500
          }
        -->
        <el-table
          :data="domains"
          style="width: 100%">
          <el-table-column fixed prop="syllabus_code" label="Syllabus Code" width="150"> </el-table-column>
          <el-table-column prop="domain" label="Domain" width="100"> </el-table-column>
          <el-table-column prop="area" label="Area" width="120"> </el-table-column>
          <el-table-column prop="knowledge_unit" label="Knowledge Unit" width="150"> </el-table-column>
          <el-table-column prop="learning_objective" label="Learning Objective" width="200"> </el-table-column>
          <el-table-column prop="particular" label="Particular" width="250"> </el-table-column>
          <el-table-column prop="grade" label="班別" width="35"> </el-table-column>
          <el-table-column prop="level_of_difficulty" label="難度" width="50"> </el-table-column>
          
          <el-table-column
            fixed="right"
            label="Operations"
            width="120">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click=" gotoDomainForm(scope.row)">Edit</el-button> <br>
              <el-button type="danger" size="small" @click=" confirmDeleteDomain(scope.row)">Delete</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Add Domain" name="form">
        <!-- Create / Edit Form -->
        <h4> {{domain._id?'Update':'Create'}} Domain</h4>
        <el-form ref="form"  label-width="9em" size="mini">
          <el-row class="custom-compact-form">
            <el-col :span="8" 
            v-for='field in ["syllabus_code", "domain", "area", "knowledge_unit", "learning_objective", "particular", "grade", "level_of_difficulty"]'
            :key='field'
            >
               <el-form-item :label="field">
                <el-input v-model="domain[field]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item size="mini">
              <el-button type="primary" @click.stop="submitDomainForm" >{{domain._id?'Update':'Create'}}</el-button>
              <el-button @click="activeName='search'">Back</el-button>
            </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import { db, timestamp } from '../../../main'
// import { db } from '../../../main'
export default {
  name: 'KnowledgeDomain',
  data() {
    return {
      filter: {
        syllabus_code: 'hk_maths_2000',
        domain: '',
        area: '',
        knowledge_unit: ''
      },
      activeName: 'search',
      domain: {},
      domains: []
    }
  },
  filters: {
  },
  created() {
  },
  methods: {
    tabClickHandler() {
      this.domain = {}
    },
    gotoDomainForm(domain) {
      this.activeName = 'form'
      this.domain = domain
    },
    confirmDeleteDomain(domain) {
      this.$confirm(`This will permanently delete the Domain \n (${domain.domain} , ${domain.area}, ${domain.knowledge_unit}, ${domain.learning_objective}, ${domain.particular} ) . Continue?`, 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        // Delete Record
        db.collection('domains').doc(domain._id).delete()
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
    submitDomainForm($evt) {
      const domain = this.domain
      const message = `${domain.domain} , ${domain.area}, ${domain.knowledge_unit}, ${domain.learning_objective}, ${domain.particular} `
      if (domain._id) {
        db.collection('domains').doc(domain._id).update({
          updated_at: timestamp,
          ...domain
        }).then(submit_response => this.$notify.info({
          title: 'Domain Modified',
          message
        })).catch((error) => {
          this.$notify.error({
            title: 'Error',
            message: error
          })
        })
      } else {
        db.collection('domains').add({
          updated_at: timestamp,
          ...domain
        }).then((submit_response) => {
          this.$notify.info({
            title: 'Domain Added',
            message
          })
          this.domain = {}
        }).catch((error) => {
          this.$notify.error({
            title: 'Error',
            message: error
          })
        })
      }
    },
    getDomainList() {
      let domainRef = db.collection('domains')
      for (const key in this.filter) {
        if (key && this.filter[key] && this.filter[key].trim()) {
          domainRef = domainRef.where(key, '==', this.filter[key])
        }
      }
      domainRef
        .limit(100)
        .get()
        .then(snapshot => {
          // console.log(snapshot)
          const _arr = []
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data())
            _arr.push({ _id: doc.id, ...doc.data() })
          })
          // this.pages = [..._arr]
          this.domains = _.orderBy(_arr, ['syllabus_code', 'domain', 'area', 'knowledge_unit', 'learning_objective', 'grade'])
        })
        .catch(err => console.log(err))
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .custom-compact-form {
    .el-form-item{
      margin-bottom: 0.2em
    }
  }
</style>
