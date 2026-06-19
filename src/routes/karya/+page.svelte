<script>
	import { supabase } from '$lib/supabase.js';

	let fotoList = $state([]);
	let showForm = $state(false);
	let loading = $state(true);
	let errorMsg = $state('');
	let previewUrl = $state('');
	let previewOpen = $state(false);

	let form = $state({ title: '', description: '', uploader: '' });
	let file = $state(null);
	let filePreview = $state('');
	let uploading = $state(false);

	async function load() {
		loading = true;
		errorMsg = '';
		const { data, error } = await supabase
			.from('galeri')
			.select('*')
			.order('created_at', { ascending: false });
		if (error) {
			errorMsg = 'Gagal memuat data. Pastikan tabel sudah dibuat.';
			fotoList = [];
		} else {
			fotoList = data || [];
		}
		loading = false;
	}

	function compressImage(file, maxW = 1200, quality = 0.7) {
		return new Promise((resolve) => {
			const img = new Image();
			img.onload = () => {
				const canvas = document.createElement('canvas');
				let { width, height } = img;
				if (width > maxW) { height = height * maxW / width; width = maxW; }
				canvas.width = width; canvas.height = height;
				const ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0, width, height);
				canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
			};
			img.src = URL.createObjectURL(file);
		});
	}

	async function submit() {
		const title = form.title.trim();
		const uploader = form.uploader.trim();
		if (!title || !uploader || !file) return;
		uploading = true;

		const compressed = await compressImage(file);
		const ext = 'jpg';
		const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

		const { error: uploadError } = await supabase.storage
			.from('galeri')
			.upload(fileName, compressed);

		if (uploadError) {
			alert('Gagal upload gambar: ' + uploadError.message);
			uploading = false;
			return;
		}

		const { data: { publicUrl } } = supabase.storage
			.from('galeri')
			.getPublicUrl(fileName);

		const { error: insertError } = await supabase.from('galeri').insert({
			title,
			description: form.description.trim(),
			uploader,
			image_url: publicUrl
		});

		if (insertError) {
			alert('Gagal menyimpan: ' + insertError.message);
			uploading = false;
			return;
		}

		form = { title: '', description: '', uploader: '' };
		file = null;
		filePreview = '';
		showForm = false;
		uploading = false;
		await load();
	}

	async function hapus(id, imageUrl) {
		if (!confirm('Hapus foto ini?')) return;

		const fileName = imageUrl.split('/').pop();
		await supabase.storage.from('galeri').remove([fileName]);
		await supabase.from('galeri').delete().eq('id', id);

		fotoList = fotoList.filter((f) => f.id !== id);
	}

	function openPreview(url) {
		previewUrl = url;
		previewOpen = true;
	}

	function closePreview() {
		previewOpen = false;
	}

	function onFileSelect(e) {
		const f = e.target.files?.[0];
		if (!f) return;
		if (f.size > 5 * 1024 * 1024) {
			alert('Maksimal ukuran file 5MB');
			e.target.value = '';
			return;
		}
		file = f;
		filePreview = URL.createObjectURL(f);
	}

	load();
</script>

<div class="py-6 px-3 md:py-10 md:px-4">
	<div class="max-w-5xl mx-auto">
		<div class="d-flex align-items-center justify-content-between mb-4">
			<div>
				<h1 class="text-2xl md:text-3xl fw-bold" style="color:#1e293b;">
					<i class="fas fa-images me-2" style="color:#6366f1;"></i> Galeri Foto
				</h1>
				<p class="mt-1" style="color:#64748b; font-size:14px;">Dokumentasi PGSD C 2024</p>
			</div>
			<button
				onclick={() => { showForm = !showForm; }}
				class="btn rounded-pill border-0 fw-medium px-4 py-2 transition-all"
				style="background:#6366f1; color:white; font-size:13px; white-space:nowrap; {showForm ? 'transform:rotate(45deg);' : ''}"
				onmouseenter={(e) => e.currentTarget.style.background = '#4f46e5'}
				onmouseleave={(e) => e.currentTarget.style.background = '#6366f1'}
			>
				<i class="fas {showForm ? 'fa-times' : 'fa-plus'} me-1"></i> {showForm ? 'Tutup' : 'Tambah'}
			</button>
		</div>

		{#if showForm}
			<div class="glass-card rounded-3 p-4 md:p-5 mb-4">
				<h2 class="fw-semibold mb-3" style="color:#1e293b; font-size:15px;">
					<i class="fas fa-upload me-2" style="color:#6366f1;"></i> Upload Foto
				</h2>
				<div class="d-flex flex-column gap-3">
					<div>
						<label class="fw-semibold mb-1 d-block" style="color:#1e293b; font-size:12px;">Judul</label>
						<input bind:value={form.title} placeholder="Judul foto" class="form-control border-0 rounded-xl py-2" style="background:rgba(99,102,241,0.04); font-size:14px; color:#1e293b;" />
					</div>
					<div class="row g-2">
						<div class="col-6">
							<label class="fw-semibold mb-1 d-block" style="color:#1e293b; font-size:12px;">Nama</label>
							<input bind:value={form.uploader} placeholder="Nama kamu" class="form-control border-0 rounded-xl py-2" style="background:rgba(99,102,241,0.04); font-size:14px; color:#1e293b;" />
						</div>
						<div class="col-6">
							<label class="fw-semibold mb-1 d-block" style="color:#1e293b; font-size:12px;">File Gambar</label>
							<input type="file" accept="image/*" onchange={onFileSelect} class="form-control border-0 rounded-xl py-2" style="background:rgba(99,102,241,0.04); font-size:13px; color:#1e293b;" />
						</div>
					</div>
					{#if filePreview}
						<div class="rounded-xl overflow-hidden" style="max-height:200px;">
							<img src={filePreview} alt="Preview" class="w-100 d-block" style="height:180px; object-fit:cover;" />
						</div>
					{/if}
					<div>
						<label class="fw-semibold mb-1 d-block" style="color:#1e293b; font-size:12px;">Deskripsi <span style="color:#94a3b8;">(opsional)</span></label>
						<textarea bind:value={form.description} rows="3" placeholder="Cerita singkat tentang foto ini..." class="form-control border-0 rounded-xl py-2" style="background:rgba(99,102,241,0.04); font-size:14px; color:#1e293b; resize:vertical;"></textarea>
					</div>
					<button
						onclick={submit}
						disabled={!form.title.trim() || !form.uploader.trim() || !file || uploading}
						class="btn rounded-pill border-0 fw-medium py-2"
						style="background:#6366f1; color:white; font-size:14px;"
						onmouseenter={(e) => e.currentTarget.style.background = '#4f46e5'}
						onmouseleave={(e) => e.currentTarget.style.background = '#6366f1'}
					>
						<i class="fas {uploading ? 'fa-spinner fa-spin' : 'fa-upload'} me-1"></i> {uploading ? 'Mengupload...' : 'Upload'}
					</button>
				</div>
			</div>
		{/if}

		{#if loading}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-spinner fa-spin mb-3" style="font-size:40px;"></i>
				<p class="mb-0">Memuat galeri...</p>
			</div>
		{:else if errorMsg}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-exclamation-triangle mb-3" style="font-size:40px; color:#f59e0b;"></i>
				<p class="mb-0">{errorMsg}</p>
				<button onclick={load} class="btn btn-sm rounded-pill mt-3" style="background:#6366f1; color:white;">
					<i class="fas fa-refresh me-1"></i> Coba Lagi
				</button>
			</div>
		{:else if fotoList.length === 0}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-images mb-3" style="font-size:40px; color:#cbd5e1;"></i>
				<p class="mb-0">Belum ada foto. Klik "Tambah" untuk upload foto pertama!</p>
			</div>
		{/if}

		<div class="row g-3">
			{#each fotoList as f}
				<div class="col-6 col-md-4 col-lg-3">
					<div class="position-relative rounded-3 overflow-hidden glass-card" style="transition:all 0.3s ease; cursor:pointer;"
						onmouseenter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; }}
						onmouseleave={(e) => { e.currentTarget.style.transform = ''; }}
					>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div onclick={() => openPreview(f.image_url)}>
							<img
								src={f.image_url}
								alt={f.title}
								class="w-100 d-block"
								style="height:180px; object-fit:cover; transition:transform 0.5s ease;"
								onmouseenter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
								onmouseleave={(e) => e.currentTarget.style.transform = ''}
							/>
							<div class="p-2" style="background:white;">
								<div class="fw-semibold" style="color:#1e293b; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">{f.title}</div>
								<div style="color:#94a3b8; font-size:11px;">
									<i class="fas fa-user me-1"></i>{f.uploader}
									<i class="fas fa-calendar ms-2 me-1"></i>{f.date}
								</div>
								{#if f.description}
									<div style="color:#64748b; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:2px;">
										{f.description}
									</div>
								{/if}
							</div>
						</div>
						<button
							onclick={() => hapus(f.id, f.image_url)}
							class="btn border-0 p-1 rounded-circle d-flex align-items-center justify-content-center position-absolute"
							style="width:30px; height:30px; background:rgba(220,38,38,0.8); color:white; top:8px; right:8px; opacity:0; transition:opacity 0.2s ease;"
							onmouseenter={(e) => e.currentTarget.style.opacity = '1'}
							onmouseleave={(e) => e.currentTarget.style.opacity = '0'}
							onfocus={(e) => e.currentTarget.style.opacity = '1'}
							onblur={(e) => e.currentTarget.style.opacity = '0'}
							title="Hapus"
						>
							<i class="fas fa-trash" style="font-size:10px;"></i>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

{#if previewOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="preview-overlay" style="display:flex;" onclick={closePreview}>
		<img src={previewUrl} alt="Preview" class="show" />
	</div>
{/if}
