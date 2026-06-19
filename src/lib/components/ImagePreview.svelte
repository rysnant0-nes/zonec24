<script>
	let { src, open, closePreview } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
{#if open}
	<div
		class="fixed inset-0 z-[9999] flex justify-center items-center"
		style="background:rgba(0,0,0,0.9); backdrop-filter:blur(8px)"
		onclick={closePreview}
	>
		<img
			src={src}
			alt="Preview"
			class="max-w-[90%] max-h-[90%] rounded-xl shadow-[0_0_40px_rgba(167,139,250,0.3)]"
		/>
	</div>
{/if}
