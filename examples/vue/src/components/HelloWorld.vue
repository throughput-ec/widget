<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <throughput-widget identifier="r3d100011761" :link.prop="this.dsid" additional-type="site" read-only-mode="true" />
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    dsid: String // dataset ID for Throughput Annotation Widget
  }
}
</script>
