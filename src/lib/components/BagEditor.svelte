<script lang="ts">
	import { RadioButton, ButtonGroup, P } from 'flowbite-svelte';
	import { SlotEditor, TMsHMsEditor } from './BagEditors';
	let { bag = $bindable() } = $props();
	const slots = {
		Items: {
			id: 'items',
			capacity: 20,
			category: 'ITEM'
		},
		Balls: {
			id: 'balls',
			capacity: 12,
			category: 'BALL'
		},
		Berries: {
			id: 'berries',
			capacity: 17,
			category: 'BERRIES'
		},
		'Key Items': {
			id: 'keyItems',
			capacity: 25,
			category: 'KEY_ITEM'
		},
		'TMs & HMs': {
			id: 'TMsHMs',
			capacity: 57,
			category: 'TM_HM'
		}
	};
	let selectedSlot = $state('items');
</script>

<ButtonGroup>
	{#each Object.entries(slots) as [slot, info]}
		<RadioButton
			value={info.id}
			bind:group={selectedSlot}
			checkedClass="!text-white dark:bg-purple-600 dark:hover:bg-purple-600"
		>
			{slot}
		</RadioButton>
	{/each}
</ButtonGroup>

{#if selectedSlot === 'TMsHMs'}
	<TMsHMsEditor bind:bag />
{:else}
	<SlotEditor bind:bag {...Object.values(slots).find((s) => s.id === selectedSlot)!} />
{/if}
