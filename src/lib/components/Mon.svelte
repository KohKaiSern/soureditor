<script lang="ts">
	import { Card, Heading, P, Button, Drawer } from 'flowbite-svelte';
	import { EditSolid } from 'flowbite-svelte-icons';
	import { pokemon } from '$data';
	import { getTypeColor } from '$lib/utils';
	import MonEditor from './MonEditor.svelte';
	let { mon = $bindable() } = $props();
	let open = $state(false);
	let innerWidth = $state(0);
	let innerHeight = $state(0);
</script>

<Card class="relative max-w-none p-5">
	<div class="mb-3 flex justify-between gap-3">
		<Heading tag="h6">{mon.species}</Heading>
		<div class="flex gap-3">
			{#each pokemon.find((pokemon) => pokemon.name === mon.species)!.types as type}
				<div
					class="flex size-[30px] items-center justify-center rounded-[50%]"
					style:background-color={getTypeColor(type)}
				>
					<img
						class="size-[60%] object-contain"
						src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/5781623f147f1bf850f426cfe1874ba56a9b75ee/icons/${type.toLowerCase()}.svg`}
						alt={`${type} logo`}
					/>
				</div>
			{/each}
		</div>
	</div>
	<P>Lv. {mon.level}</P>
	<P>Held Item: {mon.heldItem}</P>
	<Button class="absolute right-5 bottom-5 p-2!" outline color="dark" onclick={() => (open = true)}>
		<EditSolid />
	</Button>
</Card>

<Drawer
	bind:open
	placement={innerWidth > innerHeight ? 'right' : 'bottom'}
	class={innerWidth > innerHeight ? 'h-full w-[75%]' : 'h-[75%] w-full'}
>
	<MonEditor bind:mon />
</Drawer>

<svelte:window bind:innerWidth bind:innerHeight />
