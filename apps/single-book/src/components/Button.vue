<template>
  <button
    :class="[baseStyles, variantStyles]"
    :type="type"
    :disabled="disabled"
    :aria-disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    baseStyles() {
      return 'px-4 py-2 focus:outline-none w-full';
    },
    variantStyles() {
      return this.variant === 'primary'
        ? 'bg-purple-500 text-white border-white border'
        : 'bg-white border border-purple-500 text-purple-500';
    },
  },
  methods: {
    handleClick() {
      this.$emit('click');
    },
  },
};
</script>
