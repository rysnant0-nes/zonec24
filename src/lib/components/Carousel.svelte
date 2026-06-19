<script>
	import { onMount } from 'svelte';

	let { slides } = $props();
	let carouselEl;
	let carouselInstance;

	onMount(() => {
		carouselInstance = new bootstrap.Carousel(carouselEl, {
			interval: 4000,
			ride: 'carousel',
			pause: 'hover'
		});
		return () => carouselInstance?.dispose();
	});
</script>

<div bind:this={carouselEl} id="heroCarousel" class="carousel slide rounded-3 overflow-hidden clean-shadow" data-bs-ride="carousel">
	<div class="carousel-indicators" style="bottom:12px;">
		{#each slides as _, i}
			<button type="button" data-bs-target="#heroCarousel" data-bs-slide-to={i} class={i === 0 ? 'active' : ''} aria-label="Slide {i + 1}"></button>
		{/each}
	</div>
	<div class="carousel-inner rounded-3">
		{#each slides as slide, i}
			<div class="carousel-item {i === 0 ? 'active' : ''}">
				<img src={slide} class="d-block w-100 h-[220px] sm:h-[320px] md:h-[420px] lg:h-[500px]" style="object-fit:cover; border-radius:12px;" alt="Slide {i + 1}" />
			</div>
		{/each}
	</div>
	<button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev" aria-label="Sebelumnya">
		<span class="carousel-control-prev-icon"></span>
	</button>
	<button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next" aria-label="Selanjutnya">
		<span class="carousel-control-next-icon"></span>
	</button>
</div>
