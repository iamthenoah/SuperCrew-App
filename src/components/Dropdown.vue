<template>
    <div class="dropdown" @click="shouldToggleDropdown()">
        <div class="label-container" :class="{ 'active': isExpanded }">
            <p class="text" :class="{ 'error' : requireSelected && !selected }">{{ selected ? selected : noneSelectedText }}</p>
            <div :class="{ 'down-arrow': !isExpanded, 'up-arrow': isExpanded }"></div>
		</div>
		<div class="options" :class="{ 'hide': !isExpanded }">
            <div class="option-spacer">
                <div class="spacer-text">{{ choiceDescription }}</div>
            </div>
			<div class="option" v-for="option in options" :key="option.key" @click="setCurrentSelectedOption(option)">
                <p>{{ option.value }}</p>
            </div>
		</div>

	</div>
</template>

<script lang="ts">

	import { defineComponent } from 'vue';
    
    export default defineComponent({
        emits: ['onSelectionChanged'],
        data() {
            return {
                isExpanded: false,
                selected: '',
                options: [
                    { key: 1, value: 'Headphone 1' },
                    { key: 2, value: 'Headphone 2' },
                    { key: 3, value: 'Headphone 3' },
                    { key: 3, value: 'Headphone 3' },
                    { key: 3, value: 'Headphone 3' },
                    { key: 3, value: 'Headphone 3' },
                    { key: 3, value: 'Headphone 3' },
                    { key: 3, value: 'Headphone 3' },
                    { key: 4, value: 'Headphone 4' },
                    { key: 5, value: 'Headphone 5' }
                ]
            }
        },
        props: {
            selectedOption: String,
            choiceDescription: String,
            noneSelectedText: String,
            requireSelected: Boolean
        },
        mounted() {
            this.selected = this.selectedOption as string;
        },
        methods: {
            setCurrentSelectedOption: function(option) {
                this.$emit('onSelectionChanged', option);
                this.selected = option.value;
            },
            shouldToggleDropdown: function() {
                this.isExpanded = !this.isExpanded;
            }
        },
	});

</script>

<style lang="scss" scoped>
    
	@import './src/assets/styles/variables.scss';

    .dropdown {
        cursor: pointer;
        position: relative;
        user-select: none;
        border-radius: 3px;
        width: 100%;
        height: 33px;
        background: $darker;
        margin-bottom: 15px;
        font-size: 15px;
        font-family: 'Uni Sans', cursive;
        z-index: 10000;
    }

    .text {
        position: absolute;
        line-height: 29px;
    }

    .option-spacer {
        cursor: default;
        position: relative;
        width: 100%;
        background: $darker;
        padding: 15px 0;
        height: auto;
    }

    .spacer-text {
        margin-left: 6px;
        font-size: 12px;
        color: $lighter;
    }

    .label-container {
        position: relative;
        border-radius: 3px;
        border: $dark solid 1px;
        width: 100%;
        height: 100%;
    }

    .label-container p {
        padding-left: 6px;
    }

    .options {
        cursor: pointer;
        position: relative;
        overflow: auto;
        max-height: 150px;
    }

    .option {
        position: relative;
        padding-left: 6px;
        height: 35px;
        background: $darker;
        border: transparent solid 1px;
        transition: all 100ms ease-in;
    }

    .option:hover p {
        opacity: 0.75;
    }

    .active {
        border-color: $theme;
    }
    
    .option span {
        position: relative;
        width: 100%;
        z-index: 100;
        height: 10px;
        background: $lighter;
    }

    .up-arrow,
    .down-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0;
        margin-right: 10px;
        width: 10px;
        height: 5px;
        background: white;
    }

    .down-arrow {
        clip-path: polygon(100% 0, 0 0, 50% 100%);
    }

    .up-arrow {
        clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }

    .hide {
        display: none;
    }

</style>