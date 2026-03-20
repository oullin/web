<template>
	<div class="circuit-bg" aria-hidden="true">
		<svg viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<filter id="signal-glow" x="-100%" y="-100%" width="300%" height="300%">
					<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
					<feComposite in="SourceGraphic" in2="blur" operator="over" />
				</filter>
			</defs>

			<g stroke="currentColor" stroke-width="0.7" fill="none" opacity="0.09">
				<line x1="0" y1="120" x2="520" y2="120" />
				<line x1="840" y1="120" x2="1040" y2="120" />
				<line x1="1120" y1="120" x2="1440" y2="120" />
				<line x1="0" y1="240" x2="120" y2="240" />
				<line x1="520" y1="240" x2="840" y2="240" />
				<line x1="1040" y1="240" x2="1200" y2="240" />
				<line x1="1320" y1="240" x2="1440" y2="240" />
				<line x1="280" y1="360" x2="600" y2="360" />
				<line x1="680" y1="360" x2="900" y2="360" />
				<line x1="1040" y1="360" x2="1240" y2="360" />
				<line x1="0" y1="480" x2="280" y2="480" />
				<line x1="600" y1="480" x2="1440" y2="480" />
				<line x1="60" y1="600" x2="360" y2="600" />
				<line x1="840" y1="600" x2="1200" y2="600" />
				<line x1="1320" y1="600" x2="1440" y2="600" />
				<line x1="0" y1="720" x2="280" y2="720" />
				<line x1="560" y1="720" x2="840" y2="720" />
				<line x1="900" y1="720" x2="1100" y2="720" />
				<line x1="1200" y1="720" x2="1440" y2="720" />
				<line x1="280" y1="840" x2="560" y2="840" />
				<line x1="680" y1="840" x2="1040" y2="840" />
				<line x1="1100" y1="840" x2="1440" y2="840" />
			</g>

			<g stroke="currentColor" stroke-width="0.7" fill="none" opacity="0.09">
				<line x1="80" y1="120" x2="80" y2="360" />
				<line x1="160" y1="480" x2="160" y2="720" />
				<line x1="280" y1="360" x2="280" y2="480" />
				<line x1="280" y1="720" x2="280" y2="840" />
				<line x1="400" y1="240" x2="400" y2="360" />
				<line x1="400" y1="600" x2="400" y2="720" />
				<line x1="520" y1="120" x2="520" y2="240" />
				<line x1="560" y1="720" x2="560" y2="840" />
				<line x1="600" y1="360" x2="600" y2="480" />
				<line x1="680" y1="120" x2="680" y2="240" />
				<line x1="680" y1="360" x2="680" y2="480" />
				<line x1="760" y1="480" x2="760" y2="720" />
				<line x1="840" y1="120" x2="840" y2="240" />
				<line x1="840" y1="600" x2="840" y2="720" />
				<line x1="920" y1="240" x2="920" y2="480" />
				<line x1="1040" y1="240" x2="1040" y2="600" />
				<line x1="1120" y1="0" x2="1120" y2="120" />
				<line x1="1120" y1="360" x2="1120" y2="480" />
				<line x1="1200" y1="0" x2="1200" y2="240" />
				<line x1="1200" y1="480" x2="1200" y2="720" />
				<line x1="1360" y1="480" x2="1360" y2="720" />
			</g>

			<g fill="currentColor" opacity="0.22">
				<circle cx="520" cy="120" r="2.5" />
				<circle cx="840" cy="120" r="2.5" />
				<circle cx="1040" cy="120" r="2.5" />
				<circle cx="520" cy="240" r="2.5" />
				<circle cx="840" cy="240" r="2.5" />
				<circle cx="1040" cy="240" r="2.5" />
				<circle cx="1200" cy="240" r="2.5" />
				<circle cx="280" cy="360" r="2.5" />
				<circle cx="600" cy="360" r="2.5" />
				<circle cx="280" cy="480" r="2.5" />
				<circle cx="600" cy="480" r="2.5" />
				<circle cx="1040" cy="480" r="2.5" />
				<circle cx="1200" cy="480" r="2.5" />
				<circle cx="1360" cy="480" r="2.5" />
				<circle cx="840" cy="600" r="2.5" />
				<circle cx="1040" cy="600" r="2.5" />
				<circle cx="1200" cy="600" r="2.5" />
				<circle cx="280" cy="720" r="2.5" />
				<circle cx="560" cy="720" r="2.5" />
				<circle cx="840" cy="720" r="2.5" />
				<circle cx="1200" cy="720" r="2.5" />
				<circle cx="1360" cy="720" r="2.5" />
				<circle cx="280" cy="840" r="2.5" />
				<circle cx="560" cy="840" r="2.5" />
			</g>

			<path
				class="circuit-signal"
				fill="none"
				d="M 0,120 H 520 V 240 H 840 V 120 H 1040"
				stroke="var(--primary)"
				stroke-width="1.5"
				filter="url(#signal-glow)"
				style="animation-name: circuit-signal-1280; animation-duration: 7s; animation-delay: 0s; stroke-dasharray: 40 1240"
			/>
			<path
				class="circuit-signal"
				fill="none"
				d="M 0,480 H 280 V 360 H 600 V 480 H 1040"
				stroke="var(--primary)"
				stroke-width="1.5"
				filter="url(#signal-glow)"
				style="animation-name: circuit-signal-1280; animation-duration: 10s; animation-delay: -3s; stroke-dasharray: 40 1240"
			/>
			<path
				class="circuit-signal"
				fill="none"
				d="M 1200,0 V 240 H 1040 V 480 H 1200 V 720 H 1440"
				stroke="var(--cyan)"
				stroke-width="1.5"
				filter="url(#signal-glow)"
				style="animation-name: circuit-signal-1280; animation-duration: 8s; animation-delay: -5s; stroke-dasharray: 40 1240"
			/>
			<path
				class="circuit-signal"
				fill="none"
				d="M 0,720 H 280 V 840 H 560 V 720 H 840 V 600 H 1040"
				stroke="var(--primary)"
				stroke-width="1.5"
				filter="url(#signal-glow)"
				style="animation-name: circuit-signal-1400; animation-duration: 11s; animation-delay: -2s; stroke-dasharray: 40 1360"
			/>
			<path
				class="circuit-signal"
				fill="none"
				d="M 840,480 H 1040 V 600 H 1200 V 480 H 1360 V 720"
				stroke="var(--cyan)"
				stroke-width="1.5"
				filter="url(#signal-glow)"
				style="animation-name: circuit-signal-1000; animation-duration: 9s; animation-delay: -7s; stroke-dasharray: 40 960"
			/>
		</svg>
	</div>
</template>
