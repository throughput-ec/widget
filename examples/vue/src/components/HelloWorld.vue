<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <throughput-widget identifier="r3d100011761" level="site" :link.prop="this.dsid" read-only-mode="false" />
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
