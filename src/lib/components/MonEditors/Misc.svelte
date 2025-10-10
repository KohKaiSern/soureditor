<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import { NumberInput } from '../UI';
	let { mon = $bindable() } = $props();
</script>

{#if mon.isEgg}
	<Heading tag="h6">Egg Hatch Cycles</Heading>
{:else}
	<Heading tag="h6">Happiness</Heading>
{/if}
<br />
<NumberInput bind:value={mon.happiness} min={0} max={255} />
