<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\Event;
use App\Models\GalleryImage;
use App\Models\ImpactStat;
use App\Models\Inquiry;
use App\Models\Milestone;
use App\Models\NewsletterSubscriber;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Programme;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\User;
use App\Support\HomePageSettings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    private function storageUrl(string $path): string
    {
        return '/storage/'.$path;
    }

    public function run(): void
    {
        $admin = User::create([
            'name' => 'Kwame Asante',
            'email' => 'admin@hopespringfoundation.org',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Ama Mensah',
            'email' => 'editor@hopespringfoundation.org',
            'password' => Hash::make('password'),
            'role' => UserRole::Editor,
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Kofi Darko',
            'email' => 'finance@hopespringfoundation.org',
            'password' => Hash::make('password'),
            'role' => UserRole::Finance,
            'email_verified_at' => now(),
        ]);

        $programmes = $this->seedProgrammes();
        $this->seedProjects($programmes);
        $this->seedPosts($admin);
        $this->seedTeamMembers();
        $this->seedGalleryImages();
        $this->seedEvents();
        $this->seedDonations();
        $this->seedContactMessages();
        $this->seedNewsletterSubscribers();
        $this->seedInquiries();
        $this->seedImpactStats();
        $this->seedMilestones();
        $this->seedPartners();
        $this->seedSiteSettings();
    }

    /** @return array<string, Programme> */
    private function seedProgrammes(): array
    {
        $data = [
            'water' => ['title' => 'Clean Water Initiative', 'slug' => 'clean-water-initiative', 'description' => 'Providing safe, clean drinking water to rural communities across Ghana through borehole construction, water purification systems, and community education on water sanitation.', 'long_description' => "Access to clean water changes everything. When a community gains a reliable water source, children spend less time walking to distant rivers, waterborne diseases drop sharply, and families can focus on farming, schoolwork, and building better lives.\n\nOur Clean Water Initiative drills mechanised boreholes fitted with hand pumps, installs bio-sand filtration units in schools, and trains local WASH committees to maintain every system we build. Since 2016 we have completed over 50 water points across the Upper East, Northern, and Savannah regions — each one designed to serve at least 300 people for a minimum of 15 years.\n\nEvery project starts with a hydrogeological survey, followed by community engagement to agree on siting and maintenance responsibilities. We don't just drill and leave; our field officers revisit each borehole quarterly for the first two years, and annually thereafter.", 'icon' => 'Droplets', 'photo' => '/images/home-programme-water.jpg', 'sort_order' => 1],
            'education' => ['title' => 'Education for All', 'slug' => 'education-for-all', 'description' => 'Supporting children and young adults with scholarships, school supplies, infrastructure improvements, and teacher training programmes in underserved communities.', 'long_description' => "Education is the most powerful tool for breaking the cycle of poverty. In many of the communities we serve, families struggle to afford uniforms, books, and examination fees — and girls are often the first to be pulled out of school.\n\nOur Education for All programme provides full scholarships covering tuition, supplies, and a daily meal for primary and junior high students. We also run a teacher training track that pairs rural teachers with mentors from Accra-based colleges, and we fund classroom block construction where schools are overcrowded or crumbling.\n\nTo date, more than 3,000 children have received direct support, and our scholarship retention rate stands at 94 % — well above the national average for similar programmes.", 'icon' => 'GraduationCap', 'photo' => '/images/home-programme-education.jpg', 'sort_order' => 2],
            'healthcare' => ['title' => 'Healthcare Outreach', 'slug' => 'healthcare-outreach', 'description' => 'Delivering essential healthcare services, medical supplies, and health education to communities with limited access to medical facilities.', 'long_description' => "In rural Ghana, the nearest clinic can be a two-hour walk — or further. Our Healthcare Outreach programme bridges that gap with quarterly mobile health screenings, a community health volunteer network, and strategic partnerships with district hospitals.\n\nEach screening covers malaria rapid testing, blood-pressure checks, maternal health consultations, and childhood immunisations. Between visits, our trained community health volunteers provide first-aid, distribute bed nets, and identify cases requiring referral.\n\nWe also operate a medicine supply chain that stocks 15 community-based health posts with essential drugs, keeping treatments accessible and affordable year-round.", 'icon' => 'HeartPulse', 'photo' => '/images/home-programme-healthcare.jpg', 'sort_order' => 3],
            'community' => ['title' => 'Community Development', 'slug' => 'community-development', 'description' => 'Empowering communities through sustainable livelihood programmes, infrastructure development, and capacity building initiatives.', 'long_description' => "Sustainable change requires more than a single project — it requires a community that can plan, fund, and maintain its own development. Our Community Development programme works alongside traditional leaders and district assemblies to build that capacity.\n\nWe run savings-and-loans groups (known locally as susu clubs) that give women and smallholder farmers access to micro-credit. We construct community centres that double as meeting halls and adult-literacy classrooms. And we support agricultural extension services that help farmers adopt drought-resistant crops and improve yields.\n\nThe goal is always the same: leave every community stronger and more self-reliant than we found it.", 'icon' => 'Users', 'photo' => '/images/home-programme-community.jpg', 'sort_order' => 4],
        ];

        $programmes = [];
        foreach ($data as $key => $fields) {
            $programmes[$key] = Programme::create($fields);
        }

        return $programmes;
    }

    /** @param array<string, Programme> $programmes */
    private function seedProjects(array $programmes): void
    {
        $projects = [
            // --- Clean Water Initiative ---
            ['programme' => 'water', 'title' => 'Bongo District Borehole Network', 'slug' => 'bongo-district-borehole-network', 'description' => 'Construction of 8 mechanised boreholes across 8 villages in the Bongo District, Upper East Region, serving over 4,000 people with year-round clean water access.', 'long_description' => "The Bongo District lies in one of Ghana's driest corridors. Before this project, women and children walked up to 4 km each day to fetch water from unprotected dugouts shared with livestock.\n\nWorking with the Bongo District Assembly and WaterAid, we drilled 8 mechanised boreholes between March and November 2023. Each borehole is fitted with an Afridev hand pump and enclosed with a concrete apron to prevent ground contamination. A trained WASH committee of 5 community members manages every site.\n\nPost-completion water-quality testing confirmed zero E. coli presence at all 8 points — a marked improvement over the baseline samples taken before drilling.", 'location' => 'Bongo, Upper East Region', 'status' => 'completed', 'start_date' => '2023-03-01', 'end_date' => '2023-11-15', 'is_featured' => true],
            ['programme' => 'water', 'title' => 'Tamale Peri-Urban Water Scheme', 'slug' => 'tamale-peri-urban-water-scheme', 'description' => 'A piped water distribution network connecting 3 small-town systems on the outskirts of Tamale to the Ghana Water Company main line, reducing reliance on seasonal hand-dug wells.', 'long_description' => "Rapid urbanisation around Tamale has left peri-urban communities in a grey zone — too far from the city grid for piped water, yet too densely settled for traditional boreholes to meet demand.\n\nThis project lays 6.2 km of HDPE pipe from the Ghana Water Company's nearest trunk line to three community standpipes, each metered and managed by a local water board. A prepaid token system keeps the service affordable while generating the revenue needed for maintenance.\n\nConstruction is ongoing, with the first standpipe already operational in Changli, serving roughly 1,200 residents.", 'location' => 'Tamale, Northern Region', 'status' => 'ongoing', 'start_date' => '2024-06-01', 'end_date' => null, 'is_featured' => false],
            ['programme' => 'water', 'title' => 'Keta Lagoon Rainwater Harvesting', 'slug' => 'keta-lagoon-rainwater-harvesting', 'description' => 'Installation of 12 ferro-cement rainwater harvesting tanks at schools and health centres in the Keta Municipality, capturing monsoon rainfall for dry-season use.', 'long_description' => "Keta sits on a narrow sand bar between the Atlantic Ocean and the Keta Lagoon. Groundwater is saline and unsuitable for drinking, making rainfall the primary freshwater source.\n\nWe are installing 10,000-litre ferro-cement tanks at 8 schools and 4 CHPS compounds. Each tank connects to galvanised-iron roof guttering and a first-flush diverter that discards the initial dirty runoff. A slow sand filter at the tap point ensures safe drinking water.\n\nThe project launches in September 2026 to coincide with the major rainy season, allowing tanks to fill before the December–March dry spell.", 'location' => 'Keta, Volta Region', 'status' => 'upcoming', 'start_date' => '2026-09-01', 'end_date' => null, 'is_featured' => false],

            // --- Education for All ---
            ['programme' => 'education', 'title' => "Yendi Girls\u{2019} Scholarship Fund", 'slug' => 'yendi-girls-scholarship-fund', 'description' => 'Full scholarships for 120 girls in the Yendi Municipality covering tuition, uniforms, books, and a daily school meal from primary through JHS completion.', 'long_description' => "In the Yendi Municipality, fewer than 40 % of girls who start primary school complete JHS. Poverty, early marriage, and the cost of basic supplies are the main barriers.\n\nThis fund covers every direct cost of schooling — tuition, examination fees, two uniforms, exercise books, and a midday meal prepared by a community catering team. We also assign each girl a female mentor from the community who monitors attendance and mediates with families when pressures to withdraw arise.\n\nSince the fund launched in 2019, our retention rate is 94 %, and 38 of our first cohort have progressed to SHS — 12 on government bursaries we helped them apply for.", 'location' => 'Yendi, Northern Region', 'status' => 'ongoing', 'start_date' => '2019-09-01', 'end_date' => null, 'is_featured' => true],
            ['programme' => 'education', 'title' => 'Assin Fosu Classroom Block', 'slug' => 'assin-fosu-classroom-block', 'description' => 'Construction of a 6-classroom block with furniture, a library corner, and accessible ramp at Assin Fosu D/A Primary, replacing a collapsing mud-brick structure.', 'long_description' => "The existing school building at Assin Fosu D/A Primary was a mud-brick structure built in the 1980s. Three of its four classrooms had lost their roofing sheets, and classes were held under trees during dry weather — and cancelled entirely when it rained.\n\nOur new block is a sandcrete structure with aluminium roofing, louvre-blade windows for ventilation, a concrete floor, and dual-desk furniture for 240 pupils. One classroom doubles as a small library stocked with 600 donated books. The building includes an accessible ramp and wider doorways.\n\nThe Ghana Education Service contributed teachers; our role was construction, furnishing, and a 2-year maintenance agreement.", 'location' => 'Assin Fosu, Central Region', 'status' => 'completed', 'start_date' => '2022-01-15', 'end_date' => '2022-08-30', 'is_featured' => false],
            ['programme' => 'education', 'title' => 'Upper West Teacher Training Programme', 'slug' => 'upper-west-teacher-training', 'description' => 'A 12-month mentorship programme pairing 30 rural teachers in the Upper West Region with experienced educators from the University of Education, Winneba.', 'long_description' => "Many teachers posted to rural Upper West schools are fresh graduates with limited classroom management experience. High turnover means pupils rarely have the same teacher two years in a row.\n\nThis programme pairs each rural teacher with a mentor from the University of Education, Winneba. Mentors visit termly for lesson observation and coaching, while a WhatsApp peer-learning group provides day-to-day support between visits. We also supply each participant with a teaching resource kit — lesson-plan templates, manipulatives for maths, and reading-level assessment tools.\n\nThe pilot cohort of 30 teachers began in January 2025. Early feedback shows improved lesson planning and a noticeable drop in pupil absenteeism in participating schools.", 'location' => 'Wa, Upper West Region', 'status' => 'ongoing', 'start_date' => '2025-01-10', 'end_date' => null, 'is_featured' => false],

            // --- Healthcare Outreach ---
            ['programme' => 'healthcare', 'title' => 'Northern Region Mobile Health Clinics', 'slug' => 'northern-region-mobile-clinics', 'description' => 'Quarterly mobile health screenings in 12 communities across the Northern Region — covering malaria testing, maternal care, immunisations, and blood-pressure checks.', 'long_description' => "The nearest health facility for many communities in the Northern Region is a 2–3 hour walk. Our mobile clinics bring services to people rather than expecting them to travel.\n\nEach quarterly visit deploys a team of 2 nurses, 1 midwife, and 1 community health officer with a fully stocked mobile pharmacy. Services include malaria rapid diagnostic testing, antenatal care, childhood immunisations (Penta, OPV, measles), blood-pressure screening, and health education talks on nutrition and sanitation.\n\nSince 2020, the programme has conducted over 9,000 consultations and identified more than 300 cases requiring hospital referral — including 14 obstetric emergencies that might otherwise have gone undetected.", 'location' => 'Northern Region (12 communities)', 'status' => 'ongoing', 'start_date' => '2020-04-01', 'end_date' => null, 'is_featured' => true],
            ['programme' => 'healthcare', 'title' => 'Afram Plains Bed-Net Distribution', 'slug' => 'afram-plains-bed-net-campaign', 'description' => 'Distribution of 5,000 long-lasting insecticidal nets (LLINs) to households in the Afram Plains, targeting children under 5 and pregnant women.', 'long_description' => "The Afram Plains records some of the highest malaria incidence rates in Ghana, driven by proximity to the Volta Lake and limited access to treated bed nets.\n\nIn partnership with the Ghana Health Service, we distributed 5,000 LLINs during a 3-week house-to-house campaign in October 2024. Each net was accompanied by a live demonstration of proper hanging and care. Community health volunteers followed up 4 weeks later to confirm usage.\n\nFollow-up data from the Kwahu Afram Plains North district hospital shows a 27 % drop in under-5 malaria admissions in the quarter following distribution, compared to the same quarter the previous year.", 'location' => 'Afram Plains, Eastern Region', 'status' => 'completed', 'start_date' => '2024-10-01', 'end_date' => '2024-10-21', 'is_featured' => false],
            ['programme' => 'healthcare', 'title' => 'Volta Region CHPS Compound Restocking', 'slug' => 'volta-region-chps-restocking', 'description' => 'Quarterly medicine restocking of 15 Community-Based Health Planning and Services (CHPS) compounds across the Volta Region with essential drugs and first-aid supplies.', 'long_description' => "CHPS compounds are Ghana's frontline health infrastructure — small facilities staffed by community health officers who provide basic curative and preventive care. Many in the Volta Region run out of essential supplies within weeks of government restocking.\n\nOur programme fills the gap with quarterly deliveries of paracetamol, ORS sachets, antimalarials (artemether-lumefantrine), amoxicillin, wound dressings, and rapid diagnostic test kits. We coordinate delivery schedules with the Volta Regional Health Directorate to avoid duplication.\n\nThe programme currently covers 15 CHPS compounds across the Ho, Keta, and South Dayi districts, ensuring roughly 45,000 people have uninterrupted access to basic treatment.", 'location' => 'Ho, Volta Region', 'status' => 'ongoing', 'start_date' => '2023-07-01', 'end_date' => null, 'is_featured' => false],

            // --- Community Development ---
            ['programme' => 'community', 'title' => "Nkoranza Women\u{2019}s Savings Group", 'slug' => 'nkoranza-womens-savings-group', 'description' => 'A village savings-and-loans association (VSLA) for 80 women in the Nkoranza South Municipality, building financial literacy and providing micro-credit for small enterprises.', 'long_description' => "Access to formal banking is almost non-existent in rural Nkoranza. Women who want to start a small trade — selling smoked fish, shea butter, or seasonal vegetables — have no way to raise startup capital beyond borrowing from relatives.\n\nOur VSLA groups operate on a 12-month cycle. Members contribute a weekly savings amount (currently GHS 10–50), and the pooled fund is available for low-interest loans. At the end of each cycle, savings plus interest are shared out. We provide the initial training, record-keeping tools, and a lockbox with three keys held by different members.\n\nThe Nkoranza group completed its second cycle in December 2025, distributing GHS 48,000 among 80 members. Several women have used proceeds to purchase refrigeration units for their fish businesses.", 'location' => 'Nkoranza, Bono East Region', 'status' => 'ongoing', 'start_date' => '2023-01-15', 'end_date' => null, 'is_featured' => false],
            ['programme' => 'community', 'title' => 'Sefwi Wiawso Community Centre', 'slug' => 'sefwi-wiawso-community-centre', 'description' => 'Construction of a multi-purpose community centre in Sefwi Wiawso serving as a meeting hall, adult-literacy classroom, and youth skills-training venue.', 'long_description' => "Sefwi Wiawso's population has grown rapidly, but community infrastructure hasn't kept pace. Public meetings are held in church buildings or under trees, and there is no dedicated space for adult education or youth training.\n\nThe centre is a single-storey building with a 150-seat hall, two classrooms, an office for the community committee, and washroom facilities. Solar panels provide lighting for evening literacy classes. The design was developed with input from the traditional council, the district assembly, and a youth focus group.\n\nConstruction was completed in March 2025. The centre now hosts weekly adult-literacy classes (averaging 45 participants) and monthly skills workshops covering batik-making, beekeeping, and mobile-phone repair.", 'location' => 'Sefwi Wiawso, Western North Region', 'status' => 'completed', 'start_date' => '2024-03-01', 'end_date' => '2025-03-15', 'is_featured' => true],
            ['programme' => 'community', 'title' => 'Navrongo Agricultural Extension Pilot', 'slug' => 'navrongo-agricultural-extension', 'description' => 'Training 50 smallholder farmers in the Kassena-Nankana District on drought-resistant crop varieties, composting techniques, and post-harvest storage to reduce losses.', 'long_description' => "Farming in the Kassena-Nankana District is rain-fed and seasonal. Most farmers grow a single crop of millet or sorghum, and post-harvest losses to weevils and moisture damage can reach 30 %.\n\nOur pilot programme introduces drought-tolerant maize and cowpea varieties developed by the Savanna Agricultural Research Institute (SARI). Participating farmers also learn composting to reduce fertiliser costs, and we provide hermetic storage bags (PICs bags) that protect grain without chemicals.\n\nFifty farmers enrolled in the first season (June 2026). Field days at demonstration plots allow neighbouring farmers to observe results before committing to adopt the practices themselves.", 'location' => 'Navrongo, Upper East Region', 'status' => 'upcoming', 'start_date' => '2026-06-01', 'end_date' => null, 'is_featured' => false],
        ];

        foreach ($projects as $data) {
            $programmeKey = $data['programme'];
            unset($data['programme']);
            $data['programme_id'] = $programmes[$programmeKey]->id;
            $data['photo'] = $this->storageUrl('projects/'.$data['slug'].'.jpg');
            Project::create($data);
        }
    }

    private function seedPosts(User $author): void
    {
        $posts = [
            [
                'title' => 'Clean Water Reaches Bongo: 8 New Boreholes Serving 4,000 People',
                'slug' => 'clean-water-reaches-bongo',
                'excerpt' => 'After nine months of drilling, testing, and community training, the Bongo District Borehole Network is complete — bringing safe water to 8 villages in the Upper East Region.',
                'body' => "When the drill rig arrived in Soe, a small village in the Bongo District, children abandoned their afternoon football match to watch. By the time water surged from the borehole three days later, the entire village had gathered.\n\n\"My daughters used to walk to the river before school,\" says Madam Azara Ayine, a mother of four. \"Now they have time for homework.\"\n\nThe Bongo District Borehole Network is HopeSpring's largest water project to date: 8 mechanised boreholes drilled across 8 villages between March and November 2023. Each borehole is fitted with an Afridev hand pump, a concrete apron, and a drainage channel to prevent pooling.\n\nWater-quality testing confirmed zero E. coli at all 8 sites — a dramatic improvement over the unprotected dugouts and seasonal streams that communities previously relied on.\n\nBut hardware alone isn't enough. In each village, we trained a 5-member WASH committee responsible for maintenance, fee collection (GHS 10 per household per month), and hygiene promotion. These committees are the reason our boreholes are still functioning years after installation, long after other NGO-drilled wells have fallen silent.\n\n\"We budget for spare parts and pay a local pump mechanic on retainer,\" explains Mr. Anaba Thomas, chair of the Soe WASH committee. \"If the pump breaks on Monday, it's fixed by Wednesday. Before, a broken pump meant going back to the river for months.\"\n\nThe project was co-funded by WaterAid and the Bongo District Assembly, with HopeSpring providing project management and community engagement. It cost GHS 1.2 million — roughly GHS 300 per person served.\n\nNext up: we're planning a similar network in the Builsa South District, where communities face identical challenges. If you'd like to contribute, visit our donation page.",
                'category' => 'community',
                'is_featured' => true,
                'published_at' => '2024-01-15 09:00:00',
            ],
            [
                'title' => 'Meet the 38 Girls Who Beat the Odds to Reach Senior High School',
                'slug' => 'yendi-girls-reach-shs',
                'excerpt' => 'The first cohort of the Yendi Girls\' Scholarship Fund has completed JHS. Thirty-eight of them are now enrolled in SHS — 12 with government bursaries we helped them secure.',
                'body' => "In 2019, when we launched the Yendi Girls' Scholarship Fund, the statistics were stark: fewer than 40 % of girls in the municipality who started primary school completed JHS. Early marriage, poverty, and the sheer cost of exercise books and uniforms conspired to pull them out.\n\nSix years later, 38 girls from our first cohort of 45 have enrolled in Senior High School. Twelve of them secured government STEM bursaries — with application support from our field team.\n\n\"I want to be a nurse,\" says Fatima Alhassan, 16, who is now in SHS 1 at Tamale Girls' SHS. \"HopeSpring paid for my books and my mentor, Madam Memuna, convinced my father to let me continue. He wanted me to stay home and help on the farm.\"\n\nThe programme's 94 % retention rate — well above the national average for similar schemes — comes down to three pillars: covering every direct cost (tuition, exams, uniforms, supplies, and a daily meal), assigning each girl a female community mentor, and maintaining open communication with families.\n\nMentors are the secret ingredient. They're local women — teachers, nurses, traders — who visit each girl's home monthly, track attendance through the school register, and step in early when a family considers withdrawal.\n\n\"The families aren't villains,\" says programme coordinator Abiba Mahama. \"They're making rational decisions under impossible pressure. Our job is to change the equation — make keeping a girl in school the rational choice.\"\n\nThe fund currently supports 120 girls across primary and JHS. We're now raising funds to extend support through SHS for the most vulnerable, at roughly GHS 2,500 per girl per year.\n\nEvery donation to Education for All goes directly toward keeping these girls in school. No girl should lose her future to the price of an exercise book.",
                'category' => 'education',
                'is_featured' => false,
                'published_at' => '2025-04-22 10:30:00',
            ],
            [
                'title' => 'Mobile Clinics Cross 9,000 Consultations in the Northern Region',
                'slug' => 'mobile-clinics-9000-consultations',
                'excerpt' => 'Our quarterly mobile health screenings have now reached over 9,000 consultations across 12 communities — identifying 300+ referral cases and 14 obstetric emergencies.',
                'body' => "When Nurse Adizatu Ibrahim steps out of the HopeSpring van in Kparigu, a queue is already forming. Women with babies on their backs, elderly men leaning on walking sticks, teenagers clutching government health-insurance cards — they've been waiting since dawn.\n\n\"Some of them walk two hours to get here,\" says Adizatu. \"If we didn't come to them, most would never see a health worker at all.\"\n\nHopeSpring's mobile health clinics have operated quarterly in 12 Northern Region communities since 2020. Each visit deploys a team of two nurses, a midwife, and a community health officer with a mobile pharmacy stocked with antimalarials, ORS sachets, paracetamol, and wound-care supplies.\n\nServices include malaria rapid-diagnostic testing, blood-pressure screening, antenatal consultations, childhood immunisations, and health-education talks. Over five years, the programme has logged more than 9,000 consultations.\n\nBut the numbers that matter most are the referrals: more than 300 cases identified as needing hospital-level care, including 14 obstetric emergencies — placenta praevia, eclampsia, obstructed labour — that might have gone undetected without our screenings.\n\n\"Every referral that reaches the hospital in time is a life saved,\" says Dr. Issahaku Tahiru, medical superintendent at Tamale Teaching Hospital, which receives our referrals. \"The mobile clinics act as an early-warning system for the formal health system.\"\n\nThe programme costs roughly GHS 800 per community per visit. If you'd like to sponsor a screening round, visit our donate page or contact our healthcare team.",
                'category' => 'healthcare',
                'is_featured' => false,
                'published_at' => '2025-06-10 08:00:00',
            ],
            [
                'title' => 'Sefwi Wiawso Community Centre Opens Its Doors',
                'slug' => 'sefwi-wiawso-centre-opens',
                'excerpt' => 'A year in the making, the new community centre in Sefwi Wiawso is now hosting adult-literacy classes, youth skills workshops, and community meetings.',
                'body' => "On a Saturday morning in March, Nana Kwadwo Agyei III, paramount chief of the Sefwi Wiawso Traditional Area, cut a red ribbon and declared the new community centre open. Behind him, 150 plastic chairs were already arranged for the inaugural meeting of the town's development committee.\n\n\"This building belongs to the people,\" the chief said. \"Use it well.\"\n\nThe centre — a single-storey sandcrete block with a 150-seat hall, two classrooms, an office, and washroom facilities — took 12 months to build. Solar panels on the roof provide lighting for evening programmes, and a rainwater harvesting tank supplies the washrooms.\n\nDesign input came from three sources: the traditional council, the Sefwi Wiawso Municipal Assembly, and a focus group of 20 young people aged 16–25. The youth group lobbied successfully for a skills-training room with workbenches and power outlets.\n\n\"We asked what they'd actually use it for,\" says HopeSpring project manager Yaa Serwaa. \"Batik-making, beekeeping, phone repair — practical things they can turn into income.\"\n\nThree months after opening, the centre hosts weekly adult-literacy classes (averaging 45 participants, mostly women over 40), monthly skills workshops, and fortnightly community-committee meetings. The district assembly uses it for voter registration and public consultations.\n\nThe total project cost was GHS 380,000, co-funded by HopeSpring, the MTN Ghana Foundation, and the municipal assembly. Maintenance is covered by a small hall-rental fee for private events — weddings, naming ceremonies, church meetings — ensuring long-term sustainability without ongoing donor funding.",
                'category' => 'community',
                'is_featured' => false,
                'published_at' => '2025-03-28 11:00:00',
            ],
            [
                'title' => 'Bed-Net Campaign Cuts Under-5 Malaria Admissions by 27 %',
                'slug' => 'bed-net-campaign-results',
                'excerpt' => 'Follow-up data from the Afram Plains shows a significant drop in malaria hospitalisations among young children after our October 2024 net distribution.',
                'body' => "Five thousand bed nets. Three weeks. One clear result: a 27 % reduction in under-5 malaria admissions at the Kwahu Afram Plains North district hospital in the quarter following distribution, compared to the same quarter the previous year.\n\nThe campaign, run in partnership with the Ghana Health Service, distributed long-lasting insecticidal nets (LLINs) door-to-door across the Afram Plains in October 2024. Priority went to households with children under 5 and pregnant women — the groups most vulnerable to severe malaria.\n\n\"We didn't just hand out nets,\" says field coordinator Mercy Owusu. \"At every house, we demonstrated how to hang the net properly, how to tuck the edges under the mattress, and how to wash it without destroying the insecticide treatment. A net that sits folded in a corner saves no one.\"\n\nFour weeks after distribution, community health volunteers visited every household to confirm the nets were in use. Compliance was 89 % — significantly higher than the national average for mass distribution campaigns, which hovers around 65 %.\n\nThe difference, Mercy believes, is the follow-up. \"When someone you know from the community comes back and asks to see the net hanging, you hang it.\"\n\nMalaria remains Ghana's leading cause of outpatient visits and the number-one killer of children under 5. Insecticidal bed nets are the single most cost-effective intervention — but only if they're used correctly and consistently.\n\nWe're now planning a second round for the 2025 rainy season, expanding to cover an additional 3,000 households in the Afram Plains South district.",
                'category' => 'healthcare',
                'is_featured' => false,
                'published_at' => '2025-02-14 09:00:00',
            ],
            [
                'title' => 'Women of Nkoranza Share Out GHS 48,000 After Second Savings Cycle',
                'slug' => 'nkoranza-savings-group-payout',
                'excerpt' => 'Eighty women in the Nkoranza South Municipality completed their second VSLA cycle in December, sharing GHS 48,000 — and several are reinvesting in cold-chain fish businesses.',
                'body' => "When the metal lockbox was opened at the Nkoranza community centre in December 2025, cheers erupted. Eighty women who had saved between GHS 10 and GHS 50 each week for a year were about to share out GHS 48,000 — their second annual payout from HopeSpring's village savings-and-loans programme.\n\nFor Madam Akosua Boateng, a fish trader, the timing was perfect. \"I've been smoking fish over an open fire and selling at the roadside,\" she says. \"With this money, I'm buying a chest freezer. Frozen fish fetches a better price and doesn't spoil on slow days.\"\n\nShe's not alone. Three other women in the group are pooling their payouts to purchase a second-hand refrigerated van — a move that could transform their small-scale trade into a proper supply chain connecting the Volta Lake fishing communities to Kumasi's central market.\n\nThe VSLA model is simple: members buy shares weekly, the pooled capital is loaned to members at a modest interest rate (typically 5–10 % per cycle), and at the end of the year, everyone gets their savings back plus a share of the interest earned. HopeSpring provides the initial training, record-keeping templates, and a lockbox with three keys held by different committee members.\n\n\"The three-key system is critical,\" says programme officer Kwabena Asare. \"No single person can open the box alone. It builds trust — and trust is the foundation of the whole model.\"\n\nThe Nkoranza group is now enrolling for Cycle 3. We're also replicating the model in two new communities: Atebubu and Techiman, both in the Bono East Region.",
                'category' => 'community',
                'is_featured' => false,
                'published_at' => '2026-01-08 10:00:00',
            ],
            [
                'title' => 'New Classroom Block Replaces Mud-Brick Ruin at Assin Fosu Primary',
                'slug' => 'assin-fosu-classroom-block-handover',
                'excerpt' => 'The 6-classroom block at Assin Fosu D/A Primary is complete — replacing a crumbling 1980s structure where classes were held under trees.',
                'body' => "For the better part of a decade, pupils at Assin Fosu D/A Primary School attended class under mango trees. The original mud-brick building, constructed in the late 1980s, had lost three of its four roofing sheets, and the remaining walls were cracked and leaning.\n\n\"When it rained, we sent the children home,\" says headteacher Mr. Emmanuel Appiah. \"On some weeks, we lost two or three days. How do you finish a syllabus like that?\"\n\nThe new block — six classrooms, sandcrete walls, aluminium roofing, louvre-blade windows, and a concrete floor — was handed over in August 2022 after seven months of construction. Dual-desk furniture seats 240 pupils. One classroom doubles as a library, stocked with 600 donated books ranging from early readers to JHS-level science texts.\n\nThe building also features an accessible ramp and wider doorways — a first for the school, which has three pupils with mobility impairments.\n\nFunding came from HopeSpring and the Central Regional Education Directorate. The Ghana Education Service contributed staffing, deploying two additional teachers to handle the expanded capacity.\n\n\"Enrolment has jumped from 180 to 310 since the building opened,\" Mr. Appiah reports. \"Parents from neighbouring villages are sending their children here because we have a proper structure and a library.\"\n\nThe school's PTA has taken on maintenance responsibility, collecting a small annual levy for painting, gutter clearing, and furniture repair — ensuring the building serves this community for decades.",
                'category' => 'education',
                'is_featured' => false,
                'published_at' => '2022-09-05 08:30:00',
            ],
            [
                'title' => 'Tamale Water Scheme Delivers First Standpipe to Changli Community',
                'slug' => 'tamale-water-changli-standpipe',
                'excerpt' => 'The first of three community standpipes in the Tamale Peri-Urban Water Scheme is now operational — serving 1,200 residents in Changli.',
                'body' => "Water flowed through the Changli standpipe for the first time on a Tuesday afternoon in February. Within an hour, a line of yellow jerry cans stretched back 30 metres.\n\n\"We've been using a hand-dug well that dries up in March every year,\" says Mr. Alhassan Bukari, assemblyman for the Changli electoral area. \"This water comes from the Ghana Water Company main line. It's treated. It's reliable. It changes everything.\"\n\nThe Changli standpipe is the first of three planned under HopeSpring's Tamale Peri-Urban Water Scheme, which lays 6.2 km of HDPE pipe from the Ghana Water Company trunk line to communities on the city's expanding fringe.\n\nA prepaid token system — similar to prepaid electricity — keeps the service affordable. Residents purchase tokens from a local vendor for GHS 0.20 per 20-litre bucket. Revenue covers pipe maintenance, valve replacements, and a small contribution to the water board's operations fund.\n\n\"The token system is fairer than a flat monthly fee,\" explains project engineer Salifu Abdulai. \"Families pay for what they use. And because revenue is tied to volume, the water board has a direct incentive to keep the system running.\"\n\nConstruction of standpipes two and three — in Gbalahi and Lamashegu Suburb — is expected to complete by October 2025. Together, the three standpipes will serve approximately 3,600 people.\n\nThe scheme is co-funded by HopeSpring and the Tamale Metropolitan Assembly, with technical support from the Community Water and Sanitation Agency.",
                'category' => 'community',
                'is_featured' => false,
                'published_at' => '2025-03-04 07:30:00',
            ],
            [
                'title' => 'Teacher Training Pilot Launches in Upper West: 30 Educators, 12 Months',
                'slug' => 'upper-west-teacher-training-launch',
                'excerpt' => 'Thirty rural teachers in the Upper West Region are now paired with mentors from the University of Education, Winneba in a 12-month coaching programme.',
                'body' => "Mr. Abdul-Razak Issahaku teaches primary 4 at a two-room school in Jirapa. He graduated from Wa College of Education 18 months ago and was posted here alone — the school's only trained teacher.\n\n\"I teach six subjects across two classes,\" he says. \"I've never had anyone observe a lesson or give me feedback. I'm learning by trial and error.\"\n\nAbdul-Razak is one of 30 rural teachers enrolled in HopeSpring's new Upper West Teacher Training Programme, a 12-month mentorship initiative pairing early-career educators with experienced trainers from the University of Education, Winneba.\n\nMentors visit each teacher once per term for a full day of lesson observation, co-teaching, and feedback. Between visits, a WhatsApp peer-learning group allows the cohort to share lesson plans, ask questions, and troubleshoot classroom challenges.\n\nEach participant also receives a resource kit: lesson-plan templates aligned to the new national curriculum, manipulatives for teaching fractions and geometry, reading-level assessment cards, and a set of graded readers.\n\n\"The kit matters because these schools have almost nothing,\" says programme lead Dr. Grace Agyeman. \"A teacher who has to teach fractions with no objects to count will default to chalk-and-talk. Give them bottle caps and a counting frame and the lesson changes completely.\"\n\nEarly results are encouraging. School-level attendance data shows a measurable uptick in pupil attendance at participating schools — suggesting that more engaging lessons are keeping children in the classroom.\n\nThe programme costs GHS 3,200 per teacher per year. We're seeking funding to expand to 60 teachers in the 2026 academic year.",
                'category' => 'education',
                'is_featured' => false,
                'published_at' => '2025-02-01 09:00:00',
            ],
            // Draft posts
            [
                'title' => 'Rainy-Season Water Harvesting: What We Learned from the Keta Pilot',
                'slug' => 'keta-rainwater-harvesting-lessons',
                'excerpt' => 'As we prepare for the September 2026 launch of our Keta Lagoon Rainwater Harvesting project, here are the design decisions and trade-offs behind our approach.',
                'body' => "Keta sits on a narrow sand bar between the Atlantic and the Keta Lagoon. Groundwater is too saline to drink. Piped water from the Keta Water Supply System reaches only a fraction of the population. For most residents, rain is the only reliable freshwater source — but without storage, it runs off into the lagoon within hours.\n\nOur project installs 10,000-litre ferro-cement rainwater tanks at 8 schools and 4 CHPS compounds. This article explains the technical decisions behind the design.\n\nWhy ferro-cement? Polyethylene tanks are cheaper upfront, but they degrade in UV-heavy coastal environments within 5–8 years. Ferro-cement, built with local sand, cement, and wire mesh, lasts 20+ years with minimal maintenance and can be repaired by a local mason.\n\nWhy first-flush diverters? The first 20 litres of rain washing off a roof carries bird droppings, dust, and debris. Our diverter captures and discards this initial flow before water enters the tank, dramatically improving quality.\n\nWhy slow sand filters at the tap? Even clean roof-harvested rainwater can harbour bacterial contamination from insects entering the tank. A simple slow sand filter at the outlet provides a biological treatment layer — no chemicals, no electricity, no moving parts.\n\nWe launch in September to catch the major rainy season. Tanks should be full by November, providing water through the December–March dry spell.\n\n[DRAFT — pending field photos and final costings from the procurement team]",
                'category' => 'community',
                'is_featured' => false,
                'published_at' => null,
            ],
            [
                'title' => 'Navrongo Farmers Prepare for Drought-Resistant Crop Trials',
                'slug' => 'navrongo-farmers-crop-trials',
                'excerpt' => 'Fifty smallholder farmers in the Kassena-Nankana District are gearing up for the June 2026 planting season with new drought-tolerant maize and cowpea varieties.',
                'body' => "The rains in the Kassena-Nankana District are becoming less predictable. Farmers who once planted by the calendar now watch the sky and hope.\n\n\"Last year the rains came three weeks late,\" says Mr. Ayamga Azongo, a farmer with two acres near Navrongo. \"Half my millet withered before it could set seed.\"\n\nOur new agricultural extension pilot introduces drought-tolerant varieties — specifically, Obatanpa maize and Zaayura cowpea, both developed by the Savanna Agricultural Research Institute (SARI) for the Upper East's erratic rainfall.\n\nFifty farmers have enrolled for the June 2026 season. Each receives certified seed, composting training to reduce dependency on expensive chemical fertiliser, and 10 hermetic storage bags (PICs bags) to protect harvested grain from weevils.\n\nDemo plots at the SARI substation in Manga will let neighbouring farmers see the varieties' performance before committing.\n\n[DRAFT — awaiting seed procurement confirmation and SARI collaboration MOU]",
                'category' => 'relief',
                'is_featured' => false,
                'published_at' => null,
            ],
        ];

        foreach ($posts as $data) {
            $data['author_id'] = $author->id;
            $data['featured_image'] = $this->storageUrl('posts/'.$data['slug'].'.jpg');
            Post::create($data);
        }
    }

    private function seedTeamMembers(): void
    {
        $members = [
            // Leadership
            ['name' => 'Kwame Asante', 'photo' => 'team/kwame-asante.jpg', 'role' => 'Founder & Executive Director', 'type' => 'leadership', 'sort_order' => 1, 'bio' => 'Kwame founded HopeSpring in 2015 after a field visit to the Upper East Region where he saw children drinking from the same muddy dam as cattle. A graduate of the University of Ghana (Political Science) with an MPA from GIMPA, he spent 8 years at ActionAid Ghana before launching the foundation. He leads strategy, fundraising, and stakeholder relations.', 'email' => 'kwame@hopespringfoundation.org'],
            ['name' => 'Ama Mensah', 'photo' => 'team/ama-mensah.jpg', 'role' => 'Deputy Director & Head of Operations', 'type' => 'leadership', 'sort_order' => 2, 'bio' => 'Ama oversees day-to-day operations, HR, and compliance. She joined HopeSpring in 2017 from World Vision Ghana, where she managed a GHS 12 million education portfolio across 3 regions. She holds an MBA from the University of Cape Coast and is a certified project management professional (PMP).', 'email' => 'ama@hopespringfoundation.org'],
            ['name' => 'Kofi Darko', 'photo' => 'team/kofi-darko.jpg', 'role' => 'Head of Programmes', 'type' => 'leadership', 'sort_order' => 3, 'bio' => 'Kofi manages all four programme areas and coordinates field teams across the country. Before HopeSpring, he worked with WaterAid Ghana for 6 years, specialising in rural WASH infrastructure. He holds a BSc in Development Planning from KNUST and an MSc in Water and Environmental Management from Cranfield University, UK.', 'email' => 'kofi@hopespringfoundation.org'],

            // Staff
            ['name' => 'Abiba Mahama', 'photo' => 'team/abiba-mahama.jpg', 'role' => 'Education Programme Coordinator', 'type' => 'staff', 'sort_order' => 4, 'bio' => 'Abiba coordinates the Yendi Girls\' Scholarship Fund and the teacher training programme. A former JHS teacher from Tamale, she holds a B.Ed from the University of Education, Winneba and has 7 years of experience in girls\' education advocacy.', 'email' => 'abiba@hopespringfoundation.org'],
            ['name' => 'Salifu Abdulai', 'photo' => 'team/salifu-abdulai.jpg', 'role' => 'Water & Sanitation Engineer', 'type' => 'staff', 'sort_order' => 5, 'bio' => 'Salifu leads the technical design and supervision of all water projects. A civil engineer from KNUST with 5 years of field experience, he has overseen the drilling and commissioning of over 30 boreholes across northern Ghana.', 'email' => 'salifu@hopespringfoundation.org'],
            ['name' => 'Mercy Owusu', 'photo' => 'team/mercy-owusu.jpg', 'role' => 'Healthcare Field Coordinator', 'type' => 'staff', 'sort_order' => 6, 'bio' => 'Mercy manages the mobile health clinics and the bed-net distribution programme. A registered community health nurse with 10 years of field experience, she previously worked with the Ghana Health Service in the Afram Plains district.', 'email' => 'mercy@hopespringfoundation.org'],
            ['name' => 'Yaa Serwaa', 'photo' => 'team/yaa-serwaa.jpg', 'role' => 'Community Development Manager', 'type' => 'staff', 'sort_order' => 7, 'bio' => 'Yaa manages the VSLA groups and community-centre projects. She holds an MA in Social Enterprise from the University of Ghana Business School and spent 4 years with CARE International Ghana before joining HopeSpring.', 'email' => 'yaa@hopespringfoundation.org'],
            ['name' => 'Emmanuel Tetteh', 'photo' => 'team/emmanuel-tetteh.jpg', 'role' => 'Communications & Fundraising Officer', 'type' => 'staff', 'sort_order' => 8, 'bio' => 'Emmanuel handles donor communications, social media, the website, and grant writing. A journalism graduate from the Ghana Institute of Journalism, he previously worked at Citi FM and brings storytelling skills honed in broadcast media to the development sector.', 'email' => 'emmanuel@hopespringfoundation.org'],

            // Board
            ['name' => 'Prof. Naana Agyemang', 'photo' => 'team/naana-agyemang.jpg', 'role' => 'Board Chair', 'type' => 'board', 'sort_order' => 9, 'bio' => 'Professor of Public Health at the University of Ghana School of Public Health. She brings 25 years of research experience in rural health systems and has advised the Ministry of Health on community-based healthcare delivery.', 'linkedin' => 'https://linkedin.com/in/naana-agyemang'],
            ['name' => 'Mr. Samuel Quartey', 'photo' => 'team/samuel-quartey.jpg', 'role' => 'Board Treasurer', 'type' => 'board', 'sort_order' => 10, 'bio' => 'Chartered accountant and partner at Quartey & Associates. He provides pro-bono financial oversight and audit support. Previously CFO at Ecobank Ghana, he chairs HopeSpring\'s finance and audit sub-committee.', 'linkedin' => 'https://linkedin.com/in/samuel-quartey'],
            ['name' => 'Dr. Patience Abena Boateng', 'photo' => 'team/patience-boateng.jpg', 'role' => 'Board Member', 'type' => 'board', 'sort_order' => 11, 'bio' => 'Paediatrician at Korle-Bu Teaching Hospital with a special interest in child nutrition. She advises HopeSpring\'s healthcare programme and helped design the mobile clinic service model.', 'linkedin' => 'https://linkedin.com/in/patience-boateng'],
            ['name' => 'Nana Kwadwo Agyei III', 'photo' => 'team/nana-kwadwo-agyei.jpg', 'role' => 'Board Member', 'type' => 'board', 'sort_order' => 12, 'bio' => 'Paramount Chief of the Sefwi Wiawso Traditional Area. He serves as HopeSpring\'s liaison to traditional authorities and advocates for community ownership of development projects. His support was instrumental in the Sefwi Wiawso Community Centre project.'],
        ];

        foreach ($members as $member) {
            $member['photo'] = $this->storageUrl($member['photo']);
            TeamMember::create($member);
        }
    }

    private function seedGalleryImages(): void
    {
        $images = [
            ['alt' => 'Children collecting water from a new borehole in Bongo District', 'caption' => 'First water from the Soe borehole, March 2023', 'category' => 'water'],
            ['alt' => 'WASH committee members learning pump maintenance', 'caption' => 'WASH committee training at Bongo', 'category' => 'water'],
            ['alt' => 'Water quality testing at a newly drilled borehole', 'caption' => 'E. coli testing confirms safe water', 'category' => 'water'],
            ['alt' => 'Changli community standpipe with residents queuing for water', 'caption' => 'Changli standpipe inauguration, February 2025', 'category' => 'water'],
            ['alt' => 'Girls in school uniforms studying in the Yendi scholarship programme', 'caption' => 'Yendi scholarship recipients during exam preparation', 'category' => 'education'],
            ['alt' => 'New classroom block at Assin Fosu D/A Primary School', 'caption' => 'Completed 6-classroom block at Assin Fosu', 'category' => 'education'],
            ['alt' => 'Children reading in the Assin Fosu school library', 'caption' => 'Library corner stocked with 600 books', 'category' => 'education'],
            ['alt' => 'Rural teacher receiving a teaching resource kit', 'caption' => 'Upper West teacher training kick-off', 'category' => 'education'],
            ['alt' => 'Mobile clinic nurse checking blood pressure in a village', 'caption' => 'Blood-pressure screening in Kparigu', 'category' => 'healthcare'],
            ['alt' => 'Community health volunteer demonstrating bed-net hanging', 'caption' => 'Bed-net demonstration in the Afram Plains', 'category' => 'healthcare'],
            ['alt' => 'Mothers and babies at a mobile immunisation clinic', 'caption' => 'Childhood immunisations in Tolon', 'category' => 'healthcare'],
            ['alt' => 'Women counting savings at the Nkoranza VSLA meeting', 'caption' => 'End-of-cycle share-out at Nkoranza, December 2025', 'category' => 'community'],
            ['alt' => 'Sefwi Wiawso Community Centre ribbon-cutting ceremony', 'caption' => 'Nana Agyei III opens the new community centre', 'category' => 'community'],
            ['alt' => 'Adult literacy class in session at the community centre', 'caption' => 'Evening literacy class, Sefwi Wiawso', 'category' => 'community'],
            ['alt' => 'HopeSpring team at the 2025 annual stakeholder meeting', 'caption' => 'Annual stakeholder meeting, Accra, January 2025', 'category' => 'events'],
            ['alt' => 'Volunteers sorting school supplies for distribution', 'caption' => 'Back-to-school supply packing day', 'category' => 'events'],
        ];

        foreach ($images as $i => $img) {
            GalleryImage::create([
                'src' => $this->storageUrl('gallery/'.str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT).'.jpg'),
                'alt' => $img['alt'],
                'caption' => $img['caption'],
                'category' => $img['category'],
                'sort_order' => $i + 1,
            ]);
        }
    }

    private function seedEvents(): void
    {
        $events = [
            // Upcoming
            [
                'title' => '2026 Annual Fundraising Gala — "Water is Life"',
                'slug' => '2026-annual-fundraising-gala',
                'description' => 'Our flagship fundraising event returns with a focus on the Clean Water Initiative. Join us for an evening of live music, a silent auction, and inspiring stories from the communities we serve.',
                'long_description' => "The 2026 Gala brings together donors, partners, corporate sponsors, and friends of HopeSpring for an evening dedicated to our Clean Water Initiative.\n\nHighlights include a keynote address by WaterAid's West Africa director, a short documentary screening featuring the Bongo District borehole project, live highlife music by the Accra Orchestra, and a silent auction with items donated by local artists and businesses.\n\nAll proceeds go directly to the Keta Lagoon Rainwater Harvesting project. Last year's gala raised GHS 185,000 — enough to fund two complete borehole installations.\n\nDress code: smart casual (African print encouraged). Tickets: GHS 200 (individual), GHS 1,500 (table of 8).",
                'location' => 'Kempinski Hotel Gold Coast City, Accra',
                'starts_at' => '2026-11-15 18:30:00',
                'ends_at' => '2026-11-15 22:30:00',
                'is_featured' => true,
            ],
            [
                'title' => 'Community Health Screening — Tamale Cluster',
                'slug' => 'tamale-health-screening-q4-2026',
                'description' => 'Quarterly mobile health clinic visiting 4 communities in the Tamale metropolitan area. Free malaria testing, blood-pressure checks, maternal consultations, and immunisations.',
                'long_description' => "This is the fourth-quarter 2026 round of our Northern Region mobile health screening programme. The Tamale cluster covers Kparigu, Tolon, Nyankpala, and Savelugu.\n\nServices provided:\n— Malaria rapid diagnostic testing\n— Blood-pressure screening\n— Antenatal and postnatal consultations\n— Childhood immunisations (Penta, OPV, measles)\n— Health education talk: nutrition during pregnancy\n\nNo appointment needed. Bring your national health insurance card if you have one.",
                'location' => 'Kparigu Community Centre, Tamale',
                'starts_at' => '2026-10-05 07:00:00',
                'ends_at' => '2026-10-07 16:00:00',
                'is_featured' => false,
            ],
            [
                'title' => 'Back-to-School Supply Drive 2026',
                'slug' => 'back-to-school-supply-drive-2026',
                'description' => 'Help us pack and distribute school supplies for 500 children in the Northern and Upper East regions before the September term begins.',
                'long_description' => "Every September, our volunteer team gathers to sort and pack school supplies for children in our scholarship and community programmes.\n\nThis year we need: exercise books (200-page), pens, pencils, erasers, rulers, mathematical sets, and school bags. We also accept gently used uniforms.\n\nVolunteers can join the packing day at our Accra office on Saturday 23 August, or donate supplies and funds via our website. Distribution happens during the last week of August across Yendi, Bongo, and Bolgatanga.",
                'location' => 'HopeSpring Foundation Office, East Legon, Accra',
                'starts_at' => '2026-08-23 09:00:00',
                'ends_at' => '2026-08-23 15:00:00',
                'is_featured' => false,
            ],

            // Past
            [
                'title' => '2025 Annual Stakeholder Meeting',
                'slug' => '2025-stakeholder-meeting',
                'description' => 'Annual review of programme performance, financial reports, and strategic priorities for 2025–2027 with board members, partners, and key donors.',
                'long_description' => "The 2025 stakeholder meeting brought together 85 attendees — board members, district assembly representatives, partner NGOs, and individual donors — for a full-day review of HopeSpring's work.\n\nKey agenda items:\n— Programme performance report (all 4 programme areas)\n— Audited financial statements for FY 2024\n— Presentation of the 2025–2027 strategic plan\n— Partner spotlight: WaterAid and Ghana Health Service\n— Q&A session with field staff from the Northern Region\n\nThe meeting approved the strategic plan unanimously and endorsed the expansion of the teacher training programme to 60 participants.",
                'location' => 'La Palm Royal Beach Hotel, Accra',
                'starts_at' => '2025-01-25 09:00:00',
                'ends_at' => '2025-01-25 16:00:00',
                'is_featured' => false,
            ],
            [
                'title' => 'International World Water Day Commemoration',
                'slug' => 'world-water-day-2025',
                'description' => 'HopeSpring joined global celebrations for World Water Day with a public forum on rural water access in Ghana and a community borehole commissioning in Bolgatanga.',
                'long_description' => "World Water Day — 22 March — is an annual reminder of the 2.2 billion people globally who lack safe drinking water. HopeSpring marked the day with two activities:\n\n1. A public forum at the University of Ghana featuring a panel discussion on \"Closing the Rural Water Gap in Ghana\" with representatives from WaterAid, the Community Water and Sanitation Agency, and the Ministry of Sanitation and Water Resources.\n\n2. The commissioning of a new borehole in Zuarungu, near Bolgatanga, timed to coincide with the day. The Zuarungu borehole serves 350 residents and was drilled as part of an extension to the Bongo District network.",
                'location' => 'University of Ghana, Legon & Zuarungu, Bolgatanga',
                'starts_at' => '2025-03-22 08:00:00',
                'ends_at' => '2025-03-22 17:00:00',
                'is_featured' => false,
            ],
            [
                'title' => '2024 Fundraising Gala — "Every Child Deserves a Classroom"',
                'slug' => '2024-fundraising-gala',
                'description' => 'Our annual gala raised GHS 185,000 for the Education for All programme, funding classroom construction and scholarships.',
                'long_description' => "The 2024 gala attracted 220 guests to the Kempinski Hotel for an evening celebrating our education work. Highlights included:\n\n— A video message from Fatima Alhassan, one of our Yendi scholarship recipients now in SHS\n— A keynote by the Director-General of the Ghana Education Service\n— A silent auction that raised GHS 42,000\n— Live music by Amakye Dede\n\nTotal funds raised: GHS 185,000, allocated to the Assin Fosu classroom block completion, the Yendi Girls' Scholarship Fund, and the Upper West teacher training pilot.",
                'location' => 'Kempinski Hotel Gold Coast City, Accra',
                'starts_at' => '2024-11-16 18:30:00',
                'ends_at' => '2024-11-16 22:30:00',
                'is_featured' => false,
            ],
            [
                'title' => 'Sefwi Wiawso Community Centre Grand Opening',
                'slug' => 'sefwi-wiawso-centre-opening',
                'description' => 'Nana Kwadwo Agyei III officially opened the new multi-purpose community centre, marking the completion of a 12-month construction project.',
                'long_description' => "The grand opening drew over 300 community members, district officials, and HopeSpring staff to celebrate the completion of the Sefwi Wiawso Community Centre.\n\nThe ceremony featured:\n— A ribbon-cutting by Nana Kwadwo Agyei III, Paramount Chief\n— Speeches by the Municipal Chief Executive and HopeSpring's Executive Director\n— A cultural performance by the Sefwi Youth Cultural Troupe\n— The first community meeting held in the new 150-seat hall\n\nThe centre now hosts weekly adult-literacy classes, monthly skills workshops, and regular community-committee meetings. MTN Ghana Foundation co-funded the construction.",
                'location' => 'Sefwi Wiawso, Western North Region',
                'starts_at' => '2025-03-15 10:00:00',
                'ends_at' => '2025-03-15 14:00:00',
                'is_featured' => false,
            ],
        ];

        foreach ($events as $data) {
            $data['photo'] = $this->storageUrl('events/'.$data['slug'].'.jpg');
            Event::create($data);
        }
    }

    private function seedDonations(): void
    {
        $donors = [
            ['name' => 'Akosua Boateng', 'email' => 'akosua.boateng@gmail.com', 'phone' => '+233 24 456 7890'],
            ['name' => 'Michael Owusu', 'email' => 'michael.owusu@yahoo.com', 'phone' => '+233 20 123 4567'],
            ['name' => 'Esi Amoah', 'email' => 'esi.amoah@gmail.com', 'phone' => '+233 27 890 1234'],
            ['name' => 'Nana Yaw Mensah', 'email' => 'nana.mensah@outlook.com', 'phone' => '+233 55 234 5678'],
            ['name' => 'Abena Frimpong', 'email' => 'abena.frimpong@gmail.com', 'phone' => '+233 24 567 8901'],
            ['name' => 'Kweku Appiah', 'email' => 'kweku.appiah@hotmail.com', 'phone' => '+233 20 345 6789'],
            ['name' => 'Gifty Asare', 'email' => 'gifty.asare@gmail.com', 'phone' => '+233 26 789 0123'],
            ['name' => 'Samuel Osei', 'email' => 'samuel.osei@gmail.com', 'phone' => '+233 54 012 3456'],
            ['name' => 'Comfort Adjei', 'email' => 'comfort.adjei@yahoo.com', 'phone' => '+233 24 234 5678'],
            ['name' => 'Ibrahim Yakubu', 'email' => 'ibrahim.yakubu@gmail.com', 'phone' => '+233 20 678 9012'],
            ['name' => 'Felicia Mensah', 'email' => 'felicia.mensah@gmail.com', 'phone' => '+233 27 456 7890'],
            ['name' => 'Joseph Tetteh', 'email' => 'joseph.tetteh@gmail.com', 'phone' => '+233 55 890 1234'],
        ];

        $donations = [
            // Repeat donors — tells a story of engagement
            ['donor' => 0, 'amount' => 500, 'programme' => 'Clean Water Initiative', 'method' => 'momo', 'message' => 'For the Bongo borehole project. Keep up the good work!', 'status' => 'success', 'created_days_ago' => 450],
            ['donor' => 0, 'amount' => 1000, 'programme' => 'Clean Water Initiative', 'method' => 'momo', 'message' => 'Second donation this year — water is everything.', 'status' => 'success', 'created_days_ago' => 280],
            ['donor' => 0, 'amount' => 2500, 'programme' => null, 'method' => 'card', 'message' => 'Annual gala pledge', 'status' => 'success', 'created_days_ago' => 60],
            ['donor' => 1, 'amount' => 200, 'programme' => 'Education for All', 'method' => 'card', 'message' => null, 'status' => 'success', 'created_days_ago' => 365],
            ['donor' => 1, 'amount' => 200, 'programme' => 'Education for All', 'method' => 'card', 'message' => 'Monthly contribution', 'status' => 'success', 'created_days_ago' => 335],
            ['donor' => 1, 'amount' => 200, 'programme' => 'Education for All', 'method' => 'card', 'message' => 'Monthly contribution', 'status' => 'success', 'created_days_ago' => 305, 'is_recurring' => true],
            ['donor' => 2, 'amount' => 100, 'programme' => 'Healthcare Outreach', 'method' => 'momo', 'message' => null, 'status' => 'success', 'created_days_ago' => 200],
            ['donor' => 3, 'amount' => 5000, 'programme' => null, 'method' => 'card', 'message' => 'From the Mensah Family Foundation. God bless your work.', 'status' => 'success', 'created_days_ago' => 150, 'is_anonymous' => false],
            ['donor' => 4, 'amount' => 100, 'programme' => 'Education for All', 'method' => 'momo', 'message' => 'For the girls\' scholarship fund', 'status' => 'success', 'created_days_ago' => 120],
            ['donor' => 5, 'amount' => 50, 'programme' => null, 'method' => 'momo', 'message' => null, 'status' => 'success', 'created_days_ago' => 95],
            ['donor' => 6, 'amount' => 200, 'programme' => 'Community Development', 'method' => 'card', 'message' => 'For the women\'s savings programme', 'status' => 'success', 'created_days_ago' => 88],
            ['donor' => 7, 'amount' => 500, 'programme' => 'Clean Water Initiative', 'method' => 'card', 'message' => null, 'status' => 'success', 'created_days_ago' => 75],
            ['donor' => 8, 'amount' => 1000, 'programme' => null, 'method' => 'card', 'message' => 'In memory of my late mother, who always believed in education.', 'status' => 'success', 'created_days_ago' => 60],
            ['donor' => 9, 'amount' => 100, 'programme' => 'Healthcare Outreach', 'method' => 'momo', 'message' => 'For the mobile clinics', 'status' => 'success', 'created_days_ago' => 45],
            ['donor' => 10, 'amount' => 50, 'programme' => null, 'method' => 'momo', 'message' => null, 'status' => 'success', 'created_days_ago' => 30],
            ['donor' => 11, 'amount' => 2500, 'programme' => 'Education for All', 'method' => 'card', 'message' => 'Sponsor one girl through SHS for a year', 'status' => 'success', 'created_days_ago' => 25],
            ['donor' => 5, 'amount' => 100, 'programme' => 'Clean Water Initiative', 'method' => 'momo', 'message' => null, 'status' => 'success', 'created_days_ago' => 20],
            ['donor' => 2, 'amount' => 200, 'programme' => 'Healthcare Outreach', 'method' => 'momo', 'message' => 'For the bed-net campaign', 'status' => 'success', 'created_days_ago' => 18],
            ['donor' => 4, 'amount' => 500, 'programme' => null, 'method' => 'card', 'message' => null, 'status' => 'success', 'created_days_ago' => 12],
            // Anonymous donations
            ['donor' => 6, 'amount' => 1000, 'programme' => null, 'method' => 'card', 'message' => null, 'status' => 'success', 'created_days_ago' => 10, 'is_anonymous' => true],
            ['donor' => 3, 'amount' => 500, 'programme' => 'Community Development', 'method' => 'card', 'message' => null, 'status' => 'success', 'created_days_ago' => 5, 'is_anonymous' => true],
            // Recent small donations
            ['donor' => 10, 'amount' => 50, 'programme' => null, 'method' => 'momo', 'message' => null, 'status' => 'success', 'created_days_ago' => 3],
            ['donor' => 9, 'amount' => 200, 'programme' => 'Education for All', 'method' => 'momo', 'message' => 'For exercise books', 'status' => 'success', 'created_days_ago' => 2],
            ['donor' => 7, 'amount' => 100, 'programme' => null, 'method' => 'momo', 'message' => null, 'status' => 'success', 'created_days_ago' => 1],
            // Pending
            ['donor' => 8, 'amount' => 500, 'programme' => 'Clean Water Initiative', 'method' => 'card', 'message' => null, 'status' => 'pending', 'created_days_ago' => 1],
            ['donor' => 11, 'amount' => 200, 'programme' => null, 'method' => 'momo', 'message' => null, 'status' => 'pending', 'created_days_ago' => 0],
            // Failed
            ['donor' => 5, 'amount' => 1000, 'programme' => null, 'method' => 'card', 'message' => null, 'status' => 'failed', 'created_days_ago' => 15],
        ];

        foreach ($donations as $data) {
            $donor = $donors[$data['donor']];
            Donation::create([
                'donor_name' => $donor['name'],
                'donor_email' => $donor['email'],
                'donor_phone' => $donor['phone'],
                'amount' => $data['amount'] * 100,
                'currency' => 'GHS',
                'reference' => 'HS-'.Str::upper(Str::random(10)),
                'method' => $data['method'],
                'status' => $data['status'],
                'paystack_reference' => 'PSK_'.Str::random(16),
                'is_recurring' => $data['is_recurring'] ?? false,
                'programme' => $data['programme'],
                'message' => $data['message'],
                'is_anonymous' => $data['is_anonymous'] ?? false,
                'created_at' => now()->subDays($data['created_days_ago']),
                'updated_at' => now()->subDays($data['created_days_ago']),
            ]);
        }
    }

    private function seedContactMessages(): void
    {
        $messages = [
            ['name' => 'Afia Pokua', 'email' => 'afia.pokua@gmail.com', 'subject' => 'Volunteer Inquiry', 'message' => "Hello, I'm a final-year nursing student at UG and I'd love to volunteer with your mobile health clinics during my NYSS year. Is that possible? I'm particularly interested in the Northern Region programme.", 'is_read' => true, 'replied_at' => now()->subDays(5)],
            ['name' => 'Richard Amankwa', 'email' => 'r.amankwa@citifmonline.com', 'subject' => 'Media Request', 'message' => "I'm a journalist with Citi FM working on a documentary about rural water access in Ghana. I'd like to interview your founder and visit the Bongo District borehole sites. Could you arrange this? We're looking at a broadcast date in March.", 'is_read' => true, 'replied_at' => now()->subDays(12)],
            ['name' => 'Dr. Eben Quaye', 'email' => 'equaye@worldbank.org', 'subject' => 'Partnership Opportunity', 'message' => "I'm with the World Bank's Water and Sanitation Programme in Accra. We're mapping successful community-managed water systems in Ghana and your Bongo model looks promising. Would your team be open to a knowledge-sharing session?", 'is_read' => true, 'replied_at' => now()->subDays(20)],
            ['name' => 'Maame Esi Asante', 'email' => 'maameesi@gmail.com', 'subject' => 'Donation Question', 'message' => "I donated GHS 500 last month via mobile money but haven't received a receipt or confirmation email. My transaction reference is MOMO-2026-07-15-xxxx. Can you please verify? Thank you.", 'is_read' => true, 'replied_at' => now()->subDays(2)],
            ['name' => 'Kwesi Mensah', 'email' => 'kwesi.mensah@outlook.com', 'subject' => 'General Inquiry', 'message' => "I'm a Ghanaian living in London and I'd like to organise a small fundraiser at my church for HopeSpring. Can you send me a fundraising toolkit or brochure I can share with the congregation? We're particularly interested in the girls' scholarship programme.", 'is_read' => false, 'replied_at' => null],
            ['name' => 'Janet Owusu-Ansah', 'email' => 'janet.oa@giz.de', 'subject' => 'Partnership Opportunity', 'message' => 'GIZ Ghana is exploring community-based WASH maintenance models for a new programme in the Savannah Region. Your WASH committee approach aligns well. Could we set up a call to discuss potential collaboration?', 'is_read' => false, 'replied_at' => null],
            ['name' => 'Patrick Adjei', 'email' => 'patrick.adjei@ashesi.edu.gh', 'subject' => 'Event Information', 'message' => "I'm a student at Ashesi University and our community-service club would like to attend your Back-to-School Supply Drive as volunteers. We have about 15 students interested. Is registration required?", 'is_read' => false, 'replied_at' => null],
            ['name' => 'Naana Otu', 'email' => 'naana.otu@gmail.com', 'subject' => 'Volunteer Inquiry', 'message' => "I'm a retired teacher (35 years with GES) and I'd like to help with the teacher training programme in Upper West. I have experience mentoring new teachers and can travel. Please let me know how to get involved.", 'is_read' => false, 'replied_at' => null],
            ['name' => 'David Koomson', 'email' => 'dkoomson@unilever.com', 'subject' => 'Partnership Opportunity', 'message' => "Unilever Ghana's CSR team is looking for NGO partners for our rural hygiene promotion campaign in 2027. Your WASH work in the Upper East aligns perfectly. Can we schedule a meeting to explore a partnership?", 'is_read' => false, 'replied_at' => null],
            ['name' => 'Serwaa Bonsu', 'email' => 'serwaa.bonsu@knust.edu.gh', 'subject' => 'General Inquiry', 'message' => "I'm a PhD candidate in Water Resources Engineering at KNUST. My research focuses on hand-pump sustainability in northern Ghana. Would HopeSpring be willing to share maintenance data from the Bongo boreholes? I'd be happy to share my findings with your team.", 'is_read' => false, 'replied_at' => null],
        ];

        foreach ($messages as $msg) {
            ContactMessage::create($msg);
        }
    }

    private function seedNewsletterSubscribers(): void
    {
        $emails = [
            'akosua.boateng@gmail.com', 'michael.owusu@yahoo.com', 'esi.amoah@gmail.com',
            'nana.mensah@outlook.com', 'abena.frimpong@gmail.com', 'kweku.appiah@hotmail.com',
            'gifty.asare@gmail.com', 'samuel.osei@gmail.com', 'comfort.adjei@yahoo.com',
            'ibrahim.yakubu@gmail.com', 'felicia.mensah@gmail.com', 'joseph.tetteh@gmail.com',
            'afia.pokua@gmail.com', 'kwesi.mensah@outlook.com', 'naana.otu@gmail.com',
            'serwaa.bonsu@knust.edu.gh', 'patrick.adjei@ashesi.edu.gh',
            'diana.owusu@gmail.com', 'eric.nartey@gmail.com', 'grace.ampomah@yahoo.com',
            'francis.mensah@gmail.com', 'adelaide.quaye@gmail.com', 'bernard.tawiah@outlook.com',
            'juliana.ofosu@gmail.com', 'benjamin.antwi@gmail.com',
        ];

        foreach ($emails as $i => $email) {
            NewsletterSubscriber::create([
                'email' => $email,
                'subscribed_at' => now()->subDays(rand(7, 500)),
            ]);
        }
    }

    private function seedInquiries(): void
    {
        $inquiries = [
            // Volunteers
            ['type' => 'volunteer', 'name' => 'Afia Pokua', 'email' => 'afia.pokua@gmail.com', 'phone' => '+233 20 456 7890', 'message' => "I'm a final-year nursing student at the University of Ghana and would like to serve my national service year with HopeSpring's mobile health clinics in the Northern Region. I have clinical experience in maternal health and immunisation.", 'status' => 'reviewed'],
            ['type' => 'volunteer', 'name' => 'Patrick Adjei', 'email' => 'patrick.adjei@ashesi.edu.gh', 'phone' => '+233 55 678 1234', 'message' => "I'm an Ashesi computer science student interested in helping with your data management and M&E systems during the summer break (June–August). I can build dashboards and automate reporting.", 'status' => 'new'],
            ['type' => 'volunteer', 'name' => 'Naana Otu', 'email' => 'naana.otu@gmail.com', 'phone' => '+233 24 012 3456', 'message' => "Retired GES teacher with 35 years of experience. I'd like to support the Upper West teacher training programme as a mentor. I can travel and stay in Wa for 2–3 weeks per term.", 'status' => 'converted'],
            ['type' => 'volunteer', 'name' => 'Eric Nartey', 'email' => 'eric.nartey@gmail.com', 'phone' => '+233 27 345 6789', 'message' => "I'm a civil engineer working in Accra and would like to volunteer on weekends for water infrastructure projects. I have experience with borehole siting and pipe-laying.", 'status' => 'new'],
            ['type' => 'volunteer', 'name' => 'Diana Owusu', 'email' => 'diana.owusu@gmail.com', 'phone' => '+233 20 789 0123', 'message' => "I'm a photographer and videographer. I'd love to volunteer my skills to document your fieldwork — the stories on your website are powerful, but having professional photos would make fundraising materials even stronger.", 'status' => 'reviewed'],
            ['type' => 'volunteer', 'name' => 'Adelaide Quaye', 'email' => 'adelaide.quaye@gmail.com', 'phone' => '+233 54 234 5678', 'message' => "I'm a social worker with experience in women's empowerment programmes. I'd like to support the Nkoranza VSLA groups — I've facilitated similar savings-group models with CARE International.", 'status' => 'new'],

            // Partners
            ['type' => 'partner', 'name' => 'Janet Owusu-Ansah', 'email' => 'janet.oa@giz.de', 'phone' => '+233 30 274 5678', 'organisation' => 'GIZ Ghana', 'message' => "GIZ is designing a WASH sustainability programme for the Savannah Region. HopeSpring's community-managed maintenance model is exactly what we're looking for as a reference. We'd like to discuss a technical partnership — knowledge exchange, joint training, and possibly co-funding a pilot expansion.", 'status' => 'reviewed'],
            ['type' => 'partner', 'name' => 'David Koomson', 'email' => 'dkoomson@unilever.com', 'phone' => '+233 30 221 3456', 'organisation' => 'Unilever Ghana', 'message' => "Unilever Ghana is planning a rural hygiene promotion campaign for 2027 under our Lifebuoy brand. We're looking for an NGO partner with field presence in the Upper East and Northern regions. Would HopeSpring be interested in a branded partnership? We can provide product supplies, funding, and media coverage.", 'status' => 'new'],
            ['type' => 'partner', 'name' => 'Dr. Eben Quaye', 'email' => 'equaye@worldbank.org', 'phone' => '+233 30 221 7890', 'organisation' => 'World Bank – Water & Sanitation Programme', 'message' => 'The World Bank is compiling case studies of successful community-managed water systems in Sub-Saharan Africa. Your Bongo District model — particularly the WASH committees and fee-collection system — is exactly the kind of approach we want to document. This would involve a 2-day field visit and interviews with your team and community members.', 'status' => 'converted'],
            ['type' => 'partner', 'name' => 'Grace Ampomah', 'email' => 'grace.ampomah@yahoo.com', 'phone' => '+233 24 567 0123', 'organisation' => 'Ampomah & Sons Construction', 'message' => "We're a Kumasi-based construction firm and would like to offer discounted rates for your classroom and community-centre projects in the Ashanti and Bono regions. We built 12 schools for the GES last year. Happy to provide references.", 'status' => 'new'],
        ];

        foreach ($inquiries as $data) {
            Inquiry::create($data);
        }
    }

    private function seedImpactStats(): void
    {
        $stats = [
            ['label' => 'Lives Impacted', 'value' => 25000, 'suffix' => '+', 'sort_order' => 1],
            ['label' => 'Water Projects', 'value' => 50, 'sort_order' => 2],
            ['label' => 'Children Supported', 'value' => 3000, 'suffix' => '+', 'sort_order' => 3],
            ['label' => 'Communities Served', 'value' => 100, 'sort_order' => 4],
        ];

        foreach ($stats as $stat) {
            ImpactStat::create($stat);
        }
    }

    private function seedMilestones(): void
    {
        $milestones = [
            ['year' => '2015', 'title' => 'Foundation Established', 'description' => 'Kwame Asante founded HopeSpring in Accra after witnessing the water crisis in the Upper East Region. The foundation registered with the Department of Social Welfare with a mandate covering water, education, healthcare, and community development.', 'sort_order' => 1],
            ['year' => '2016', 'title' => 'First Borehole Drilled', 'description' => 'Completed our first borehole in Sirigu, Upper East Region, providing clean water to over 500 people. The project established the WASH committee model that we still use today — community-managed, fee-funded, and locally maintained.', 'sort_order' => 2],
            ['year' => '2018', 'title' => 'Education Programme Launched', 'description' => 'Launched the Education for All programme with the Yendi Girls\' Scholarship Fund, sponsoring 45 girls in its first year. The fund covers tuition, uniforms, books, exam fees, and a daily school meal.', 'sort_order' => 3],
            ['year' => '2020', 'title' => 'Healthcare Outreach Begins', 'description' => 'Expanded into healthcare with quarterly mobile clinics serving 12 communities in the Northern Region. The programme was developed in consultation with the Ghana Health Service and Tamale Teaching Hospital.', 'sort_order' => 4],
            ['year' => '2023', 'title' => '10,000 Lives Milestone', 'description' => 'Reached the milestone of impacting over 10,000 lives across all programme areas. The Bongo District Borehole Network — our largest single project — was completed this year, bringing the water programme to 50 installations.', 'sort_order' => 5],
            ['year' => '2025', 'title' => '25,000 Lives & Growing', 'description' => 'Surpassed 25,000 lives impacted. Opened the Sefwi Wiawso Community Centre, launched the Upper West teacher training pilot, and began planning expansions into the Volta and Bono East regions.', 'sort_order' => 6],
        ];

        foreach ($milestones as $milestone) {
            Milestone::create($milestone);
        }
    }

    private function seedPartners(): void
    {
        $partners = [
            ['name' => 'UNICEF Ghana', 'logo' => 'partners/unicef-ghana.jpg', 'sort_order' => 1],
            ['name' => 'World Vision', 'logo' => 'partners/world-vision.jpg', 'sort_order' => 2],
            ['name' => 'Ghana Health Service', 'logo' => 'partners/ghana-health-service.jpg', 'sort_order' => 3],
            ['name' => 'WaterAid', 'logo' => 'partners/wateraid.jpg', 'sort_order' => 4],
            ['name' => 'Ghana Education Service', 'logo' => 'partners/ghana-education-service.jpg', 'sort_order' => 5],
            ['name' => 'MTN Ghana Foundation', 'logo' => 'partners/mtn-ghana-foundation.jpg', 'sort_order' => 6],
        ];

        foreach ($partners as $partner) {
            $partner['logo'] = $this->storageUrl($partner['logo']);
            Partner::create($partner);
        }
    }

    private function seedSiteSettings(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'HopeSpring Foundation', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Transforming Lives, Building Futures', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'info@hopespringfoundation.org', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+233 24 123 4567', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => '14 Maseru Road, East Legon, Accra, Ghana', 'group' => 'contact'],
            ['key' => 'about_mission', 'value' => 'To empower underserved communities in Ghana through sustainable clean water, education, healthcare, and community development programmes.', 'group' => 'about'],
            ['key' => 'about_vision', 'value' => 'A Ghana where every community has access to clean water, quality education, and essential healthcare.', 'group' => 'about'],
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/hopespringfoundation', 'group' => 'social'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/hopespringgh', 'group' => 'social'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/hopespringfoundation', 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/hopespring-foundation', 'group' => 'social'],
            ['key' => 'paystack_public_key', 'value' => '', 'group' => 'payment'],
            ['key' => 'donation_goal', 'value' => '500000', 'group' => 'payment'],
            ...HomePageSettings::defaults(),
        ];

        foreach ($settings as $setting) {
            SiteSetting::create($setting);
        }
    }
}
