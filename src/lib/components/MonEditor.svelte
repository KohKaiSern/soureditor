<script lang="ts">
	import { Heading, Accordion, AccordionItem } from 'flowbite-svelte';
	import { Basics, DVStatExp, Moveset, Misc } from './MonEditors';
	let { mon = $bindable() } = $props();
</script>

<Heading tag="h3">EDIT: {mon.species}</Heading>

<Accordion class="mt-4">
	<AccordionItem open>
		{#snippet header()}Basics{/snippet}
		<Basics bind:mon />
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}DVs & Stat Experience{/snippet}
		<DVStatExp bind:mon />
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Moveset{/snippet}
		<Moveset bind:mon />
	</AccordionItem>
	<AccordionItem>
		{#snippet header()}Miscellaneous{/snippet}
		<Misc bind:mon />
	</AccordionItem>
</Accordion>
