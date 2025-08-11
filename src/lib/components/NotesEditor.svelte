<script lang="ts">
	let { id, value, onInput } = $props<{
		id: string;
		value: string;
		onInput: (value: string) => void;
	}>();

	function handleInput(e: Event) {
		const el = e.target as HTMLTextAreaElement;
		onInput(el.value);
	}
</script>

<label class="mb-1 block text-sm font-medium text-gray-700" for={id}>Notes</label>
<textarea {id} class="w-full rounded border p-2" rows={4} {value} oninput={handleInput}></textarea>
