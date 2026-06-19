<script>
	let { href, icon, label, desc } = $props();
</script>

<a
	{href}
	class="text-decoration-none glass-card rounded-4 px-4 py-4 d-flex flex-column align-items-center text-center flex-1"
	style="min-width:150px; max-width:200px; transition:all 0.3s cubic-bezier(0.23,1,0.32,1);"
	onmouseenter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
	onmouseleave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = ''; }}
>
	<div class="d-flex align-items-center justify-content-center rounded-3 mb-3" style="width:52px; height:52px; background:rgba(99,102,241,0.08); transition:all 0.3s ease; font-size:20px; color:#6366f1;"
		onmouseenter={(e) => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'scale(1.1)'; }}
		onmouseleave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.transform = ''; }}
	>
		<i class="fas {icon}"></i>
	</div>
	<span class="fw-semibold mb-1" style="color:#1e293b; font-size:13px; letter-spacing:0.03em;">{label}</span>
	<span class="fw-light" style="color:#94a3b8; font-size:11px;">{desc}</span>
</a>
