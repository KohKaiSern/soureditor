<script lang="ts">
	import { Heading } from 'flowbite-svelte';
	import NumberInput from '$ui/number-input.svelte';
	import type { Bag } from '$parsers/types';

	let { bag = $bindable() }: { bag: Bag } = $props();
</script>

<div class="my-5 flex gap-10">
	<div class="w-full">
		<Heading tag="h5">Game Corner Coins</Heading>
		<NumberInput bind:value={bag.coins[0].qty} min={0} max={50000} />
	</div>
	<div class="w-full">
		<Heading tag="h5">Blue Card Points</Heading>
		<NumberInput bind:value={bag.blueCard[0].qty} min={0} max={30} />
	</div>
</div>
