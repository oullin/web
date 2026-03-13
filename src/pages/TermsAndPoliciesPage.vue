<template>
	<div class="theme min-h-screen">
		<NavPartial />

		<main class="page-content">
			<div class="max-w-[820px] space-y-8 text-slate-500 dark:text-slate-300">
				<section class="space-y-4">
					<h1 class="h1 blog-h1">Terms and Policies</h1>
					<p>
						These Terms and Policies govern access to and use of our digital products and professional services, including our SaaS hiring platform, career progression tracking tool, QA
						automation platform, and software consultancy and technical architecture services.
					</p>
					<p>By registering for, purchasing, or using our services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Policies.</p>
					<p class="text-sm text-slate-400 dark:text-slate-500">Effective date: December 2025</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">1. Scope of Services</h2>
					<p>
						We provide software products and advisory services for business and professional users. Specific deliverables, service levels, timelines, and pricing are defined in the
						applicable order form, checkout page, or written statement of work.
					</p>
					<p>We may update, improve, or retire features to maintain security, performance, legal compliance, and product quality.</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">2. Account and Customer Responsibilities</h2>
					<p>
						You are responsible for maintaining the confidentiality of account credentials, restricting unauthorised access, and ensuring the accuracy of all information submitted through
						our platforms.
					</p>
					<p>
						You are also responsible for your use of the services and for ensuring your activities comply with all applicable laws, regulations, and industry requirements in relevant
						jurisdictions.
					</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">3. Acceptable Use Policy</h2>
					<p>
						Our services must not be used for unlawful, fraudulent, deceptive, abusive, or harmful activity. We strictly prohibit misleading offers, including "get rich quick" claims,
						"guaranteed placement" promises, or equivalent representations of guaranteed outcomes.
					</p>
					<p>We reserve the right to suspend or terminate access where use presents legal, security, reputational, or operational risk.</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">4. Fees, Billing, and Refunds</h2>
					<p>
						Fees, billing cycles, and payment terms are displayed at purchase or set out in writing. Applicable taxes and payment processing fees may be charged based on jurisdiction and
						selected plan.
					</p>
					<p>Unless otherwise required by law or expressly agreed in writing, fees are non-refundable for partially used subscription periods or partially delivered service terms.</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">5. Intellectual Property</h2>
					<p>All platform content, product materials, software, and related documentation remain our property or the property of our licensors unless otherwise agreed in writing.</p>
					<p>Subject to payment and compliance with these terms, you receive a limited, non-exclusive, non-transferable right to use the services for internal business purposes.</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">6. Liability and Service Availability</h2>
					<p>
						We aim to provide reliable services, but we do not warrant uninterrupted or error-free operation at all times. Services are provided on an "as available" basis, except where
						warranties cannot be excluded under applicable law in your jurisdiction.
					</p>
					<p>To the maximum extent permitted by law, we are not liable for indirect, incidental, special, consequential, or punitive damages arising from the use of our services.</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">7. Updates to These Terms</h2>
					<p>We may revise these Terms and Policies from time to time. Updated versions become effective when published on this page unless otherwise notified.</p>
				</section>

				<section class="space-y-4">
					<h2 class="h2 font-aspekta text-slate-700 dark:text-slate-200">8. Contact</h2>
					<p>For legal, billing, or policy-related inquiries, please contact us through the communication channels listed on the About page.</p>
				</section>
			</div>
		</main>

		<footer class="site-footer">
			<span>OULLIN // GUSTAVO OCANTO</span>
			<span>MOVEMENT // TRANSFORMATION // HEART // LIFE</span>
			<span>© 2026</span>
		</footer>
	</div>
</template>

<script setup lang="ts">
import NavPartial from '@partials/NavPartial.vue';
import { useSeo, siteUrlFor, buildKeywords } from '@/support/seo';
import { TERMS_AND_POLICIES_PATH } from '@/support/routes';

useSeo({
	title: 'Terms and Policies',
	url: siteUrlFor(TERMS_AND_POLICIES_PATH),
	description: 'Corporate terms and policies for our SaaS platforms and software consultancy services, including acceptable use, billing, and account responsibilities.',
	keywords: buildKeywords('terms of service', 'acceptable use policy', 'software consultancy terms'),
	jsonLd: {
		'@context': 'https://schema.org',
		'@type': 'WebPage',
		name: 'Terms and Policies',
		url: siteUrlFor(TERMS_AND_POLICIES_PATH),
		description: 'Corporate terms and policies for SaaS products and technical consulting services.',
	},
});
</script>
