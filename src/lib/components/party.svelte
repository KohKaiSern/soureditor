<script lang="ts">
	import EmptyMonCard from '$components/mon/empty-mon-card.svelte';
	import MonCard from '$components/mon/mon-card.svelte';
	import type { PartyMon, Player } from '$parsers/types';

	interface PartyProps {
		party: PartyMon[];
		player: Player;
	}

	let { party = $bindable(), player }: PartyProps = $props();

	function onadd(): void {
		party.push({
			species: 'BULBASAUR',
			heldItem: 'NONE',
			moveset: ['TACKLE', 'NONE', 'NONE', 'NONE'],
			OTID: player.id,
			exp: 0,
			statExps: [0, 0, 0, 0, 0],
			dvs: [0, 0, 0, 0],
			PPUPs: [0, 0, 0, 0],
			powerPoints: [35, 0, 0, 0],
			happiness: 0,
			pokerus: 'NONE',
			caughtTime: 'DAY',
			caughtLevel: 1,
			OTGender: 'MALE',
			caughtLocation: 'NEW BARK TOWN',
			level: 1,
			isEgg: false,
			nickname: ['B', 'U', 'L', 'B', 'A', 'S', 'A', 'U', 'R'],
			OTNickname: player.name,
			currentHP: 12,
			stats: [12, 6, 6, 6, 6, 6],
			status: { name: 'NONE' }
		});
	}

	function deleteMon(index: number): void {
		party.splice(index, 1);
	}
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
	{#each Array(6) as _, i}
		{#if party[i]}
			<MonCard
				bind:mon={party[i]}
				ondelete={() => {
					deleteMon(i);
				}}
			/>
		{:else}
			<EmptyMonCard first={Boolean(party[i - 1]) || i === 0} {onadd} />
		{/if}
	{/each}
</div>
