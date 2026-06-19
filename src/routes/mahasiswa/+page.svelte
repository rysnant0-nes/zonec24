<script>
	let data = $state([]);
	let search = $state('');
	let loading = $state(true);

	$effect(() => {
		fetch('/assets/mhs.json')
			.then((r) => r.json())
			.then((d) => { data = d; loading = false; })
			.catch(() => { loading = false; });
	});

	let filtered = $derived(
		search
			? data.filter((n) => n.toLowerCase().includes(search.toLowerCase()))
			: data
	);
</script>

<div class="py-6 px-3 md:py-10 md:px-4">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-6 md:mb-8">
			<h1 class="text-2xl md:text-3xl fw-bold" style="color:#1e293b;">
				<i class="fas fa-users me-2" style="color:#6366f1;"></i> Daftar Mahasiswa
			</h1>
			<p class="mt-2" style="color:#64748b; font-size:14px;">PGSD Kelas C Angkatan 2024</p>
		</div>

		<div class="glass-card rounded-3 p-4 md:p-6 mb-4 md:mb-6">
			<div class="position-relative">
				<i class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3" style="color:#94a3b8; font-size:14px;"></i>
				<input
					bind:value={search}
					placeholder="Cari nama..."
					class="form-control border-0 rounded-pill ps-5 py-2"
					style="background:rgba(99,102,241,0.04); font-size:14px; color:#1e293b;"
				/>
			</div>
			<div class="mt-3 d-flex align-items-center gap-2 flex-wrap">
				<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.1); color:#6366f1; font-size:12px;">
					{data.length} mahasiswa
				</span>
				{#if search}
					<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.06); color:#64748b; font-size:12px;">
						filter: {filtered.length} ditemukan
					</span>
				{/if}
			</div>
		</div>

		{#if loading}
			<div class="text-center py-5">
				<div class="spinner-border" style="color:#6366f1;" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-2" style="color:#64748b;">Memuat data...</p>
			</div>
		{:else}
			<div class="glass-card rounded-3 p-4 md:p-6">
				{#if filtered.length === 0}
					<div class="text-center py-5" style="color:#94a3b8;">
						<i class="fas fa-search mb-2" style="font-size:24px;"></i>
						<p class="mb-0">Tidak ada mahasiswa dengan nama "{search}"</p>
					</div>
				{:else}
					<div class="d-none d-md-block">
						<table class="table table-borderless mb-0">
							<thead>
								<tr style="border-bottom:1px solid rgba(99,102,241,0.1);">
									<th class="fw-semibold py-2 text-center" style="width:50px; color:#64748b; font-size:12px;">#</th>
									<th class="fw-semibold py-2" style="color:#64748b; font-size:12px;">NAMA</th>
								</tr>
							</thead>
							<tbody>
								{#each filtered as name, i}
									<tr
										class="transition-all"
										style="border-bottom:1px solid rgba(0,0,0,0.03);"
										onmouseenter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.03)'}
										onmouseleave={(e) => e.currentTarget.style.background = ''}
									>
										<td class="py-2 text-center" style="font-size:12px; color:#94a3b8;">{i + 1}</td>
										<td class="py-2" style="font-size:14px; color:#1e293b; font-weight:500;">{name}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					<div class="d-flex d-md-none flex-column gap-2">
						{#each filtered as name, i}
							<div
								class="btn d-flex align-items-center w-100 text-start rounded-xl border-0 p-3"
								style="background:rgba(99,102,241,0.03); color:#1e293b; cursor:default;"
							>
								<span class="d-flex align-items-center justify-content-center fw-bold rounded-circle me-3 flex-shrink-0" style="width:28px; height:28px; background:rgba(99,102,241,0.1); color:#6366f1; font-size:12px;">{i + 1}</span>
								<span class="fw-medium" style="font-size:14px;">{name}</span>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
