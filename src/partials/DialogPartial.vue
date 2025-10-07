<template>
	<Teleport to="body">
		<Transition :name="transitionName">
			<div v-if="modelValue" :class="['fixed inset-0 z-50 flex items-center justify-center p-4', rootClass]">
				<div :class="['absolute inset-0 bg-slate-900/70 dark:bg-slate-950/80', overlayClass]" @click="handleBackdropClick" />

				<div
					ref="dialogRef"
					:class="['relative w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-slate-900', panelClass]"
					:role="role"
					:aria-modal="true"
					:aria-labelledby="ariaLabelledby"
					:aria-describedby="ariaDescribedby"
					tabindex="-1"
					@click.stop
				>
					<slot />
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
		ariaLabelledby?: string;
		ariaDescribedby?: string;
		closeOnBackdrop?: boolean;
		rootClass?: string;
		overlayClass?: string;
		panelClass?: string;
		transitionName?: string;
		role?: string;
		lockScroll?: boolean;
	}>(),
	{
		closeOnBackdrop: true,
		transitionName: 'fade',
		role: 'dialog',
		lockScroll: true,
	},
);

const emit = defineEmits<{
	(_event: 'update:modelValue', _value: boolean): void;
	(_event: 'open'): void;
	(_event: 'close'): void;
}>();

const dialogRef = ref<HTMLDivElement | null>(null);
const isOpen = computed(() => props.modelValue);
let previousActiveElement: HTMLElement | null = null;
let previousBodyOverflow = '';

const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

const focusWithinDialog = async () => {
	await nextTick();
	const focusableElements = dialogRef.value?.querySelectorAll<HTMLElement>(focusableSelectors);

	if (focusableElements && focusableElements.length > 0) {
		focusableElements[0].focus();
	} else {
		dialogRef.value?.focus();
	}
};

const handleKeyDown = (event: KeyboardEvent) => {
	if (!isOpen.value) return;

	if (event.key === 'Escape') {
		event.preventDefault();
		closeDialog();
		return;
	}

	if (event.key === 'Tab') {
		const focusableElements = dialogRef.value?.querySelectorAll<HTMLElement>(focusableSelectors);
		if (!focusableElements || focusableElements.length === 0) return;

		const elements = Array.from(focusableElements);
		const isShiftPressed = event.shiftKey;
		const currentFocusedElement = document.activeElement as HTMLElement | null;
		const currentIndex = elements.findIndex((element) => element === currentFocusedElement);

		let nextIndex = currentIndex;

		if (isShiftPressed) {
			nextIndex = currentIndex <= 0 ? elements.length - 1 : currentIndex - 1;
		} else {
			nextIndex = currentIndex === -1 || currentIndex === elements.length - 1 ? 0 : currentIndex + 1;
		}

		const nextElement = elements[nextIndex];
		if (nextElement && nextElement !== currentFocusedElement) {
			event.preventDefault();
			nextElement.focus();
		} else if (nextElement) {
			event.preventDefault();
			nextElement.focus();
		}
	}
};

const closeDialog = () => {
	if (!isOpen.value) return;
	emit('update:modelValue', false);
};

const handleBackdropClick = () => {
	if (!props.closeOnBackdrop) return;
	closeDialog();
};

watch(
	() => props.modelValue,
	async (newValue, oldValue) => {
		if (newValue) {
			previousActiveElement = document.activeElement as HTMLElement;
			document.addEventListener('keydown', handleKeyDown);
			if (props.lockScroll) {
				previousBodyOverflow = document.body.style.overflow;
				document.body.style.overflow = 'hidden';
			}
			await focusWithinDialog();
			emit('open');
		} else if (oldValue) {
			document.removeEventListener('keydown', handleKeyDown);
			if (props.lockScroll) {
				document.body.style.overflow = previousBodyOverflow;
			}
			await nextTick();
			previousActiveElement?.focus();
			previousActiveElement = null;
			emit('close');
		}
	},
);

onBeforeUnmount(() => {
	document.removeEventListener('keydown', handleKeyDown);
	if (props.lockScroll) {
		document.body.style.overflow = previousBodyOverflow;
	}
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
