<script lang="ts">
	import moves from '$data/moves.json';
	import type { Move, Pokemon } from '$extractors/types';
	import { TypeIcon } from '$ui';
	import { Button, ButtonGroup, Dropdown, Search } from 'flowbite-svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';

	interface MoveCardProps {
		move: string;
		data: Move;
		species: Pokemon;
		resetPP: () => void;
	}

	let { move = $bindable(), data, species, resetPP }: MoveCardProps = $props();

	let groupOpen = $state(false);
	let selectedGroup = $state('Level-Up Moves');
	let moveOpen = $state(false);
	let searchTerm = $state('');
	let moveList = $derived.by(() => {
		if (selectedGroup === 'Level-Up Moves') {
			return species.learnsets.level.map((m) => m.name);
		} else if (selectedGroup === 'Egg Moves') {
			return species.learnsets.egg.map((m) => m.name);
		} else if (selectedGroup === 'TM & HM Moves') {
			return species.learnsets.tmhm.map((m) => m.name);
		} else {
			return moves.slice(1, -1).map((m) => m.name);
		}
	});
	let filteredMoves = $derived(
		moveList.filter((move) => move.toLowerCase().includes(searchTerm.toLowerCase()))
	);
</script>

<ButtonGroup class="flex-wrap gap-5 sm:flex-nowrap sm:gap-0">
	<div>
		<Button class="h-full px-5 py-4 text-nowrap text-black sm:rounded-r-none dark:text-white">
			{selectedGroup}
			<ChevronDownOutline class="ms-3 h-5 w-5" />
		</Button>
	</div>
	<Dropdown bind:isOpen={groupOpen} class="w-65">
		<div class="max-h-60 overflow-y-auto">
			{#each ['Level-Up Moves', 'Egg Moves', 'TM & HM Moves', 'All Moves'] as option}
				<Button
					color="dark"
					outline
					class="w-full justify-start rounded-none border-0 px-4 py-3 text-black dark:text-white"
					onclick={() => {
						selectedGroup = option;
						groupOpen = false;
					}}
				>
					{option}
				</Button>
			{/each}
		</div>
	</Dropdown>
	<div class="w-full">
		<Button
			class="flex h-full w-full justify-between px-5 py-4 text-black sm:rounded-l-none dark:text-white"
		>
			<div class="flex items-center gap-4">
				<TypeIcon type={data.type} />
				{move}
			</div>
			<ChevronDownOutline class="ms-3 h-5 w-5" />
		</Button>
	</div>
	<Dropdown bind:isOpen={moveOpen} class="w-65">
		<div class="p-3">
			<Search bind:value={searchTerm} size="md" />
		</div>
		<div class="max-h-60 overflow-y-auto">
			{#each filteredMoves as option}
				<Button
					color="dark"
					outline
					class="w-full justify-start rounded-none border-0 px-4 py-3 text-black dark:text-white"
					onclick={() => {
						move = option;
						searchTerm = '';
						moveOpen = false;
						resetPP();
					}}
				>
					<div class="flex w-full justify-between">
						<span>
							{option}
						</span>
						<span>
							{#if selectedGroup === 'Level-Up Moves'}
								Lv. {species.learnsets.level.find((m) => m.name === option)!.level}
							{/if}
						</span>
					</div>
				</Button>
			{/each}
		</div>
	</Dropdown>
</ButtonGroup>
