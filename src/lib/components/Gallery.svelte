<script>
	let previewSrc = $state('');
	let previewOpen = $state(false);

	function openPreview(src) {
		previewSrc = src;
		previewOpen = true;
	}

	function closePreview() {
		previewOpen = false;
	}

	const images = ['1', '2', '3', '4'];
</script>

<div class="container-fluid px-0 pb-4">
	<div class="row g-3">
		{#each images as i}
			<div class="col-6" role="button" tabindex="0" onclick={() => openPreview(`/assets/pgsd (${i}).png`)} onkeydown={(e) => e.key === 'Enter' && openPreview(`/assets/pgsd (${i}).png`)}>
				<div class="position-relative rounded-3 overflow-hidden clean-shadow" style="transition:all 0.3s ease;"
					onmouseenter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)'; }}
					onmouseleave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
				>
					<img
						src="/assets/pgsd ({i}).png"
						alt="Foto {i}"
						class="w-100 d-block"
						style="height:180px; object-fit:cover; transition:transform 0.5s ease;"
						onmouseenter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
						onmouseleave={(e) => e.currentTarget.style.transform = ''}
					/>
					<div class="position-absolute top-0 end-0 m-2 rounded-2 d-flex align-items-center justify-content-center" style="width:32px; height:32px; background:rgba(255,255,255,0.85); backdrop-filter:blur(4px); opacity:0; transition:opacity 0.3s ease;"
						onmouseenter={(e) => e.currentTarget.style.opacity = '1'}
						onmouseleave={(e) => e.currentTarget.style.opacity = '0'}
					>
						<i class="fas fa-expand" style="color:#64748b; font-size:12px;"></i>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

{#if previewOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="preview-overlay" style="display:flex;" onclick={closePreview}>
		<img src={previewSrc} alt="Preview" class="show" />
	</div>
{/if}
