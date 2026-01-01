<script lang="ts">
	import MonDrawer from '$components/mon/mon-drawer.svelte';
	import pokemon from '$data/pokemon.json';
	import type { BoxMon, PartyMon } from '$parsers/types';
	import { ColoredCard, Heal, Healthbar, MonSprite, TypeIcon } from '$ui';
	import { Heading, P, Button, Drawer } from 'flowbite-svelte';
	import { EditSolid } from 'flowbite-svelte-icons';

	interface MonCardProps {
		mon: PartyMon | BoxMon;
		ondelete: () => void;
	}
	let { mon = $bindable(), ondelete }: MonCardProps = $props();
	let species = $derived(pokemon.find((p) => p.name === mon.species)!);
	let open = $state(false);
	let innerHeight = $state(0);
	let innerWidth = $state(0);
</script>

<ColoredCard types={species.types}>
	<div class="mb-3 flex gap-1">
		<MonSprite {mon} />
		<div class="flex flex-col justify-between">
			<Heading tag="h5">{mon.nickname.join('')}</Heading>
			<div class="flex gap-3">
				{#each species.types as type}
					<TypeIcon {type} />
				{/each}
			</div>
		</div>
	</div>
	{#if 'currentHP' in mon && !mon.isEgg}
		<Healthbar {mon} />
	{/if}
	<P>Lv. {mon.level}</P>
	<P>Held Item: {mon.heldItem}</P>
	<div class="absolute right-5 bottom-5 flex gap-3">
		{#if 'currentHP' in mon && !mon.isEgg && (mon.status.name != 'NONE' || mon.currentHP != mon.stats[0])}
			<Heal bind:mon />
		{/if}
		<Button
			class="size-11 border-gray-300 p-2! hover:bg-gray-300"
			outline
			color="dark"
			onclick={() => (open = true)}><EditSolid class="text-gray-600 dark:text-gray-400" /></Button
		>
	</div>
</ColoredCard>
<Drawer
	bind:open
	placement={innerWidth > innerHeight ? 'right' : 'bottom'}
	class={innerWidth > innerHeight ? 'h-full w-[75%]' : 'h-[85%] w-full'}
	><MonDrawer
		bind:mon
		{species}
		ondelete={() => {
			ondelete();
			open = false;
		}}
	/></Drawer
>
<svelte:window bind:innerWidth bind:innerHeight />
