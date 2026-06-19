<script>
	import { onMount } from 'svelte';

	let offcanvasEl;
	let offcanvasInstance;

	onMount(() => {
		offcanvasInstance = new bootstrap.Offcanvas(offcanvasEl);
		return () => offcanvasInstance?.dispose();
	});

	function openMenu() {
		offcanvasInstance?.show();
	}
</script>

<nav class="navbar-blur sticky top-0 z-50 d-flex align-items-center justify-content-between px-4 py-3 md:px-6">
	<img src="/assets/logo.png" alt="Logo" class="h-[38px] md:h-[44px]" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.05));" />
	<button
		onclick={openMenu}
		class="btn d-flex align-items-center justify-content-center rounded-xl border-0"
		style="width:42px; height:42px; background:rgba(99,102,241,0.08); transition:all 0.2s ease;"
		type="button"
		onmouseenter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
		onmouseleave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
	>
		<i class="fas fa-bars" style="color:#6366f1; font-size:18px;"></i>
	</button>
</nav>

<div bind:this={offcanvasEl} class="offcanvas offcanvas-end offcanvas-clean" tabindex="-1" id="offcanvasMenu">
	<div class="offcanvas-header border-bottom d-flex align-items-center justify-content-between px-4 py-4" style="border-color:rgba(0,0,0,0.05) !important;">
		<img src="/assets/logo.png" alt="Logo" class="h-[38px]" />
		<button type="button" class="btn-close p-2" data-bs-dismiss="offcanvas" style="opacity:0.4;"></button>
	</div>
	<div class="offcanvas-body px-3 py-2">
		<ul class="nav flex-column gap-1">
			<li class="nav-item">
				<a href="/" class="nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-xl fw-medium transition-all" style="color:#1e293b; font-size:14px; transition:all 0.2s ease;"
					onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#6366f1'; }}
					onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
				>
					<i class="fas fa-home" style="width:24px; text-align:center; color:#6366f1; font-size:16px;"></i> Beranda
				</a>
			</li>
			<li class="nav-item">
				<a href="/cp" class="nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-xl fw-medium transition-all" style="color:#64748b; font-size:14px; transition:all 0.2s ease;"
					onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#6366f1'; }}
					onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
				>
					<i class="fas fa-book-open" style="width:24px; text-align:center; color:#6366f1; font-size:16px;"></i> Cari CP
				</a>
			</li>
			<li class="nav-item">
				<a href="/buku-sd" class="nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-xl fw-medium transition-all" style="color:#64748b; font-size:14px; transition:all 0.2s ease;"
					onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#6366f1'; }}
					onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
				>
					<i class="fas fa-book" style="width:24px; text-align:center; color:#6366f1; font-size:16px;"></i> Buku SD
				</a>
			</li>
			<li class="nav-item">
				<a href="/karya" class="nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-xl fw-medium transition-all" style="color:#64748b; font-size:14px; transition:all 0.2s ease;"
					onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#6366f1'; }}
					onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
				>
					<i class="fas fa-images" style="width:24px; text-align:center; color:#6366f1; font-size:16px;"></i> Galeri Foto
				</a>
			</li>
	
			<li class="nav-item">
				<a href="/mahasiswa" class="nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-xl fw-medium transition-all" style="color:#64748b; font-size:14px; transition:all 0.2s ease;"
					onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#6366f1'; }}
					onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
				>
					<i class="fas fa-users" style="width:24px; text-align:center; color:#6366f1; font-size:16px;"></i> Daftar MHS
				</a>
			</li>
			<li class="nav-item">
				<a href="/spin" class="nav-link d-flex align-items-center gap-3 px-4 py-3 rounded-xl fw-medium transition-all" style="color:#64748b; font-size:14px; transition:all 0.2s ease;"
					onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#6366f1'; }}
					onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; }}
				>
					<i class="fas fa-shuffle" style="width:24px; text-align:center; color:#6366f1; font-size:16px;"></i> Acak MHS
				</a>
			</li>
		</ul>
	</div>
</div>
