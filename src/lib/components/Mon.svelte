<script>
	import { Card, Heading, P, Button, Drawer } from 'flowbite-svelte';
	let { mon = $bindable() } = $props();
</script>

<Card class="relative max-w-none p-5">
	<Heading tag="h5" class="mb-3">{mon.species}</Heading>
	<P>Lv. {mon.level}</P>
</Card>
