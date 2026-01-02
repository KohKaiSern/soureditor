<script lang="ts">
	import NormalSlot from '$components/bag-slots/normal-slot.svelte';
	import Extras from '$components/bag-slots/extras.svelte';
	import TMsHMs from '$components/bag-slots/tms-hms.svelte';
	import items from '$data/items.json';
	import type { Bag } from '$parsers/types';
	import { RadioSelect } from '$ui';

	let { bag = $bindable() }: { bag: Bag } = $props();
	let selectedSlot = $state('items');
</script>

<div class="mt-5 hidden sm:block">
	<RadioSelect
		bind:value={selectedSlot}
		options={[
			{ text: 'Items', id: 'items' },
			{ text: 'Balls', id: 'balls' },
			{ text: 'TMs & HMs', id: 'TMsHMs' },
			{ text: 'Berries', id: 'berries' },
			{ text: 'Key Items', id: 'keyItems' },
			{ text: 'Extras', id: 'extras' }
		]}
	/>
</div>
<div class="mt-5 flex flex-col gap-3 sm:hidden">
	<RadioSelect
		bind:value={selectedSlot}
		options={[
			{ text: 'Items', id: 'items' },
			{ text: 'Balls', id: 'balls' },
			{ text: 'TMs & HMs', id: 'TMsHMs' }
		]}
	/>
	<RadioSelect
		bind:value={selectedSlot}
		options={[
			{ text: 'Berries', id: 'berries' },
			{ text: 'Key Items', id: 'keyItems' },
			{ text: 'Extras', id: 'extras' }
		]}
	/>
</div>

{#if ['items', 'balls', 'berries', 'keyItems'].includes(selectedSlot)}
	<NormalSlot
		bind:contents={bag[selectedSlot]}
		capacity={{
			items: 20,
			balls: 12,
			berries: 17,
			keyItems: 25
		}[selectedSlot]!}
		itemList={items
			.filter((item) => item.name != 'TERU-SAMA')
			.filter(
				(item) =>
					item.category ===
					{
						items: 'ITEM',
						balls: 'BALL',
						berries: 'BERRIES',
						keyItems: 'KEY_ITEM'
					}[selectedSlot]!
			)}
	/>
{/if}

{#if selectedSlot === 'TMsHMs'}
	<TMsHMs bind:contents={bag.TMsHMs} />
{/if}

{#if selectedSlot === 'extras'}
	<Extras bind:bag />
{/if}
