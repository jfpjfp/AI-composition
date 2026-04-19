import { ref, computed } from 'vue'

export function useSearch<T>(
  items: () => T[],
  searchFields: (item: T) => [string, string]
) {
  const keyword = ref('')

  const filteredItems = computed(() => {
    if (!keyword.value.trim()) {
      return items()
    }
    const kw = keyword.value.toLowerCase()
    return items().filter(item => {
      const [field1, field2] = searchFields(item)
      return field1.toLowerCase().includes(kw) || field2.toLowerCase().includes(kw)
    })
  })

  function setKeyword(value: string): void {
    keyword.value = value
  }

  return {
    keyword,
    filteredItems,
    setKeyword
  }
}
