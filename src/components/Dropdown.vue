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
            <div v-if="canHaveNoneMessage" class="option" @click="setCurrentSelectedOption(null)">
                <p>{{ canHaveNoneMessage }}</p>
            </div>
			<div class="option" v-for="option in options" :key="option.key" @click="setCurrentSelectedOption(option)">
                <p>{{ option.text }}</p>
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
            }
        },
        props: {
            selectedOption: String,
            choiceDescription: String,
            noneSelectedText: String,
            requireSelected: Boolean,
            canHaveNoneMessage: String,
            options: Object
        },
        mounted() {
            this.selected = this.selectedOption as string;
        },
        methods: {
            setCurrentSelectedOption: function(option) {
                this.$emit('onSelectionChanged', option);
                this.selected = option ? option.value : null;
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
        margin: 10px 0;
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
    }

    .text {
        position: absolute;
        line-height: 27px;
    }

    .option-spacer {
        cursor: default;
        position: relative;
        background: $darker;
        padding-left: 4px;
        padding-bottom: 15px;
        padding-top: 15px;
        height: auto;
    }

    .spacer-text {
        margin-left: 6px;
        font-size: 12px;
        color: $dim;
    }

    .label-container {
        position: relative;
        border-radius: 3px;
        border: $dark solid 1px;
        width: 100%;
        height: 100%;
    }

    .label-container p {
        padding-left: 10px;
    }

    .options {
        cursor: pointer;
        position: relative;
        overflow: auto;
        max-height: 160px;
        z-index: 1000;
    }

    .option {
        position: relative;
        padding-left: 10px;
        height: 35px;
        background: $darker;
        border: transparent solid 1px;
        transition: all 100ms ease-in;
    }

    .option:hover p,
    .up-arrow:hover,
    .down-arrow:hover {
        opacity: 0.75;
    }

    .active {
        border-color: $theme;
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