<script>
	import { page } from '$app/stores';

	let links = [
		{ href: '/', icon: 'fa-home', label: 'Beranda' },
		{ href: '/cp', icon: 'fa-book-open', label: 'CP' },
		{ href: '/buku-sd', icon: 'fa-book', label: 'Buku' },
		{ href: '/karya', icon: 'fa-images', label: 'Galeri' },
		{ href: '/mahasiswa', icon: 'fa-users', label: 'MHS' },
		{ href: '/spin', icon: 'fa-shuffle', label: 'Acak' },
	];

	let currentPath = $derived($page.url.pathname);

	function isActive(href) {
		if (href === '/') return currentPath === '/';
		return currentPath.startsWith(href);
	}
</script>

<nav class="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-1 md:hidden"
	style="background:rgba(255,255,255,0.9); backdrop-filter:blur(20px); border-top:1px solid rgba(0,0,0,0.05); padding-bottom:calc(env(safe-area-inset-bottom, 0px) + 4px);">
	{#each links as link}
		<a
			href={link.href}
			class="flex flex-column align-items-center justify-content-center text-decoration-none py-1 px-2 rounded-xl transition-all"
			style="min-width:60px;"
			class:active={isActive(link.href)}
		>
			<i class="fas {link.icon}" style="font-size:18px; transition:all 0.2s ease;"></i>
			<span class="fw-medium" style="font-size:10px; margin-top:2px; transition:all 0.2s ease;">{link.label}</span>
		</a>
	{/each}
</nav>

<style>
	a {
		color: #94a3b8;
	}
	a.active {
		color: #6366f1;
	}
	a.active i {
		text-shadow: 0 0 12px rgba(99, 102, 241, 0.3);
	}
	a:not(.active):hover {
		color: #64748b;
		background: rgba(99, 102, 241, 0.04);
	}
</style>
