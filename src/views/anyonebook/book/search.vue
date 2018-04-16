<template>
  <article-detail :is-edit='false'></article-detail>
</template>

<script>
/*
 * @TODO: Book Preview
 * */
import ArticleDetail from './components/ArticleDetail'

export default {
  name: 'createForm',
  components: { ArticleDetail }
}
</script>
