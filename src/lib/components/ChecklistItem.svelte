<script lang="ts">
  import type { ChecklistItem } from '$lib/types';

  let { item, onToggle } = $props<{ item: ChecklistItem; onToggle: (id: string) => void }>();
</script>

<li class="flex items-start gap-3">
  <input
    id={item.id}
    type="checkbox"
    class="mt-1"
    checked={item.checked}
    onchange={() => onToggle(item.id)}
  />
  <label class="select-text leading-6" for={item.id}>{item.text}</label>
</li>
