import { DirectiveBinding } from 'vue';

export default {
	mounted: function(el: any, binding: DirectiveBinding<any>) {
		const tooltipContainer = document.createElement('div');
		tooltipContainer.classList.add('tooltip');
		const tooltipText = `
            <span>${binding.value ? binding.value : '...'}</span>
            <div class="tooltip-arrow"></div>
        `;
		tooltipContainer.innerHTML = tooltipText;

		const showTooltipHandler = () => el.appendChild(tooltipContainer);
		const hideTooltipHandler = () => el.removeChild(tooltipContainer);

		el.__vueTooltipShow__ = showTooltipHandler;
		el.__vueTooltipHide__ = hideTooltipHandler;

		el.addEventListener('mouseenter', showTooltipHandler);
		el.addEventListener('mouseleave', hideTooltipHandler);

		// const tooltipContainer = document.createElement('div');

		// const createContainer = (e: MouseEvent) => {
		//     const { x, y, width, height } = (e.target as HTMLElement).getBoundingClientRect();
		//     console.log((e.target as HTMLElement).getBoundingClientRect());
		//     console.log('new', x, e.clientY + height);
		//     const tooltipText = `
		//         <div class="tooltip" style="left:${x}px; top:${e.clientY+height}px">
		//             <span>${binding.value}</span>
		//             <div class="tooltip-arrow"></div>
		//         </div>
		//     `;

		//     tooltipContainer.innerHTML = tooltipText;
		//     return tooltipContainer;
		// }

		// const showTooltipHandler = e => el.appendChild(createContainer(e));
		// const hideTooltipHandler = () => el.removeChild(tooltipContainer);

		// el.__vueTooltipShow__ = showTooltipHandler;
		// el.__vueTooltipHide__ = hideTooltipHandler;

		// el.addEventListener('mouseenter', showTooltipHandler);
		// el.addEventListener('mouseleave', hideTooltipHandler);
	},

	unmounted: function(el: any) {
		el.removeEventListener('mouseenter', el.__vueTooltipShow__);
		el.removeEventListener('mouseleave', el.__vueTooltipHide__);
		el.__vueTooltipShow__ = null;
		el.__vueTooltipHide__ = null;
	},
};
