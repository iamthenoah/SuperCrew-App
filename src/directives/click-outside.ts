import { DirectiveBinding } from 'vue';

export default {
    beforeMount: function(el: any, binding: DirectiveBinding<any>) {

        if (typeof binding.value !== 'function')
            console.warn(`[Vue-click-outside] : Provided expression '${binding.instance}' is not a function, but has to be. Found in component '${el}'`);
        
        const handler = e => {
            if (!el.contains(e.target) && el !== e.target) {
                binding.value(e);
            }
        }
        
        el.__vueClickOutside__ = handler;
        document.addEventListener('click', handler);
    },
    
    unmounted: function(el: any) {
        document.removeEventListener('click', el.__vueClickOutside__);
        el.__vueClickOutside__ = null;
    }
}