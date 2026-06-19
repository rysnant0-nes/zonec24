<script>
	import Carousel from '$lib/components/Carousel.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import Gallery from '$lib/components/Gallery.svelte';

	const slides = [
		'/assets/slide (1).jpeg',
		'/assets/slide (2).jpeg',
		'/assets/slide (3).jpeg'
	];

	const features = [
		{ href: '/cp', icon: 'fa-book-open', label: 'Cari CP', desc: 'Capaian Pembelajaran kurikulum' },
		{ href: '/buku-sd', icon: 'fa-book', label: 'Buku SD', desc: 'Katalog buku SD dari SIBI' },
		{ href: '/karya', icon: 'fa-images', label: 'Galeri Foto', desc: 'Dokumentasi PGSD C 2024' },
		{ href: '/mahasiswa', icon: 'fa-users', label: 'Daftar MHS', desc: 'Data mahasiswa PGSD C 2024' },
		{ href: '/spin', icon: 'fa-shuffle', label: 'Acak MHS', desc: 'Acak nama mahasiswa' }
	];

	let previewSrc = $state('');
	let previewOpen = $state(false);

	function openPreview(src) {
		previewSrc = src;
		previewOpen = true;
	}

	function closePreview() {
		previewOpen = false;
	}
</script>

<div>
	<Carousel {slides} />

	<div class="text-center py-5 fade-in" role="button" tabindex="0" onclick={() => openPreview('/assets/zonec.png')} onkeydown={(e) => e.key === 'Enter' && openPreview('/assets/zonec.png')}>
		<img src="/assets/zonec.png" alt="ZONEC" class="d-inline-block" style="height:50px; cursor:pointer; transition:all 0.3s ease; filter:drop-shadow(0 2px 8px rgba(99,102,241,0.15));"
			onmouseenter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.filter = 'drop-shadow(0 4px 16px rgba(99,102,241,0.25))'; }}
			onmouseleave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.filter = ''; }}
		/>
	</div>

	<div class="glass-card rounded-4 p-4 md:p-5 mb-4 fade-in">
		<p class="text-center text-sm md:text-base fw-light" style="color:#475569; line-height:1.8;">
			<i class="fas fa-quote-left me-2" style="color:#6366f1;"></i>
			Website ini dibuat untuk dokumentasi mahasiswa PGSD Kelas C angkatan 24 dan salah satu bentuk untuk mempermudah kegiatan belajar dengan membuat webapp.
		</p>
		<div class="mx-auto mt-3 rounded-pill" style="width:50px; height:3px; background:linear-gradient(to right, #6366f1, #a78bfa); opacity:0.5;"></div>
	</div>

	<div class="text-center py-4 fade-in" role="button" tabindex="0" onclick={() => openPreview('/assets/webapp.png')} onkeydown={(e) => e.key === 'Enter' && openPreview('/assets/webapp.png')}>
		<img src="/assets/webapp.png" alt="WebApp" class="d-inline-block" style="height:40px; cursor:pointer; transition:all 0.3s ease; filter:drop-shadow(0 2px 8px rgba(99,102,241,0.12));"
			onmouseenter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
			onmouseleave={(e) => e.currentTarget.style.transform = ''}
		/>
	</div>

	<div class="d-flex flex-wrap justify-content-center gap-3 pb-4 fade-in">
		{#each features as f}
			<FeatureCard href={f.href} icon={f.icon} label={f.label} desc={f.desc} />
		{/each}
	</div>

	<Gallery />
</div>

{#if previewOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="preview-overlay" style="display:flex;" onclick={closePreview}>
		<img src={previewSrc} alt="Preview" class="show" />
	</div>
{/if}
