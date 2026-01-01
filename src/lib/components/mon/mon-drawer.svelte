<script lang="ts">
	import Basics from '$components/mon/basics.svelte';
	// import Caught from '$components/mon/caught.svelte';
	// import Misc from '$components/mon/misc.svelte';
	import Moves from '$components/mon/moves.svelte';
	import Stats from '$components/mon/stats.svelte';
	import type { Pokemon } from '$extractors/types';
	import type { BoxMon, PartyMon } from '$parsers/types';
	import DropdownSelect from '$ui/dropdown-select.svelte';
	import { Button, Heading, Hr, Tabs, TabItem } from 'flowbite-svelte';

	interface MonDrawerProps {
		mon: PartyMon | BoxMon;
		species: Pokemon;
		ondelete: () => void;
	}

	let { mon = $bindable(), species, ondelete }: MonDrawerProps = $props();
	let editor = $state('Basics');
</script>

<Heading tag="h4" class="mb-5">Edit {mon.nickname.join('')}</Heading>

<div class="hidden sm:block">
	<Tabs
		tabStyle="underline"
		classes={{ active: 'text-white rounded-t-lg dark:bg-purple-500 bg-purple-600' }}
	>
		<TabItem title="Basics">
			<Basics bind:mon {species} />
		</TabItem>
		<TabItem title="Stats">
			<Stats bind:mon {species} />
		</TabItem>
		<TabItem title="Moves">
			<Moves bind:mon {species} />
		</TabItem>
		<!-- <TabItem title="Caught"> -->
		<!-- 	<Caught bind:mon /> -->
		<!-- </TabItem> -->
		<!-- <TabItem title="Misc"> -->
		<!-- 	<Misc bind:mon {species} /> -->
		<!-- </TabItem> -->
	</Tabs>
	<div class="ml-4">
		<Button color="red" onclick={ondelete}>Delete Pokémon</Button>
	</div>
</div>

<div class="sm:hidden">
	<DropdownSelect bind:value={editor} options={['Basics', 'Stats', 'Moves', 'Caught', 'Misc']} />
	<Hr class="my-5" />
	{#if editor === 'Basics'}
		<Basics bind:mon {species} />
	{:else if editor === 'Stats'}
		<Stats bind:mon {species} />
	{:else if editor === 'Moves'}
		<Moves bind:mon {species} />
		<!-- {:else if editor === 'Caught'} -->
		<!-- 	<Caught bind:mon /> -->
		<!-- {:else if editor === 'Misc'} -->
		<!-- 	<Misc bind:mon {species} /> -->
	{/if}
	<div class="mt-7">
		<Button color="red" onclick={ondelete}>Delete Pokémon</Button>
	</div>
</div>
