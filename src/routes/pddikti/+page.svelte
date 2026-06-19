<script>
	let search = $state('');
	let results = $state([]);
	let loading = $state(false);
	let errorMsg = $state('');
	let searched = $state(false);
	let detail = $state(null);
	let detailLoading = $state(false);

	const API = 'https://pddikti.fastapicloud.dev/api';

	function isUnirow(item) {
		const pt = (item.nama_pt || '').toUpperCase();
		const singkat = (item.sinkatan_pt || '').toUpperCase();
		return pt.includes('PGRI RONGGOLAWE') || singkat === 'UNIROW';
	}

	async function cari() {
		const q = search.trim();
		if (!q) return;
		loading = true;
		errorMsg = '';
		results = [];
		searched = true;
		try {
			const res = await fetch(`${API}/search/mhs/${encodeURIComponent(q)}/`);
			if (!res.ok) throw new Error('Gagal memuat data');
			const json = await res.json();
			const data = json.value || [];
			results = data.filter(isUnirow);
		} catch (e) {
			errorMsg = e.message || 'Terjadi kesalahan';
		}
		loading = false;
	}

	async function openDetail(id) {
		detailLoading = true;
		detail = null;
		try {
			const res = await fetch(`${API}/mhs/detail/${encodeURIComponent(id)}/`);
			if (!res.ok) throw new Error('Gagal memuat detail');
			detail = await res.json();
		} catch (e) {
			alert('Gagal memuat detail');
		}
		detailLoading = false;
	}

	function closeDetail() {
		detail = null;
	}
</script>

<div class="py-6 px-3 md:py-10 md:px-4">
	<div class="max-w-5xl mx-auto">
		<div class="d-flex align-items-center justify-content-between mb-4">
			<div>
				<h1 class="text-2xl md:text-3xl fw-bold" style="color:#1e293b;">
					<i class="fas fa-graduation-cap me-2" style="color:#6366f1;"></i> PDDikti
				</h1>
				<p class="mt-1" style="color:#64748b; font-size:14px;">Cari Mahasiswa Universitas PGRI Ronggolawe (UNIROW) Tuban</p>
			</div>
		</div>

		<div class="glass-card rounded-3 p-4 md:p-6 mb-4">
			<div class="d-flex gap-2">
				<div class="position-relative flex-grow-1">
					<i class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3" style="color:#94a3b8; font-size:14px;"></i>
					<input
						bind:value={search}
						onkeydown={(e) => { if (e.key === 'Enter') cari(); }}
						placeholder="Cari nama mahasiswa..."
						class="form-control border-0 rounded-pill ps-5 py-2"
						style="background:rgba(99,102,241,0.04); font-size:14px; color:#1e293b;"
					/>
				</div>
				<button
					onclick={cari}
					disabled={!search.trim() || loading}
					class="btn rounded-pill border-0 fw-medium px-4"
					style="background:#6366f1; color:white; font-size:13px; white-space:nowrap;">
					<i class="fas {loading ? 'fa-spinner fa-spin' : 'fa-search'} me-1"></i> Cari
				</button>
			</div>
			<div class="mt-2 d-flex align-items-center gap-2 flex-wrap">
				<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.1); color:#6366f1; font-size:12px;">
					<i class="fas fa-database me-1"></i> Sumber: PDDikti
				</span>
				{#if results.length > 0}
					<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.06); color:#64748b; font-size:12px;">
						{results.length} mahasiswa UNIROW
					</span>
				{/if}
			</div>
		</div>

		{#if loading}
			<div class="text-center py-5">
				<div class="spinner-border" style="color:#6366f1;" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-2" style="color:#64748b;">Mencari data...</p>
			</div>
		{:else if errorMsg}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-exclamation-triangle mb-3" style="font-size:40px; color:#f59e0b;"></i>
				<p class="mb-0">{errorMsg}</p>
				<button onclick={cari} class="btn btn-sm rounded-pill mt-3" style="background:#6366f1; color:white;">
					<i class="fas fa-refresh me-1"></i> Coba Lagi
				</button>
			</div>
		{:else if searched && results.length === 0}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-user-graduate mb-3" style="font-size:40px; color:#cbd5e1;"></i>
				<p class="mb-0">Tidak ada mahasiswa UNIROW dengan nama "{search}"</p>
			</div>
		{:else if !searched}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-search mb-3" style="font-size:40px; color:#cbd5e1;"></i>
				<p class="mb-0">Ketik nama mahasiswa lalu klik Cari</p>
			</div>
		{/if}

		{#if results.length > 0}
			<div class="glass-card rounded-3 p-4 md:p-6">
				<div class="d-none d-md-block">
					<table class="table table-borderless mb-0">
						<thead>
							<tr style="border-bottom:1px solid rgba(99,102,241,0.1);">
								<th class="fw-semibold py-2 text-center" style="width:50px; color:#64748b; font-size:12px;">#</th>
								<th class="fw-semibold py-2" style="color:#64748b; font-size:12px;">NAMA</th>
								<th class="fw-semibold py-2" style="color:#64748b; font-size:12px;">NIM</th>
								<th class="fw-semibold py-2" style="color:#64748b; font-size:12px;">PRODI</th>
								<th class="fw-semibold py-2 text-center" style="width:60px; color:#64748b; font-size:12px;"></th>
							</tr>
						</thead>
						<tbody>
							{#each results as m, i}
								<tr
									class="transition-all"
									style="border-bottom:1px solid rgba(0,0,0,0.03); cursor:pointer;"
									onmouseenter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
									onmouseleave={(e) => e.currentTarget.style.background = ''}
									onclick={() => openDetail(m.id)}
								>
									<td class="py-2 text-center" style="font-size:12px; color:#94a3b8;">{i + 1}</td>
									<td class="py-2" style="font-size:14px; color:#1e293b; font-weight:500;">{m.nama}</td>
									<td class="py-2" style="font-size:13px; color:#64748b;">{m.nim}</td>
									<td class="py-2" style="font-size:13px; color:#64748b;">{m.nama_prodi}</td>
									<td class="py-2 text-center">
										<i class="fas fa-chevron-right" style="color:#6366f1; font-size:12px;"></i>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
				<div class="d-flex d-md-none flex-column gap-2">
					{#each results as m, i}
						<button
							class="d-flex align-items-center w-100 text-start rounded-xl border-0 p-3"
							style="background:rgba(99,102,241,0.03); color:#1e293b;"
							onclick={() => openDetail(m.id)}
						>
							<span class="d-flex align-items-center justify-content-center fw-bold rounded-circle me-3 flex-shrink-0" style="width:28px; height:28px; background:rgba(99,102,241,0.1); color:#6366f1; font-size:12px;">{i + 1}</span>
							<div class="flex-grow-1">
								<div class="fw-medium" style="font-size:14px;">{m.nama}</div>
								<div style="color:#94a3b8; font-size:12px;">{m.nim} &middot; {m.nama_prodi}</div>
							</div>
							<i class="fas fa-chevron-right" style="color:#6366f1; font-size:12px;"></i>
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

{#if detail}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="preview-overlay"
		style="display:flex;"
		onclick={closeDetail}
	>
		<div
			class="glass-card rounded-3 p-4 md:p-6"
			style="max-width:480px; width:90%; max-height:90%; overflow-y:auto;"
			onclick={(e) => e.stopPropagation()}
		>
			{#if detailLoading}
				<div class="text-center py-5">
					<div class="spinner-border" style="color:#6366f1;" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
			{:else}
				<div class="d-flex align-items-start justify-content-between mb-3">
					<h2 class="fw-bold" style="color:#1e293b; font-size:18px;">Detail Mahasiswa</h2>
					<button onclick={closeDetail} class="btn border-0 p-1 rounded-circle d-flex align-items-center justify-content-center" style="width:32px; height:32px; background:rgba(0,0,0,0.05); color:#64748b;">
						<i class="fas fa-times"></i>
					</button>
				</div>
				<div class="d-flex flex-column gap-2">
					<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.04);">
						<div style="font-size:20px; font-weight:700; color:#1e293b;">{detail.nama}</div>
						<div style="color:#6366f1; font-size:13px; font-weight:500;">{detail.nim}</div>
					</div>
					<div class="row g-2">
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">PT</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.nama_pt}</div>
							</div>
						</div>
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Prodi</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.prodi}</div>
							</div>
						</div>
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Jenjang</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.jenjang || '-'}</div>
							</div>
						</div>
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Jenis Kelamin</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.jenis_kelamin === 'L' ? 'Laki-laki' : detail.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</div>
							</div>
						</div>
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Status</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.status_saat_ini || '-'}</div>
							</div>
						</div>
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Tgl Masuk</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.tanggal_masuk || '-'}</div>
							</div>
						</div>
						<div class="col-6">
							<div class="rounded-xl p-3" style="background:rgba(99,102,241,0.03);">
								<div style="color:#94a3b8; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">Jenis Daftar</div>
								<div style="color:#1e293b; font-size:13px; font-weight:500;">{detail.jenis_daftar || '-'}</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
