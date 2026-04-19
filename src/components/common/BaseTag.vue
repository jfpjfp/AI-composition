<script setup lang="ts">
interface Props {
  variant?: 'default' | 'interview' | 'test' | 'offer' | 'rejected'
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
})
</script>

<template>
  <span class="base-tag" :class="`variant-${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.base-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.variant-default {
  background: var(--gray-100);
  color: var(--gray-700);
}

.variant-interview {
  background: rgba(99, 102, 241, 0.1);
  color: var(--primary);
}

.variant-test {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
}

.variant-offer {
  background: var(--success-light);
  color: var(--success);
}

.variant-rejected {
  background: var(--danger-light);
  color: var(--danger);
}
</style>
