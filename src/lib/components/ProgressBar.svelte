<script lang="ts">
  let { value, label = '' } = $props<{ value: number; label?: string }>();
  const percent = $derived(Math.round(Math.max(0, Math.min(1, value)) * 100));
</script>

<div class="w-full" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={label || `${percent}%`}>
  <div class="h-2 w-full rounded bg-gray-200">
    <div class="h-2 rounded bg-green-500 transition-[width]" style={`width: ${percent}%`}></div>
  </div>
  <div class="mt-1 text-xs text-gray-600">{label || `${percent}%`}</div>
</div>
