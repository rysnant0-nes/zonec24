<script>
	import '../app.css';
	import Nav from '$lib/components/Nav.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		document.addEventListener('contextmenu', (e) => e.preventDefault());
		document.addEventListener('keydown', (e) => {
			if (
				(e.ctrlKey && e.key.toLowerCase() === 'u') ||
				e.key === 'F12' ||
				(e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 'i' || e.key.toLowerCase() === 'c'))
			) {
				e.preventDefault();
			}
		});

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
					}
				});
			},
			{ threshold: 0.1 }
		);
		document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));
	});
</script>

<Nav />
<main class="py-4 px-3 pb-20 md:pb-4" style="max-width:900px; margin:0 auto;">
	{@render children()}
</main>
<BottomNav />
<Footer />
