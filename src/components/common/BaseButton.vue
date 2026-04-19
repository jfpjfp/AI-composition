<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md'
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <button
    class="base-button"
    :class="[`variant-${variant}`, `size-${size}`]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  border: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.size-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.size-md {
  padding: 10px 20px;
  font-size: 14px;
}

.variant-primary {
  background: var(--primary);
  color: white;
}

.variant-primary:hover {
  background: var(--primary-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.variant-ghost {
  background: transparent;
  color: var(--gray-700);
}

.variant-ghost:hover {
  background: var(--gray-100);
}

.variant-danger {
  background: var(--danger);
  color: white;
}

.variant-danger:hover {
  opacity: 0.9;
}
</style>
