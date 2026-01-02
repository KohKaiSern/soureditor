<script lang="ts">
	import { isShiny } from '$components/utils';
	import pokemon from '$data/pokemon.json';
	import type { BoxMon, PartyMon } from '$parsers/types';

	let { mon }: { mon: PartyMon | BoxMon } = $props();

	let src = $derived.by(() => {
		let path = pokemon.find((p) => p.name === mon.species)!.paths.sprite;
		if (mon.isEgg) {
			path = 'gfx/pokemon/egg/';
		}
		path += isShiny(mon) ? 'shiny' : 'normal';
		return `https://raw.githubusercontent.com/KohKaiSern/soureditor/refs/heads/main/src/${path}.gif`;
	});
</script>

<div
	class="mr-5 flex size-[75px] items-center justify-center rounded-lg border border-gray-300 bg-white dark:border-none"
>
	<img {src} alt={`GIF of the front sprite of ${mon.species}`} />
</div>
