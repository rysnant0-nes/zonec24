<script>
	import { onMount } from 'svelte';

	let jenjang = $state('');
	let phase = $state('');
	let subjects = $state([]);
	let loadingSubjects = $state(false);
	let selectedSubject = $state(null);
	let detail = $state(null);
	let loadingDetail = $state(false);
	let error = $state('');

	const jenjangList = [
		{ value: 'PAUD', label: 'PAUD/TK' },
		{ value: 'SD-SMA', label: 'SD - SMA' },
		{ value: 'SMK', label: 'SMK' },
		{ value: 'SLB', label: 'SLB' },
		{ value: 'Kesetaraan', label: 'Kesetaraan' },
	];

	const classMap = {
		PAUD: { phases: { Fondasi: ['PAUD'] } },
		'SD-SMA': { phases: { A: ['Kelas 1', 'Kelas 2'], B: ['Kelas 3', 'Kelas 4'], C: ['Kelas 5', 'Kelas 6'], D: ['Kelas 7', 'Kelas 8', 'Kelas 9'], E: ['Kelas 10'], F: ['Kelas 11', 'Kelas 12'] } },
		SMK: { phases: { E: ['Kelas 10'], F: ['Kelas 11', 'Kelas 12'] } },
		SLB: { phases: { A: ['Kelas 1', 'Kelas 2'], B: ['Kelas 3', 'Kelas 4'], C: ['Kelas 5', 'Kelas 6'], D: ['Kelas 7', 'Kelas 8', 'Kelas 9'], E: ['Kelas 10'], F: ['Kelas 11', 'Kelas 12'] } },
		Kesetaraan: { phases: { A: ['Kelas 1', 'Kelas 2'], B: ['Kelas 3', 'Kelas 4'], C: ['Kelas 5', 'Kelas 6'], D: ['Kelas 7', 'Kelas 8', 'Kelas 9'], E: ['Kelas 10'], F: ['Kelas 11', 'Kelas 12'] } },
	};

	function getSchoolType(j) {
		if (j === 'SD-SMA') return 'Umum';
		if (j === 'TKLB') return 'SLB';
		return j;
	}

	function getPhaseList() {
		if (!jenjang || !classMap[jenjang]) return [];
		return Object.entries(classMap[jenjang].phases).map(([key, classes]) => ({
			phase: key,
			classes,
			label: `Fase ${key} (${classes.join(', ')})`,
		}));
	}

	async function loadSubjects() {
		if (!jenjang || !phase) return;
		loadingSubjects = true;
		error = '';
		subjects = [];
		selectedSubject = null;
		detail = null;
		try {
			const entry = classMap[jenjang].phases[phase];
			const cls = entry[0];
			const schoolType = getSchoolType(jenjang);
			const isExclusive = schoolType === 'SMK' || schoolType === 'SLB';
			const url = `https://api.pendidikan.go.id/curriculums/v2/public/subjects?class=${encodeURIComponent(cls)}&school_type=${encodeURIComponent(schoolType)}&is_exclusive=${isExclusive}`;
			const res = await fetch(url);
			const json = await res.json();
			const list = json?.data?.more_subject || [];
			subjects = list.filter((s) => s.value && s.description);
		} catch (e) {
			error = 'Gagal memuat daftar mata pelajaran.';
		} finally {
			loadingSubjects = false;
		}
	}

	async function selectSubject(s) {
		selectedSubject = s;
		loadingDetail = true;
		detail = null;
		try {
			const res = await fetch(`https://api.pendidikan.go.id/curriculums/v2/public/subject-learning-achievements/subjects/${encodeURIComponent(s.value)}`);
			const json = await res.json();
			detail = json?.data || null;

			if (jenjang !== 'PAUD') {
				const schoolType = getSchoolType(jenjang);
				const res2 = await fetch(`https://api.pendidikan.go.id/curriculums/v2/public/domains/subjects/${encodeURIComponent(s.value)}/school-types/${encodeURIComponent(schoolType)}/phases/${phase}`);
				const json2 = await res2.json();
				if (json2?.data?.elements) {
					detail = { ...detail, domainElements: json2.data.elements, phaseDescription: json2.data.description };
				}
			}
		} catch (e) {
			error = 'Gagal memuat detail CP.';
		} finally {
			loadingDetail = false;
		}
	}

	onMount(() => {
		function onKey(e) {
			if (e.key === 'Escape') { selectedSubject = null; detail = null; }
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	});

	function closeModal() {
		selectedSubject = null;
		detail = null;
	}

	function resetSelection() {
		jenjang = '';
		phase = '';
		subjects = [];
		selectedSubject = null;
		detail = null;
		error = '';
	}
</script>

<div class="py-6 px-3 md:py-10 md:px-4">
	<div class="max-w-4xl mx-auto">
		<div class="text-center mb-6 md:mb-8">
			<h1 class="text-2xl md:text-3xl fw-bold" style="color:#1e293b;">
				<i class="fas fa-book-open me-2" style="color:#6366f1;"></i> Capaian Pembelajaran
			</h1>
			<p class="mt-2" style="color:#64748b; font-size:14px;">Cari dan lihat Capaian Pembelajaran (CP) per fase dan mata pelajaran</p>
		</div>

		<div class="glass-card rounded-3 p-4 md:p-6 mb-4 md:mb-6">
			<div class="d-flex flex-column flex-md-row gap-3 align-items-md-end">
				<div class="flex-grow-1">
					<label class="fw-semibold mb-1 d-block" style="color:#1e293b; font-size:13px;">Jenjang</label>
					<div class="d-flex flex-wrap gap-2">
						{#each jenjangList as j}
							<button
								onclick={() => { jenjang = j.value; phase = ''; subjects = []; selectedSubject = null; detail = null; }}
								class="btn rounded-pill border-0 fw-medium px-3 py-2 transition-all"
								style="font-size:13px; {jenjang === j.value ? 'background:#6366f1; color:white;' : 'background:rgba(99,102,241,0.06); color:#64748b;'}"
								onmouseenter={(e) => { if (jenjang !== j.value) { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#6366f1'; }}}
								onmouseleave={(e) => { if (jenjang !== j.value) { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#64748b'; }}}
							>
								{j.label}
							</button>
						{/each}
					</div>
				</div>
				<button onclick={resetSelection}
					class="btn rounded-pill border-0 fw-medium px-3 py-2"
					style="background:rgba(99,102,241,0.08); color:#6366f1; font-size:13px; white-space:nowrap;"
					onmouseenter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
					onmouseleave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
				>
					<i class="fas fa-rotate-left me-1"></i> Reset
				</button>
			</div>

			{#if jenjang}
				<div class="mt-4">
					<label class="fw-semibold mb-1 d-block" style="color:#1e293b; font-size:13px;">Fase / Kelas</label>
					<div class="d-flex flex-wrap gap-2">
						{#each getPhaseList() as p}
							<button
								onclick={() => { phase = p.phase; loadSubjects(); }}
								class="btn rounded-pill border-0 fw-medium px-3 py-2 transition-all"
								style="font-size:13px; {phase === p.phase ? 'background:#6366f1; color:white;' : 'background:rgba(99,102,241,0.06); color:#64748b;'}"
								onmouseenter={(e) => { if (phase !== p.phase) { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = '#6366f1'; }}}
								onmouseleave={(e) => { if (phase !== p.phase) { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.color = '#64748b'; }}}
							>
								{p.label}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if error}
			<div class="glass-card rounded-3 p-4 text-center mb-4" style="color:#dc2626;">
				<i class="fas fa-exclamation-circle me-2"></i> {error}
			</div>
		{/if}

		{#if loadingSubjects}
			<div class="text-center py-5">
				<div class="spinner-border" style="color:#6366f1;" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<p class="mt-2" style="color:#64748b;">Memuat mata pelajaran...</p>
			</div>
		{/if}

		{#if subjects.length > 0 && !loadingSubjects}
			<div class="glass-card rounded-3 p-4 md:p-6 mb-4 md:mb-6">
				<h2 class="fw-semibold mb-3" style="color:#1e293b; font-size:16px;">
					<i class="fas fa-list me-2" style="color:#6366f1;"></i> Pilih Mata Pelajaran
				</h2>
				<div class="d-flex flex-column gap-2">
					{#each subjects as s}
						<button
							onclick={() => selectSubject(s)}
							class="btn d-flex align-items-center gap-2 w-100 text-start rounded-xl border-0 p-3 transition-all"
							style="{selectedSubject?.value === s.value ? 'background:rgba(99,102,241,0.1); color:#6366f1; border:1px solid rgba(99,102,241,0.3);' : 'background:rgba(99,102,241,0.03); color:#1e293b; border:1px solid transparent;'}"
							onmouseenter={(e) => { if (selectedSubject?.value !== s.value) { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.15)'; }}}
							onmouseleave={(e) => { if (selectedSubject?.value !== s.value) { e.currentTarget.style.background = 'rgba(99,102,241,0.03)'; e.currentTarget.style.borderColor = 'transparent'; }}}
						>
							<i class="fas fa-chevron-right" style="font-size:12px; color:#6366f1; flex-shrink:0;"></i>
							<span class="fw-medium" style="font-size:14px;">{s.label}</span>
							{#if s.learning_achievements?.filter(Boolean).length > 0}
								<span class="ms-auto badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.1); color:#6366f1; font-size:11px;">{s.learning_achievements.filter(Boolean).length} elemen</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}

		{#if subjects.length === 0 && phase && !loadingSubjects}
			<div class="glass-card rounded-3 p-4 text-center" style="color:#94a3b8;">
				<i class="fas fa-search mb-2" style="font-size:24px;"></i>
				<p class="mb-0">Tidak ada mata pelajaran untuk fase ini.</p>
			</div>
		{/if}

		{#if selectedSubject}
			<div class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
				style="background:rgba(0,0,0,0.4); backdrop-filter:blur(4px); padding-top:5vh; padding-bottom:5vh;"
				onclick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
				role="dialog"
				aria-modal="true"
				aria-label="Detail {selectedSubject.label}"
			>
				<div class="glass-card rounded-3 p-4 md:p-6 mx-3" style="width:100%; max-width:720px; max-height:90vh; overflow-y:auto; position:relative;">
					<div class="d-flex align-items-start justify-content-between mb-3 sticky-top" style="background:rgba(255,255,255,0.95); backdrop-filter:blur(12px); top:-1rem; margin:-1rem -1rem 0 -1rem; padding:1rem; border-radius:1rem 1rem 0 0; z-index:1;">
						<div style="min-width:0;">
							<h2 class="fw-bold mb-1" style="color:#1e293b; font-size:1.2rem;">{selectedSubject.label}</h2>
							{#if selectedSubject.learning_achievements?.filter(Boolean).length > 0}
								<div class="d-flex flex-wrap gap-1 mt-1">
									{#each selectedSubject.learning_achievements.filter(Boolean) as ach}
										<span class="badge rounded-pill fw-normal" style="background:rgba(99,102,241,0.1); color:#6366f1; font-size:11px;">{ach}</span>
									{/each}
								</div>
							{/if}
						</div>
						<button onclick={closeModal}
							class="btn border-0 p-2 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
							style="width:36px; height:36px; background:rgba(99,102,241,0.08); color:#6366f1; margin-left:12px;"
							onmouseenter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
							onmouseleave={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.08)'}
							aria-label="Tutup"
						>
							<i class="fas fa-times"></i>
						</button>
					</div>

					{#if loadingDetail}
						<div class="text-center py-5">
							<div class="spinner-border" style="color:#6366f1;" role="status">
								<span class="visually-hidden">Loading...</span>
							</div>
							<p class="mt-2 mb-0" style="color:#94a3b8; font-size:14px;">Memuat detail...</p>
						</div>
					{:else if detail}
						{#if detail.phaseDescription || selectedSubject.description}
							<div class="mb-4">
								<h3 class="fw-semibold mb-2 d-flex align-items-center gap-1" style="color:#1e293b; font-size:14px;">
									<i class="fas fa-align-left" style="color:#6366f1;"></i> Deskripsi Fase {phase}
								</h3>
								<div class="rounded-2 p-3" style="background:rgba(99,102,241,0.03); font-size:14px; line-height:1.7; color:#334155; white-space:pre-line;">
									{detail.phaseDescription || selectedSubject.description}
								</div>
							</div>
						{/if}

						{#if detail.rational}
							<div class="mb-4">
								<h3 class="fw-semibold mb-2 d-flex align-items-center gap-1" style="color:#1e293b; font-size:14px;">
									<i class="fas fa-lightbulb" style="color:#6366f1;"></i> Rasional
								</h3>
								<div class="rounded-2 p-3" style="background:rgba(99,102,241,0.03); font-size:14px; line-height:1.7; color:#334155; white-space:pre-line;">
									{detail.rational}
								</div>
							</div>
						{/if}

						{#if detail.characteristic}
							<div class="mb-4">
								<h3 class="fw-semibold mb-2 d-flex align-items-center gap-1" style="color:#1e293b; font-size:14px;">
									<i class="fas fa-chart-bar" style="color:#6366f1;"></i> Karakteristik
								</h3>
								<div class="rounded-2 p-3" style="background:rgba(99,102,241,0.03); font-size:14px; line-height:1.7; color:#334155; white-space:pre-line;">
									{detail.characteristic}
								</div>
							</div>
						{/if}

						{#if detail.learningObjective}
							<div class="mb-4">
								<h3 class="fw-semibold mb-2 d-flex align-items-center gap-1" style="color:#1e293b; font-size:14px;">
									<i class="fas fa-bullseye" style="color:#6366f1;"></i> Tujuan Pembelajaran
								</h3>
								<div class="rounded-2 p-3" style="background:rgba(99,102,241,0.03); font-size:14px; line-height:1.7; color:#334155; white-space:pre-line;">
									{detail.learningObjective}
								</div>
							</div>
						{/if}

						{#if detail.domainElements?.length > 0}
							<div class="mb-2">
								<h3 class="fw-semibold mb-2 d-flex align-items-center gap-1" style="color:#1e293b; font-size:14px;">
									<i class="fas fa-cubes" style="color:#6366f1;"></i> Elemen CP Fase {phase}
								</h3>
								{#each detail.domainElements as el}
									<div class="rounded-2 p-3 mb-2" style="background:rgba(99,102,241,0.03); border-left:3px solid #6366f1;">
										<h4 class="fw-semibold mb-1" style="color:#6366f1; font-size:14px;">{el.elementName}</h4>
										<p class="mb-0" style="font-size:14px; line-height:1.7; color:#334155; white-space:pre-line;">{el.elementDescription}</p>
									</div>
								{/each}
							</div>
						{/if}
					{/if}
				</div>
			</div>
		{/if}

		{#if !jenjang && !phase && subjects.length === 0}
			<div class="text-center py-5" style="color:#94a3b8;">
				<i class="fas fa-hand-pointer mb-3" style="font-size:40px; color:#cbd5e1;"></i>
				<p class="mb-0">Pilih jenjang dan fase untuk melihat daftar mata pelajaran</p>
			</div>
		{/if}
	</div>
</div>
