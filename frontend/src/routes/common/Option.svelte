<script>
    import { pet, user } from "$lib/stores.js";
    export let value;
    export let key;
    export let isDropdownActive;
    export let petsArr;

    $: option =
        petsArr?.filter((option) => option._id == key)[0] ||
        {name: "", image_uri: ""};
    // $: console.log("OPTIONS", petsArr);
    // $: console.log("OPTION", option);

    function selectOption() {
        value = key;
        pet.set(key);
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class={(value == key || value == 0)
        ? isDropdownActive
            ? "Default NoPadding"
            : "Default IdleColor NoPadding"
        : "Default"}
    on:click={selectOption}
>
    <img src={option.image_uri} alt={option.name + "'s picture"} class="RoundImg" />
    <p>{option.name}</p>
</div>

<style>
    .Default {
        display: flex;
        justify-content: flex-start;
        width: calc(10rem - 4px);
        padding: 0.2rem 0.4rem 0.2rem 0.4rem;
        background-color: var(--color-enabled);
        border-radius: 1rem;
    }
    .Default:hover {
        cursor: pointer;
    }
    .RoundImg {
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 0.75rem;
        margin-right: 0.4rem;
    }
    .IdleColor {
        background-color: var(--color-disabled);
    }
    .NoPadding {
        padding: 0;
    }
</style>
