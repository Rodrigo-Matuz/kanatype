export function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex items-center gap-5 mb-5">
			<h2 className="font-bold text-primary text-xl tracking-tight">{title}</h2>
			<div className="flex-1 bg-border h-px" />
		</div>
	);
}
