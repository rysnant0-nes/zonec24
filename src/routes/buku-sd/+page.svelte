<script>
	let books = $state([]);
	let loading = $state(false);
	let error = $state('');
	let query = $state('');
	let catalogType = $state('btpcatalogue');
	let page = $state(1);
	let totalPages = $state(0);

	let selectedBook = $state(null);
	let detail = $state(null);
	let detailLoading = $state(false);

	const CACHE_KEY = 'sibi_cache';
	const CACHE_TTL = 3600000;

	const typeLabels = {
		btpcatalogue: 'Buku Teks Pendamping',
		btucatalogue: 'Buku Teks Utama',
		bntpcatalogue: 'Buku Nonteks',
	};

	function getCacheKey() {
		return `${CACHE_KEY}_${catalogType}_${page}_${query.trim()}`;
	}

	function loadFromCache() {
		const raw = localStorage.getItem(getCacheKey());
		if (!raw) return null;
		try {
			const cached = JSON.parse(raw);
			if (Date.now() - cached.ts < CACHE_TTL) return cached.data;
		} catch {}
		return null;
	}

	function saveToCache(data) {
		try {
			localStorage.setItem(getCacheKey(), JSON.stringify({ ts: Date.now(), data }));
		} catch {}
	}

	async function load(forceRefresh) {
		loading = true;
		error = '';
		detail = null;
		selectedBook = null;

		if (!forceRefresh) {
			const cached = loadFromCache();
			if (cached) {
				books = cached.books;
				totalPages = cached.totalPages;
				loading = false;
				return;
			}
		}

		try {
			const params = new URLSearchParams({ page: String(page), limit: '20' });
			if (query.trim()) params.append('title', query.trim());
			const res = await fetch(`https://api.buku.kemendikdasmen.go.id/${catalogType}/book?${params}`);
			if (!res.ok) throw new Error('Gagal memuat data');
			const json = await res.json();
			const filtered = (json.data || []).filter((b) => b.level === 'SD');
			books = filtered;
			totalPages = json.pagination?.total_pages || 0;
			saveToCache({ books: filtered, totalPages, query: query.trim(), page });
		} catch (e) {
			error = e.message;
			books = [];
		} finally {
			loading = false;
		}
	}

	function search() {
		page = 1;
		load(false);
	}

	function changeType(type) {
		catalogType = type;
		page = 1;
		load(false);
	}

	function goToPrev() {
		if (page > 1) { page--; load(true); }
	}

	function goToNext() {
		if (page < totalPages) { page++; load(true); }
	}

	function handleKeydown(e) {
		if (e.key === 'Escape') { selectedBook = null; detail = null; }
		if (e.key === 'Enter') search();
	}

	async function openDetail(b) {
		selectedBook = b;
		detail = null;
		detailLoading = true;
		try {
			const res = await fetch(`https://api.buku.kemendikdasmen.go.id/${catalogType}/detail/${b.id}?code=GuruSejahtera2025`);
			if (!res.ok) throw new Error('Gagal memuat detail');
			const json = await res.json();
			detail = json.data || null;
		} catch (e) {
			detail = { error: e.message };
		} finally {
			detailLoading = false;
		}
	}

	function closeDetail() {
		selectedBook = null;
		detail = null;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="py-6 px-3 md:py-10 md:px-4">
	<div class="max-w-5xl mx-auto">
		<div class="text-center mb-6 md:mb-8">
			<h1 class="text-2xl md:text-3xl fw-bold" style="color:#1e293b;">
				<i class="fas fa-book me-2" style="color:#6366f1;"></i> Katalog Buku SD
			</h1>
			<p class="mt-2" style="color:#64748b; font-size:14px;">Cari buku SD dari SIBI (Sistem Informasi Perbukuan Indonesia)</p>
		</div>

		<div class="glass-card rounded-3 p-4 md:p-6 mb-4 md:mb-6">
			<div class="d-flex flex-column flex-md-row gap-3">
				<div class="d-flex gap-2 flex-wrap">
					{#each Object.entries(typeLabels) as [key, label]}
						<button
							onclick={() => changeType(key)}
							class="btn rounded-pill border-0 fw-medium px-3 py-2 transition-all"
							style="font-size:12px; {catalogType === key ? 'background:#6366f1; color:white;' : 'background:rgba(99,102,241,0.06); color:#64748b;'}"
							onmouseenter={(e) => { if (catalogType !== key) { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#6366f1'; }}}
							onmouseleave={(e) => { if (catalogType !== key) { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#64748b'; }}}
						>
							{label}
						</button>
					{/each}
				</div>
				<div class="flex-grow-1 position-relative">
					<i class="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3" style="color:#94a3b8; font-size:14px;"></i>
					<input
						bind:value={query}
						placeholder="Cari judul buku..."
						class="form-control border-0 rounded-pill ps-5 py-2"
						style="background:rgba(99,102,241,0.04); font-size:14px; color:#1e293b;"
					/>
				</div>
				<button
					onclick={search}
					class="btn rounded-pill border-0 fw-medium px-4 py-2"
					style="background:#6366f1; color:white; font-size:14px; white-space:nowrap;"
					onmouseenter={(e) => e.currentTarget.style.background = '#4f46e5'}
					onmouseleave={(e) => e.currentTarget.style.background = '#6366f1'}
				>
					<i class="fas fa-search me-1"></i> Cari
				</button>
			</div>
		</div>

		{#if error}
			<div class="glass-card rounded-3 p-4 text-center mb-4" style="color:#dc2626;">
				<i class="fas fa-exclamation-circle me-2"></i> {error}
			</div>
		{/if}

		{#if loading}
			<div class="row g-3">
				{#each { length: 8 } as _}
					<div class="col-6 col-md-4 col-lg-3">
						<div class="glass-card rounded-3 p-3">
							<div class="rounded-2 mb-3" style="aspect-ratio:3/4; background:rgba(99,102,241,0.04);"></div>
							<div class="placeholder-glow"><span class="placeholder col-10 rounded-pill"></span></div>
							<div class="placeholder-glow mt-2"><span class="placeholder col-6 rounded-pill"></span></div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		{#if !loading && books.length > 0}
			<div class="mb-3 d-flex align-items-center gap-2 flex-wrap">
				<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.1); color:#6366f1; font-size:12px;">
					{books.length} buku SD
				</span>
			</div>

			<div class="row g-3">
				{#each books as b}
					<div class="col-6 col-md-4 col-lg-3">
						<button
							onclick={() => openDetail(b)}
							class="btn border-0 p-0 w-100 text-start h-100"
							style="background:none;"
						>
							<div
								class="glass-card rounded-3 p-3 h-100 transition-all"
								onmouseenter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.12)'; }}
								onmouseleave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
							>
								<div
									class="rounded-2 mb-3 d-flex align-items-center justify-content-center"
									style="aspect-ratio:3/4; background:rgba(99,102,241,0.04); overflow:hidden;"
								>
									{#if b.cover_image}
										<img
											src={b.cover_image}
											alt={b.title}
											class="w-100 h-100"
											style="object-fit:cover;"
											loading="lazy"
										/>
									{:else}
										<i class="fas fa-book" style="font-size:40px; color:#cbd5e1;"></i>
									{/if}
								</div>
								<h3 class="fw-semibold mb-1" style="color:#1e293b; font-size:13px; line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
									{b.title}
								</h3>
								{#if b.author}
									<p class="mb-1" style="color:#64748b; font-size:11px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">{b.author}</p>
								{/if}
								<div class="d-flex flex-wrap gap-1 mt-2">
									<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:10px;">{b.level || '-'}</span>
									{#if b.subject}
										<span class="badge rounded-pill fw-normal" style="background:rgba(249,115,22,0.08); color:#f97316; font-size:10px;">{b.subject}</span>
									{/if}
								</div>
							</div>
						</button>
					</div>
				{/each}
			</div>

			{#if totalPages > 1}
				<div class="d-flex align-items-center justify-content-center gap-2 mt-4">
					<button
						onclick={goToPrev}
						disabled={page <= 1}
						class="btn rounded-pill border-0 fw-medium px-3 py-2"
						style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:13px;"
					>
						<i class="fas fa-chevron-left me-1"></i> Prev
					</button>
					<span style="color:#64748b; font-size:13px;">{page}</span>
					<button
						onclick={goToNext}
						disabled={page >= totalPages}
						class="btn rounded-pill border-0 fw-medium px-3 py-2"
						style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:13px;"
					>
						Next <i class="fas fa-chevron-right ms-1"></i>
					</button>
				</div>
			{/if}
		{/if}

		{#if !loading && books.length === 0 && !error}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-book-open mb-3" style="font-size:40px; color:#cbd5e1;"></i>
				<p class="mb-0">Pilih jenis katalog atau cari judul untuk mulai</p>
			</div>
		{/if}
	</div>
</div>

{#if selectedBook}
	<div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
		style="background:rgba(0,0,0,0.4); backdrop-filter:blur(4px); padding-top:5vh; padding-bottom:5vh;"
		onclick={(e) => { if (e.target === e.currentTarget) closeDetail(); }}
		role="dialog"
		aria-modal="true"
	>
		<div class="glass-card rounded-3 p-4 md:p-6 mx-3" style="width:100%; max-width:640px; max-height:90vh; overflow-y:auto; position:relative;">
			<div class="d-flex align-items-start justify-content-between mb-3 sticky-top" style="background:rgba(255,255,255,0.95); backdrop-filter:blur(12px); top:-1rem; margin:-1rem -1rem 0 -1rem; padding:1rem; border-radius:1rem 1rem 0 0; z-index:1;">
				<div style="min-width:0;">
					<h2 class="fw-bold mb-1" style="color:#1e293b; font-size:1.1rem;">{selectedBook.title}</h2>
					{#if selectedBook.author}
						<span style="color:#64748b; font-size:13px;">{selectedBook.author}</span>
					{/if}
				</div>
				<button onclick={closeDetail}
					class="btn border-0 p-2 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
					style="width:36px; height:36px; background:rgba(99,102,241,0.08); color:#6366f1; margin-left:12px;"
					onmouseenter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
					onmouseleave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
					aria-label="Tutup"
				>
					<i class="fas fa-times"></i>
				</button>
			</div>

			{#if detailLoading}
				<div class="text-center py-5">
					<div class="spinner-border" style="color:#6366f1;" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					<p class="mt-2 mb-0" style="color:#94a3b8; font-size:14px;">Memuat detail...</p>
				</div>
			{:else if detail}
				{#if detail.error}
					<div class="text-center py-4" style="color:#dc2626;">
						<i class="fas fa-exclamation-circle me-2"></i> {detail.error}
					</div>
				{:else}
					<div class="d-flex flex-column gap-3">
						{#if detail.cover_image}
							<div class="rounded-2 overflow-hidden mx-auto" style="max-width:200px;">
								<img src={detail.cover_image} alt={detail.title} class="w-100" style="object-fit:cover;" />
							</div>
						{/if}

						<div class="row g-2">
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Penerbit</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.publisher?.name || '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Kelas</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.school_class?.name || '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Mata Pelajaran</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.subjects?.name || '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">ISBN</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.isbn || '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Tahun</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.publication_year || '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Halaman</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.page_content ? detail.page_content + ' hal' : '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Jilid</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.binding_technique || '-'}</div>
								</div>
							</div>
							<div class="col-6">
								<div class="rounded-2 p-2" style="background:rgba(99,102,241,0.03);">
									<div style="font-size:10px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Kertas</div>
									<div class="fw-medium mt-1" style="font-size:13px; color:#1e293b;">{detail.paper || detail.paper_weight ? (detail.paper || '') + ' ' + (detail.paper_weight || '') : '-'}</div>
								</div>
							</div>
						</div>

						{#if detail.book_prices?.length > 0}
							<div class="rounded-2 p-3" style="background:rgba(99,102,241,0.03);">
								<div style="font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Harga Eceran Tertinggi (HET)</div>
								<div class="d-flex flex-wrap gap-1">
									{#each detail.book_prices as p}
										<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:11px;">
											Zona {p.zone}: Rp {Number(p.price).toLocaleString('id-ID')}
										</span>
									{/each}
								</div>
							</div>
						{/if}

						<a
							href="https://buku.kemendikdasmen.go.id/hasil-penilaian/{selectedBook.id}?type={catalogType}"
							target="_blank"
							rel="noopener noreferrer"
							class="btn w-100 rounded-pill border-0 fw-medium py-2 mt-2"
							style="background:#6366f1; color:white; font-size:14px;"
							onmouseenter={(e) => e.currentTarget.style.background = '#4f46e5'}
							onmouseleave={(e) => e.currentTarget.style.background = '#6366f1'}
						>
							<i class="fas fa-external-link-alt me-2"></i> Buka & Unduh di SIBI
						</a>
					</div>
				{/if}
			{/if}
		</div>
	</div>
{/if}
