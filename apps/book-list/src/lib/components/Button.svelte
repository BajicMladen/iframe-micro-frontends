<script>
  export let variant = 'primary'
  export let type = 'button'
  export let disabled = false

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()

  const handleClick = () => {
    dispatch('click')
  }

  let baseStyles = 'px-4 py-2 focus:outline-none w-full'
  $: variantStyles =
    variant === 'primary'
      ? 'bg-purple-500 text-white border-white border'
      : 'bg-white border border-purple-500 text-purple-500'
</script>

<button class={`${baseStyles} ${variantStyles}`} {type} {disabled} aria-disabled={disabled} on:click={handleClick}>
  <slot></slot>
</button>
