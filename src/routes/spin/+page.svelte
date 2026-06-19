<svelte:head>
	<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
</svelte:head>

<script>
	import { onMount } from 'svelte';

	let names = $state('');
	let result = $state('');
	let selectedNames = $state([]);
	let loading = $state(false);

	function truncate(text, max) {
		return text.length > max ? text.substring(0, max) + '...' : text;
	}

	function saveData() {
		localStorage.setItem('spinInput', names);
		localStorage.setItem('spinSelected', JSON.stringify(selectedNames));
	}

	onMount(() => {
		const saved = localStorage.getItem('spinInput');
		if (saved) names = saved;
		const sel = JSON.parse(localStorage.getItem('spinSelected') || '[]');
		selectedNames = sel;
	});

	function spin() {
		const arr = names.split('\n').map((n) => n.trim()).filter((n) => n.length > 0);
		if (arr.length === 0) {
			alert('Tidak ada nama yang tersedia untuk dipilih!');
			return;
		}
		loading = true;
		setTimeout(() => {
			const idx = Math.floor(Math.random() * arr.length);
			let winner = arr[idx];
			winner = truncate(winner, 24);
			result = winner;
			arr.splice(idx, 1);
			names = arr.join('\n');
			selectedNames = [...selectedNames, winner];
			saveData();
			loading = false;
		}, 2000);
	}

	function reset() {
		localStorage.removeItem('spinInput');
		localStorage.removeItem('spinSelected');
		names = '';
		result = '';
		selectedNames = [];
	}

	async function loadMhs() {
		const res = await fetch('/assets/mhs.json');
		const data = await res.json();
		names = data.join('\n');
		saveData();
	}
</script>

{#if loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center" style="background:rgba(255,255,255,0.85); backdrop-filter:blur(8px);">
		<div class="text-center glass-card rounded-3 px-8 py-6">
			<h1 class="text-xl fw-bold mb-2" style="color:#6366f1;">SEDANG MENGACAK</h1>
			<lottie-player
				src="/assets/spin-loader.json"
				background="transparent"
				speed="0.8"
				style="width:280px; height:120px;"
				loop
				autoplay
			></lottie-player>
		</div>
	</div>
{/if}

<div class="py-6 px-3 md:py-10 md:px-4">
	<div class="max-w-5xl mx-auto">
		<div class="text-center mb-6 md:mb-8">
			<img src="/assets/spin-logo.png" alt="PGSD C 2024" class="mx-auto" style="width:300px; max-width:85%;" />
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
			<div class="glass-card rounded-3 p-4 md:p-6">
				<h2 class="text-lg fw-semibold mb-3 d-flex align-items-center gap-2" style="color:#1e293b;">
					<i class="fas fa-users" style="color:#6366f1;"></i> Daftar Nama
				</h2>
				<textarea
					bind:value={names}
					oninput={saveData}
					class="w-full p-3 rounded-xl border-0"
					rows="10"
					placeholder="Masukkan nama, pisahkan dengan enter"
					style="background:rgba(99,102,241,0.04); color:#1e293b; font-size:14px; resize:vertical; outline:none;"
				></textarea>
				<div class="d-flex flex-wrap gap-2 mt-3">
					<button onclick={spin}
						class="btn d-flex align-items-center gap-2 px-4 py-2 rounded-xl border-0 fw-semibold text-white"
						style="background:#6366f1; font-size:14px;"
						onmouseenter={(e) => e.currentTarget.style.background = '#4f46e5'}
						onmouseleave={(e) => e.currentTarget.style.background = '#6366f1'}
					>
						<i class="fas fa-shuffle"></i> Putar
					</button>
					<button onclick={reset}
						class="btn d-flex align-items-center gap-2 px-4 py-2 rounded-xl border-0 fw-semibold"
						style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:14px;"
						onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
						onmouseleave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
					>
						<i class="fas fa-rotate-left"></i> Reset
					</button>
					<button onclick={loadMhs}
						class="btn d-flex align-items-center gap-2 px-4 py-2 rounded-xl border-0 fw-semibold"
						style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:14px;"
						onmouseenter={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; }}
						onmouseleave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
					>
						<i class="fas fa-file-import"></i> Mahasiswa C
					</button>
				</div>
			</div>

			<div class="d-flex flex-column gap-3 md:gap-4">
				<div class="glass-card rounded-3 p-4 md:p-6">
					<div class="d-flex align-items-center gap-3 mb-2">
						<h2 class="text-lg fw-semibold mb-0" style="color:#1e293b;">
							<i class="fas fa-trophy me-2" style="color:#6366f1;"></i> HASIL
						</h2>
					</div>
					<div class="rounded-2 p-3" style="background:rgba(99,102,241,0.04); min-height:52px;">
						<h1 class="fw-bold mb-0" style="color:#6366f1; font-size:1.4rem;">{result || '—'}</h1>
					</div>
				</div>

				<div class="glass-card rounded-3 p-4 md:p-6">
					<h2 class="text-lg fw-semibold mb-3 d-flex align-items-center gap-2" style="color:#1e293b;">
						<i class="fas fa-list" style="color:#6366f1;"></i> Terpilih
						{#if selectedNames.length > 0}
							<span class="badge rounded-pill fw-normal ms-auto" style="background:rgba(99,102,241,0.12); color:#6366f1; font-size:12px;">{selectedNames.length}</span>
						{/if}
					</h2>
					<div class="d-flex flex-column gap-2" style="max-height:320px; overflow-y:auto;">
						{#if selectedNames.length === 0}
							<p class="text-center mb-0 py-4" style="color:#94a3b8; font-size:14px;">Belum ada yang terpilih</p>
						{:else}
							{#each selectedNames as name, i}
								<div class="d-flex align-items-center gap-2 rounded-2 px-3 py-2" style="background:rgba(99,102,241,0.04);">
									<span class="d-flex align-items-center justify-content-center fw-bold rounded-circle" style="width:26px; height:26px; background:#6366f1; color:white; font-size:12px; flex-shrink:0;">{i + 1}</span>
									<span class="fw-medium" style="color:#1e293b; font-size:14px;">{name}</span>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
