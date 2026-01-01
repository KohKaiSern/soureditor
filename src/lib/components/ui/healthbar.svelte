<script lang="ts">
	import type { PartyMon } from '$parsers/types';
	import { Progressbar, P } from 'flowbite-svelte';

	let { mon }: { mon: PartyMon } = $props();

	let HPPercent = $derived(Math.round((mon.currentHP / mon.stats[0]) * 100));

	let status = $derived(
		{
			PARALYSIS: 'PRZ',
			BURN: 'BRN',
			FREEZE: 'FRZ',
			POISON: 'PSN',
			SLEEP: 'SLP'
		}[mon.status.name]
	);

	let statusColor = $derived(
		{
			PARALYSIS: '#fdae10',
			BURN: '#f94e00',
			FREEZE: '#62ccd4',
			POISON: '#bc52e7',
			SLEEP: '#7d7d7d'
		}[mon.status.name]
	);
</script>

<div class="flex w-[70%] items-center gap-3">
	<P>HP</P><Progressbar
		color={HPPercent > 50 ? 'green' : HPPercent > 20 ? 'yellow' : 'red'}
		progress={HPPercent}
	/>
	{#if mon.status.name != 'NONE'}
		<div style:background-color={statusColor} class="rounded-md pr-2 pl-2">
			<P class="text-xs !text-gray-50">{status}</P>
		</div>
	{/if}
	{#if mon.currentHP === 0}
		<div class="rounded-md bg-red-500 pr-2 pl-2">
			<P class="text-xs !text-white">FNT</P>
		</div>
	{/if}
</div>
