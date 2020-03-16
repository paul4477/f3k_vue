<template>
<div>
  <div class="row">
    <div class="col-lg">
      <CompChooser />
    </div>
  </div>
      <CompDisplaySlideAll />
</div>
</template>

<script>
// @ is an alias to /src
import CompChooser from '@/components/CompChooser.vue'
import CompDisplaySlideAll from '@/components/CompDisplaySlideAll.vue'

export default {
  name: 'Home',
  components: {
    CompChooser,
    CompDisplaySlideAll
  }
}
</script>
