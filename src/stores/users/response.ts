import { User } from '@stores/users/userType.ts';

export const Response: User = {
	nickname: 'Gus',
	handle: 'gocanto',
	name: 'Gustavo Ocanto',
	email: 'otnacog@example.com',
	profession: 'Software Engineer',
	salt: '8c403772-dd0f-4543-b26c-bc96747742f3',
	social: [
		{
			handle: '@gocanto',
			url: 'https://x.com/gocanto',
			description: 'Follow me in X.',
			name: 'x',
		},
		{
			handle: 'gocanto',
			url: 'https://www.youtube.com/@gocanto',
			description: 'Subscribe to my YouTube channel.',
			name: 'youtube',
		},
		{
			handle: 'gocanto',
			url: 'https://www.instagram.com/gocanto',
			description: 'Follow me in Instagram.',
			name: 'instagram',
		},
		{
			handle: 'gocanto',
			url: 'https://www.linkedin.com/in/gocanto/',
			description: 'Follow me in LinkedIn.',
			name: 'linkedin',
		},
		{
			handle: 'gocanto',
			url: 'https://github.com/gocanto',
			description: 'Follow me in GitHub.',
			name: 'github',
		},
	],
	experience: [
		{
			uuid: 'c17a68bc-8832-4d44-b2ed-f9587cf14cd1',
			company: 'Perx Technologies',
			employment_type: 'Full-Time',
			location_type: 'On-Site',
			position: 'Head of Engineering',
			start_date: 'June, 2024',
			end_date: 'April, 2025',
			summary:
				'Led and integrated cross-functional engineering teams (DevOps, Infrastructure, Data, Frontend, Backend, Support) across time zones, fostering open communication and accountability. Scaled team growth and operations from Singapore, optimized performance (database queries from 3 s to 800 ms; API calls from 2 s to 100 ms), implemented cloud cost savings, and partnered with C-level leaders to expand engineering initiatives.',
			country: 'Singapore',
			city: 'Singapore',
			skills: 'Executive Leadership, Strategic Planning, Engineering Management, Cross-functional Team Leadership, Technical Architecture.',
		},
		{
			uuid: '99db1ca0-948e-40b1-984f-e3b157a5d336',
			company: 'Aspire',
			employment_type: 'Full-Time',
			location_type: 'On-Site',
			position: 'Senior Software Engineer & Manager',
			start_date: 'January, 2022',
			end_date: 'April, 2024',
			summary:
				'Led a 12-person APAC team overseeing the software development lifecycle, mentorship, technical direction, and system architecture design. Engineered critical financial systems—prioritized payment request queues and automated credit schemas—and spearheaded SEA wallets from architecture through integration, unifying payment workflows and ledger synchronization. Improved debit account balance queries for real-time access and boosted API response times. Resolved data inconsistencies, refactored code for reliability, designed flexible scheduled payment solutions, and directed the transition from a monolithic to microservices architecture, significantly enhancing platform scalability and maintainability.',
			country: 'Singapore',
			city: 'Singapore',
			skills: 'Leadership, Strategic Planning, Engineering Management, Cross-functional Team Leadership, Technical Architecture.',
		},
		{
			uuid: '01e33400-6957-4d16-8edb-0802a49e445e',
			company: 'BeMyGuest - Tours & Activities',
			employment_type: 'Full-Time',
			location_type: 'On-Site',
			position: 'Engineering Lead',
			start_date: 'September, 2017',
			end_date: 'November, 2021',
			summary:
				'Developed and maintained inventory systems with availability calculations and time-slot capacity management. Led SaaS platform development for auto-recurring subscription payments and invoicing. Owned integration of Adyen, Stripe, and PayPal gateways for new white-label e-commerce accounts, and implemented third-party booking supplier APIs across B2B, B2C, and white-label channels, supporting mission-critical operations in Southeast Asian markets.',
			country: 'Singapore',
			city: 'Singapore',
			skills: 'Leadership, Strategic Planning, Cross-functional Team Leadership, Engineering Management, Technical Architecture.',
		},
		{
			uuid: '1ba5d878-3c48-4d94-aded-4a4294c26e12',
			company: 'Freelance',
			employment_type: 'Contractor',
			location_type: 'Remote',
			position: 'Web Developer',
			start_date: 'June, 2014',
			end_date: 'September, 2017',
			summary:
				'Built diverse web applications for SMEs—including e-commerce, POS, medical history, and neighborhood feedback platforms—using PHP, Laravel, VueJS, and MySQL. I also designed and delivered a multi-city drop-shipment warehouse management system, enabling real-time inventory control linked to financial reporting and distribution across multiple locations.',
			country: 'United States',
			city: 'Oklahoma City',
			skills: 'Leadership, Strategic Planning, Strategy Alignment, Cross-functional Team Leadership, Complexity Management',
		},
		{
			uuid: '8501d986-144d-4f4d-bd3f-7fb066028142',
			company: 'Websarrollo',
			employment_type: 'Full-Time',
			location_type: 'On-Site',
			position: 'Founder & Software Engineer',
			start_date: 'February, 2011',
			end_date: 'May, 2014',
			summary:
				'Led a team of designers and PHP developers, managing nationwide client projects and overseeing the full app development lifecycle—including iOS/Android social networking apps. I built CMS, shipping-tracking, e-commerce, web portfolio, college enrollment, and university survey systems, plus a City Hall Administrative System covering accounts payable, HR, payroll, treasury, and tax modules. My work leveraged PHP, jQuery (and jQuery Mobile), Cordova-JS, MySQL, HTML5, AngularJS, and Laravel 5, integrating third-party APIs and Facebook/Twitter logins within a SCRUM framework.',
			country: 'Venezuela',
			city: 'Valencia',
			skills: 'Leadership, Strategic Planning, Strategy Alignment, Team Development, Complexity Management.',
		},
		{
			uuid: '82076e4e-6099-457f-8ed5-b10585125ce5',
			company: 'Encava',
			employment_type: 'Full-Time',
			location_type: 'On-Site',
			position: 'Web Developer',
			start_date: 'May, 2009',
			end_date: 'February, 2011',
			summary:
				'Maintained the company’s AS400 administrative system and spearheaded development of department-specific applications—an e-commerce inventory control for retail, web reporting for production-line quality control, an online appointment system for the medical department, and a visitor registration/management tool. I leveraged PHP, jQuery, MySQL, HTML5, and AS400 within a SCRUM framework.',
			country: 'Venezuela',
			city: 'Valencia',
			skills: 'Creative Problem Solving, Analytical Skills, Strategy Alignment, Strategic Planning, Complexity Management.',
		},
		{
			uuid: 'd8c3957c-99dd-401a-9d95-f2b6b1dc021a',
			company: 'ForjaCentro',
			employment_type: 'Full-Time',
			location_type: 'On-Site',
			position: 'Web Developer',
			start_date: 'March, 2008',
			end_date: 'April, 2009',
			summary:
				'Maintained a Visual Basic administrative system and built internal applications to streamline operations—mail management, mechanical design support, sales-report automation, and web-based customer invoicing. I trained staff on these tools and provided technical support for Windows 8 and PC servers using PHP, jQuery, MySQL, HTML, and SQL Server.',
			country: 'Venezuela',
			city: 'Valencia',
			skills: 'Creative Problem Solving, Analytical Skills, Strategy Alignment, Strategic Planning, Complexity Management.',
		},
	],
	projects: [
		{
			uuid: '00a0a12e-6af0-4f5a-b96d-3c95cc7c365c',
			language: 'PHP / Vue',
			title: 'Think of your energy as an invisible compass.',
			excerpt: 'After experiencing the highs and lows of going into business with a family member, I reached a significant turning point in my life.',
			url: 'https://github.com/aurachakra',
			isOpenSource: false,
			icon: "icons/icon-01.svg",
			created_at: '2023-02-25',
			updated_at: '2023-10-05',
		},
		{
			uuid: '2d178e11-a584-4e20-a493-3b84007dd358',
			language: 'Vue / TypeScript',
			title: "Gus's personal website.",
			excerpt: 'Gus is a full-stack Software Engineer who has been building web technologies for more two decades.',
			url: 'https://github.com/gocantodev/client',
			isOpenSource: true,
			icon: "icons/icon-02.svg",
			created_at: '2021-11-03',
			updated_at: '2024-09-29',
		},
		{
			uuid: 'dc67854e-c8bd-4461-baba-8972bee7bfb5',
			language: 'GO',
			title: 'users-grpc-service',
			excerpt: 'users server & client communications service.',
			url: 'https://github.com/gocanto/users-grpc-service',
			isOpenSource: true,
			icon: "icons/icon-03.svg",
			created_at: '2022-04-17',
			updated_at: '2025-04-22',
		},
		{
			uuid: '32fd43ce-d957-4ad2-9d71-b57f71444f2a',
			language: 'PHP',
			title: 'laravel-simple-pdf',
			excerpt: 'Simple laravel PDF generator.',
			url: 'https://github.com/gocanto/laravel-simple-pdf',
			isOpenSource: true,
			icon: "icons/icon-04.svg",
			created_at: '2019-06-11',
			updated_at: '2020-12-26',
		},
		{
			uuid: 'b48d8098-962b-4ff9-884e-264ab33256c9',
			language: 'Vue / JS',
			title: 'vuemit',
			excerpt: 'The smallest Vue.js events handler.',
			url: 'https://github.com/gocanto/vuemit',
			isOpenSource: true,
			icon: "icons/icon-05.svg",
			created_at: '2017-02-01',
			updated_at: '2021-08-11',
		},
		{
			uuid: '19acd1d7-80ca-4828-88da-d3641f8d05e1',
			language: 'Vue / JS',
			title: 'google-autocomplete',
			excerpt: 'Google Autocomplete Vue Component.',
			url: 'https://github.com/gocanto/google-autocomplete',
			isOpenSource: true,
			icon: "icons/icon-06.svg",
			created_at: '2016-07-02',
			updated_at: '2021-08-11',
		},
		{
			uuid: '98b5d71a-1c78-4639-a9ed-343a8ba8c328',
			language: 'GO',
			title: 'converter-go',
			excerpt: "Currency converter that's data-agnostic.",
			url: 'https://github.com/gocanto/go-converter',
			isOpenSource: true,
			icon: "icons/icon-07.svg",
			created_at: '2021-09-02',
			updated_at: '2021-10-11',
		},
		{
			uuid: '3ce8b01f-406a-474c-80f3-8426617b42fe',
			language: 'PHP',
			title: 'http-client',
			excerpt: 'Http client that handles retries, logging & dynamic headers.',
			url: 'https://github.com/gocanto/http-client',
			isOpenSource: true,
			icon: "icons/icon-08.svg",
			created_at: '2019-07-01',
			updated_at: '2022-12-22',
		},
		{
			uuid: 'e517a966-f7d0-46a1-9ee4-494b38a116e5',
			language: 'PHP',
			title: 'converter',
			excerpt: "Immutable PHP currency converter that's data-agnostic.",
			url: 'https://github.com/gocanto/converter',
			isOpenSource: true,
			icon: "icons/icon-01.svg",
			created_at: '2019-06-07',
			updated_at: '2019-06-11',
		},
		{
			uuid: '928ac7e8-d0ba-4075-9c22-67050ab03755',
			language: 'PHP',
			title: 'Laravel Framework',
			excerpt: 'Contributions to the Laravel Framework.',
			url: 'https://github.com/laravel/framework/pulls?q=is%3Apr+is%3Aclosed+author%3Agocanto',
			isOpenSource: true,
			icon: "icons/icon-02.svg",
			created_at: '2017-07-06',
			updated_at: '2022-09-15',
		},
	],
	talks: [
		{
			uuid: 'b222d84c-5bbe-4c21-8ba8-a9baa7e5eaa9',
			title: 'Deprecating APIs in production environments.',
			subject: 'PHP APIs',
			location: 'Singapore',
			url: 'https://engineers.sg/v/3204',
			photo: 'talks/003.jpg',
			created_at: '2019-02-11',
			updated_at: '2019-02-11',
		},
		{
			uuid: '249c50ad-2fd8-45af-a429-5e25d05a6bdd',
			title: 'Bootstrapping to objects to control 3rd party integrations.',
			subject: 'Systems design patters and conventions.',
			location: 'Singapore',
			url: 'https://engineers.sg/v/3052',
			photo: 'talks/002.jpg',
			created_at: '2018-12-04',
			updated_at: '2018-12-04',
		},
		{
			uuid: '36c88e42-b04d-4be1-a183-c53439468769',
			title: 'Restful controllers in Laravel to stay lean at the HTTP layer.',
			subject: 'Actions abstractions in Laravel controllers.',
			location: 'Singapore',
			url: 'https://engineers.sg/v/2907',
			photo: 'talks/001.jpg',
			created_at: '2018-10-04',
			updated_at: '2018-10-04',
		},
	],
	recommendations: [
		{
			uuid: "7dc74d20-42e1-4f09-9c8d-20ecfc6caad7",
			relation: "Amrith was a fellow colleague reporting to the C-Level.",
			text: "Gus and I were peers at Perx during his tenure as Head of Engineering. He led several key initiatives, including scaling the engineering team and aligning cross-functional efforts across DevOps, backend, frontend, and data. Additionally, he drove projects focused on infrastructure modernisation, performance optimisation, and cloud cost efficiency." +
				"<br/><br/>" +
				"He's a hands-on and technically strong leader who enjoys solving complex engineering problems. Outside of work, Gustavo is highly disciplined when it comes to health and fitness, always consistent and focused, which says a lot about his overall approach to life and work.",
			person: {
				avatar: "recommendation/amrith-g.jpeg",
				full_name: "Amrith G",
				company: "Perx Technologies",
				designation: "Head of Marketing",
			},
			created_at: '2025-03-26',
			updated_at: '2025-03-26',
		},
		{
			uuid: "86fa5273-4e21-45e0-80de-5ec908cf6f81",
			relation: "Bhupesh reported directly to Gus.",
			text: "I had the privilege of working under Gustavo as an Engineering Manager, and his leadership has been nothing short of inspiring. Not only does he bring exceptional technical expertise and strategic thinking, but he also leads with empathy—something that truly sets him apart." +
				"<br/><br/>" +
				"Gustavo doesn’t just manage a team; he genuinely cares about each individual’s growth, challenges, and well-being. He understands the personal and professional struggles employees face and goes above and beyond to support them. This ability to balance technical excellence with emotional intelligence creates a culture of trust, collaboration, and high performance." +
				"<br/><br/>" +
				"His problem-solving mindset, clear communication, and mentorship have had a lasting impact on both the team and the success of our projects. Working with him has been a learning experience, and I highly recommend him to any organization looking for a strong, people-focused engineering leader.",
			person: {
				avatar: "recommendation/bhupesh-pathak.jpeg",
				full_name: "Bhupesh Pathak",
				company: "Perx Technologies",
				designation: "Senior Software Engineer",
			},
			created_at: '2025-02-26',
			updated_at: '2025-02-26',
		},
		{
			uuid: "dec7e524-34cc-405c-9b3a-01999852c9bb",
			relation: "Victory reported directly to Gus.",
			text: "I had a chance to work with Gus at Perx for the last 9 months. He consistently guided the team with clarity and supported our professional growth." +
				"<br/><br/>" +
				"Despite the challenges posed by an unclear structure and team dynamics, Gus has been dedicated to making processes smoother and more consistent across departments." +
				"<br/><br/>" +
				"His efforts to foster collaboration and improve workflows have had a meaningful impact on the team. I highly recommend Gus as a capable and inspiring engineering leader.",
			person: {
				avatar: "recommendation/victory-sometime.jpeg",
				full_name: "Victory SOMETIME",
				company: "Perx Technologies",
				designation: "Senior Software Engineer",
			},
			created_at: '2025-02-19',
			updated_at: '2025-02-19',
		},
		{
			uuid: "e4626228-99fa-4778-9a22-783174e7ab60",
			relation: "Damien was a senior to Gus, but did not manage him directly.",
			text: "Over the past two years, Gus has shown consistently high levels of technical skill and an innovative mindset, adapting through numerous changes and growth periods within our company." +
				"<br/><br/>" +
				"He is always eager to support the team in reaching its goals, displaying readiness to take action, and effective communication. His ability to think outside the box is a distinct strength." +
				"<br/><br/>" +
				"In this time, he also worked intentionally on his planning and leadership abilities, which have significantly complemented his already notable contributions to the team.",
			person: {
				avatar: "recommendation/damien-passavent.jpeg",
				full_name: "Damien Passavent",
				company: "Aspire",
				designation: "Chief Product Officer",
			},
			created_at: '2024-04-10',
			updated_at: '2024-04-10',
		},
		{
			uuid: "fa5c4084-e1b4-45dd-a314-e8d9f589f67e",
			relation: "Claudio managed Gus directly.",
			text: "Gustavo's blend of strong technical skills, problem-solving, and warm personality make him stand out. He's not only great at leading projects but also shines in teamwork, often stepping beyond his role to help others. As a mentor, he'd be invaluable, and his ability to communicate and innovate positions him perfectly for roles that bridge technical teams and clients.",
			person: {
				avatar: "recommendation/claudio-reggiani.jpeg",
				full_name: "Claudio Reggiani",
				company: "Aspire",
				designation: "Engineering Manger",
			},
			created_at: '2024-04-10',
			updated_at: '2024-04-10',
		},
		{
			uuid: "0e587fa2-b678-4ca5-9eed-0f115c4a092d",
			relation: "Jarek was a senior to Gus, but did not manage him directly.",
			text: "I have worked with Gustavo as a Sr Engineer in my department at Aspire. It was the second time we worked together and it has been a great pleasure to see how far Gustavo progressed in the last few years." +
				"<br/><br/>" +
				"Gustavo has an exceptional depth of knowledge in software development and consistently expands his high-quality knowledge with new technologies to better fit scaling team and systems." +
				"<br/><br/>" +
				"He constantly demonstrated ambition and drive to learn and improve each stage of the engineering process. With his level of knowledge and skills I can wholeheartedly recommend Gustavo for senior technical roles, as well as leadership positions where he can leverage this experience even more.",
			person: {
				avatar: "recommendation/jarek-tkaczyk.jpeg",
				full_name: "Jarek Tkaczyk",
				company: "Aspire",
				designation: "Head of Engineering",
			},
			created_at: '2023-02-27',
			updated_at: '2023-02-27',
		},
		{
			uuid: "a5029b3e-3ad2-45a4-8e98-2599cdf21697",
			relation: "Ross managed Gus directly.",
			text: "I had the pleasure of working alongside Gustavo for more than three years during his time at BeMyGuest." +
				"<br/><br/>" +
				"Working within a tech team at a startup can be a very challenging experience, there are competing pressures to deliver new features as quickly as possible, whilst at the same time we have to work hard to maintain stability and quality within the code we produce." +
				"<br/><br/>" +
				"Gustavo was an excellent and enthusiastic ambassador for this approach and led many initiatives to improve our systems, testing and architecture, leading to his work having a very positive impact on the overall quality of BeMyGuest's products." +
				"<br/><br/>" +
				"I would highly recommend Gustavo, his combination of attention to detail, with an irrepressible drive to continue learning makes him a valuable asset within any software engineering team.",
			person: {
				avatar: "recommendation/ross-riley.jpeg",
				full_name: "Ross Riley",
				company: "BeMyGuest - Tours & Activities",
				designation: "CTO",
			},
			created_at: '2021-11-27',
			updated_at: '2021-11-27',
		},
		{
			uuid: "1ca2026d-9d52-4da9-bbe2-5adba175d4c4",
			relation: "Kong was a fellow software engineer",
			text: "I have worked with Gus as a fellow Software Engineer since 2017. He is a highly adaptable, encouraging and supportive colleague and an effective team lead." +
				"<br/><br/>" +
				"His software development skill, whether its backend, full stack, is of exceptional high quality. During our stint in the company, he took the time to spearhead some of the initiatives to improve and updating the software development process and applications." +
				"<br/><br/>" +
				"He always has a positive attitude and a desire to produce quality work. Gus is as great a person as he was a colleague, a team lead and his next employer will be lucky to have him",
			person: {
				avatar: "recommendation/kong-kw.jpg",
				full_name: "Kong KW",
				company: "BeMyGuest - Tours & Activities",
				designation: "Senior Software Engineer",
			},
			created_at: '2021-10-20',
			updated_at: '2021-10-20',
		},
		{
			uuid: "1ca2026d-9d52-4da9-bbe2-5adba175d4c4",
			relation: "Dawid managed Gus directly.",
			text: "It was a pleasure to have an opportunity to work with Gustavo. He's a brilliant developer and analyst, with a head full of new ideas. He's not afraid of approaching the most complex problems and testing new waters to find the best solutions." +
				"<br/><br/>" +
				"He's got a great personality and always fun to have around in your team. Always keen to share his knowledge thru training or giving public presentations. He's got that deep internal drive to learn every day and test new ideas in real life, which I always find very valuable.",
			person: {
				avatar: "recommendation/dawid-makowski.jpeg",
				full_name: "Dawid Makowski",
				company: "BeMyGuest - Tours & Activities",
				designation: "CTO",
			},
			created_at: '2019-07-16',
			updated_at: '2019-07-16',
		},
	],
	education: [
		{
			uuid: "a0fde63b-016b-4121-959f-18a950b8bc81",
			icon: "education/uah_logo.jpeg",
			school: "Universidad Alejandro de Humboldt",
			degree: "Bachelor's degree",
			field: "Computer Science",
			description: "As a computer scientist, I see computer science as the study of computers and computational processes, covering their underlying principles, design, real‑world applications, and even their impact on society." +
				"<br/><br/>" +
				"My work spans both the theoretical side—think algorithms and data structures—and the hands‑on side, like building software and exploring artificial intelligence. At its core, computer science is about understanding how computers operate and using that insight to solve problems and develop new technologies.",
			graduated_at: "2012",
			issuing_country: "Venezuela"
		},
		{
			uuid: "606e8e34-f189-425c-bc1d-cb7f8ec30dd8",
			icon: "education/iut_valencia.jpeg",
			school: "IUT Valencia",
			degree: "Associate's degree",
			field: "Computer Science",
			description: "Having completed my Associate’s in Computer Science, I’ve built a strong foundation in how computers work—learning the basics of algorithm design and data organization alongside hands‑on experience writing software and experimenting with entry‑level enterprise software."+
				"<br/><br/>" +
				"For me, computer science means using both theory and practical skills to tackle real‑world challenges and bring new tech ideas to life.",
			graduated_at: "2007",
			issuing_country: "Venezuela"
		}
	]
};
