/*
 * ---------------------------------------------------------------------------
 *  Dr. Ramakant Patil — website content
 * ---------------------------------------------------------------------------
 *  Every visible word on the homepage comes from this file. Edit text here,
 *  then run `npm run build`. Templates in src/templates/ only handle layout.
 *
 *  `source` fields are notes for whoever maintains the site; they are never
 *  rendered. IDs such as S06 or P14 refer to the research dossier's source
 *  and photo registers (kept outside the repository).
 *
 *  House style
 *  - "Paediatrics" for the degree and chair names; "pediatric" and
 *    "pediatrician" elsewhere. Official names keep their own spelling
 *    (Indian Academy of Pediatrics). The header keeps "MD Pediatrics".
 *  - Every role carries its year. Past roles are never written as current.
 *  - No patient totals, rankings, reviews, quotations or unverified awards.
 * ---------------------------------------------------------------------------
 */

/* Appointment booking runs on a WhatsApp chatbot (number supplied by the
   agency, 8 Oct 2026). Change the number or message here only. */
const WHATSAPP_NUMBER = '918855095514';
const WHATSAPP_MESSAGE = "Hi, I'd like to book an appointment with Dr. Ramakant Patil.";

export const booking = {
  display: '+91 88550 95514',
  url: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`,
};

export const site = {
  name: 'Dr. Ramakant Patil',
  qualifications: 'MBBS, MD (Paediatrics), FIAP',
  role: 'Pediatrician',
  city: 'Nashik',
  lang: 'en',
  locale: 'en_IN',
  home: {
    title: 'Dr. Ramakant Patil | Pediatrician in Nashik',
    description:
      'Dr. Ramakant Patil, MBBS, MD (Paediatrics), FIAP, pediatrician at Antara Hospital, Nashik. Qualifications, IAP roles, services and appointments.',
  },
  privacy: {
    title: 'Privacy Policy | Dr. Ramakant Patil',
    description:
      'How the Dr. Ramakant Patil website handles information, including appointment requests sent through WhatsApp.',
  },
  ogImage: { src: 'images/og-image.jpg', width: 1200, height: 630, alt: 'Dr. Ramakant Patil, pediatrician in Nashik' },
};

/* Header — preserved from the approved prototype (labels and order fixed). */
export const nav = {
  logo: 'Dr. Ramakant Patil',
  logoSub: 'MD Pediatrics · Nashik',
  links: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Antara Hospital', href: '#hospital' },
    { label: 'Contact', href: '#contact' },
  ],
  cta: { label: 'Book Appointment', short: 'Book', href: booking.url },
};

/* Every hospital phone number, email and address lives here. */
export const contact = {
  hospital: 'Antara Hospital',
  addressLines: [
    'Antara Hospital Building',
    'Opposite Soni Paithani, Kulkarni Colony',
    'Sharanpur Road, Nashik',
    'Maharashtra 422002, India',
  ],
  addressOneLine:
    'Antara Hospital Building, opposite Soni Paithani, Kulkarni Colony, Sharanpur Road, Nashik, Maharashtra 422002, India',
  // Hospital lines from the hospital's own contact page (S03). Not personal numbers.
  phones: [
    { display: '0253-2574263', tel: '+912532574263', primary: true },
    { display: '0253-2310263', tel: '+912532310263' },
    { display: '0253-2318246', tel: '+912532318246' },
    { display: '0253-2315387', tel: '+912532315387' },
  ],
  emails: ['antarahospital2019@gmail.com', 'hospitalantara@gmail.com'],
  website: { label: 'antarahospital.com', href: 'https://antarahospital.com/' },
  // Search link built from the full name and address; no invented pin or place ID.
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(
      'Antara Hospital, opposite Soni Paithani, Kulkarni Colony, Sharanpur Road, Nashik, Maharashtra 422002',
    ),
  // Antara Hospital's own channels, linked from its website (S01).
  social: [
    { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/profile.php?id=61574362169182' },
    { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/antara_hospital/' },
    { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@Antara.Hospital' },
  ],
};

/* Images — local derivatives only. `widths` must match files in public/images. */
export const images = {
  portrait: {
    file: 'portrait-cutout',
    widths: [720, 1080, 1440],
    width: 1440,
    height: 1238,
    alt: 'Dr. Ramakant Patil, smiling, in a navy suit and blue tie, seated in a black leather chair.',
    source: 'Owner-supplied portrait from the approved prototype (4000×4000 JPEG). Flat turquoise backdrop separated; subject unaltered.',
  },
  about: {
    file: 'dr-patil-consulting-desk',
    widths: [508],
    width: 508,
    height: 381,
    alt: 'Dr. Ramakant Patil in a white shirt with a stethoscope, smiling at his desk, a children’s jungle mural on the wall behind him.',
    caption: 'Dr. Ramakant Patil at Antara Hospital.',
    source:
      'P02, Antara Hospital homepage (S01): cropped to Dr. Ramakant Patil alone (box 262,205,770,586). ' +
      'Do NOT use P06 (DSC04910): it shows a staff member at the insurance desk, not Dr. Patil.',
  },
  fellowship: {
    file: 'fellowship-portrait',
    widths: [600, 1200],
    width: 1200,
    height: 1600,
    alt: 'Dr. Ramakant Patil standing in black-and-gold academic regalia and cap, holding two framed certificates.',
    caption: 'Dr. Ramakant Patil with his fellowship certificates.',
    source: 'P14, Antara Hospital gallery (S04). Ceremony date and venue not established.',
  },
  gallery: [
    {
      file: 'fellowship-joint',
      widths: [800, 1600],
      width: 1600,
      height: 900,
      alt: 'Dr. Ramakant Patil in academic regalia and cap, smiling beside Dr. Sadhana Patil.',
      caption: 'In academic regalia, with Dr. Sadhana Patil.',
      source: 'P19, Antara Hospital site (S01). Larger version of P12.',
    },
    {
      file: 'conference-ceremony',
      widths: [600, 1100],
      width: 1100,
      height: 1467,
      alt: 'Dr. Ramakant Patil in academic regalia holding certificates, standing with Dr. Sadhana Patil in front of a conference stage.',
      caption: 'With Dr. Sadhana Patil at a pediatric conference.',
      source: 'P15, Antara Hospital gallery (S04). Event and date not stated.',
    },
    {
      file: 'conference-plaque',
      widths: [600, 1200],
      width: 1200,
      height: 1800,
      alt: 'Dr. Ramakant Patil in a blue suit, smiling and holding a circular plaque at a conference venue.',
      caption: 'At a pediatric conference.',
      source: 'P16, Antara Hospital gallery (S04). Plaque title and year unverified, so not named.',
    },
  ],
  // P02, the joint consulting-room photo, is not repeated here: the About photo is cropped from it.
  hospital: [
    {
      file: 'antara-consulting-room',
      widths: [1008],
      width: 1008,
      height: 360,
      alt: 'Panoramic view of the consulting room at Antara Hospital: Dr. Ramakant Patil and Dr. Sadhana Patil at a white desk, a children’s jungle mural behind them and waiting benches along the walls.',
      caption: 'Dr. Ramakant Patil and Dr. Sadhana Patil in the consulting room at Antara Hospital.',
      source:
        'P01, Antara Hospital homepage (S01). Cropped panorama strip. The research pack called it the reception; ' +
        'the mural, fan and cabinets match the consulting room in P02.',
    },
    {
      file: 'antara-treatment-room',
      widths: [800, 1400],
      width: 1400,
      height: 788,
      alt: 'A treatment room at Antara Hospital with beds, blue privacy curtains and a supply trolley.',
      caption: 'A treatment room at Antara Hospital.',
      source: 'P07, Antara Hospital homepage (S01). Facility context only.',
    },
  ],
};

export const hero = {
  overline: 'Pediatrician · Nashik',
  nameLines: ['Dr. Ramakant', 'Patil'],
  tagline: 'Caring for children, guiding families.',
  intro:
    'For over three decades, Dr. Ramakant Patil has looked after children and advised their parents. He practises at Antara Hospital in Nashik, has taught at a medical college, and has held senior roles in the Indian Academy of Pediatrics.',
  primary: { label: 'Book Appointment' }, // opens WhatsApp (see `booking`)
  secondary: { label: 'About Dr. Patil', href: '#about' },
  practiceLine: 'Antara Hospital · Kulkarni Colony, Sharanpur Road, Nashik',
};

/* Verified milestones (not patient counters). */
export const milestones = [
  { year: '1989', title: 'MD in Paediatrics', sub: 'Poona University', source: 'S05 (indexed MMC entry)' },
  { year: '2023', title: 'Fellowship of the IAP', sub: 'FIAP, Indian Academy of Pediatrics', source: 'S06' },
  { year: '2023', title: 'President, MAHAIAP', sub: 'Maharashtra Academy of Pediatrics', source: 'S08, S14' },
  { year: '2026', title: 'IAP Executive Board Member', sub: 'Maharashtra', source: 'S07' },
];

export const about = {
  label: 'About',
  title: ['Over three decades', 'of pediatric care'],
  // The first paragraph carries a drop cap, so it must not open with "Dr." (the cap would split it).
  paragraphs: [
    'Based in Nashik, Dr. Ramakant Dajiba Patil is a pediatrician associated with Antara Hospital and Nelson Hospital. Alongside seeing patients, he counsels families, teaches, and has long been active in pediatric associations.',
    'He completed his MBBS in 1986 and his MD in Paediatrics in 1989, both from Poona University, and studied at B. J. Medical College, Pune. From 2015 to 2017 he was Professor of Paediatrics at Dr. Vasantrao Pawar Medical College, Hospital & Research Centre, Nashik.',
    'His clinical interests include childhood asthma and pediatric critical care. He was president of MAHAIAP in 2023, and in 2026 he represents Maharashtra on the Executive Board of the Indian Academy of Pediatrics.',
  ],
  recordTitle: 'Credentials',
  record: [
    { term: 'MBBS', detail: 'Poona University, 1986', source: 'S05 indexed MMC entry' },
    { term: 'MD (Paediatrics)', detail: 'Poona University, 1989', source: 'S05. Month (Dec) kept internal.' },
    { term: 'Medical college', detail: 'B. J. Medical College, Pune', source: 'S17, S25. Batch year and Sassoon rotation not published.' },
    { term: 'Fellowship', detail: 'FIAP, Indian Academy of Pediatrics, 2023', source: 'S06, F/2023/P-48' },
    { term: 'Teaching', detail: 'Professor of Paediatrics, Dr. Vasantrao Pawar Medical College, Nashik, 2015–17', source: 'S16 faculty lists 2015–16 and 2016–17. Historical.' },
    { term: 'Clinical interests', detail: 'Childhood asthma · Pediatric critical care', source: 'S17. Interests, not subspecialty qualifications.' },
    { term: 'Hospitals', detail: 'Antara Hospital, Nashik · Nelson Hospital, Nashik', source: 'S01–S03, S17, S25' },
    { term: 'Registration', detail: 'Maharashtra Medical Council, Reg. No. 57173', small: true, source: 'S05 indexed entry (1986). Current licence status not claimed.' },
  ],
};

export const services = {
  label: 'Services',
  title: ['From newborn', 'to adolescent'],
  intro: 'Consultations at Antara Hospital, Nashik, for children from birth to the teenage years.',
  groups: [
    {
      title: 'When a child is unwell',
      items: [
        { name: 'Pediatric consultations', text: 'Assessment and treatment of common childhood illnesses, with clear advice for parents.' },
        { name: 'Infectious diseases', text: 'Care for fevers and infections in children, including tuberculosis, a subject he has lectured on.' },
        { name: 'Childhood asthma and wheezing', text: 'Diagnosis, follow-up over time, and help with using inhalers correctly.' },
      ],
    },
    {
      title: 'As a child grows',
      items: [
        { name: 'Newborn and infant care', text: 'Help with feeding, early growth and the usual worries of the first months.' },
        { name: 'Growth and development', text: 'Regular checks on height, weight and developmental milestones.' },
        { name: 'Vaccination and preventive care', text: 'Vaccination advice and preventive check-ups through childhood.' },
        { name: 'Nutrition and child wellness', text: 'Practical advice on diet, eating habits and daily routines.' },
      ],
    },
    {
      title: 'When parents have questions',
      items: [
        {
          name: 'Common childhood concerns and family counselling',
          text: 'Time for parents and grandparents to talk through everyday problems such as constipation, breath-holding spells, repeated urine infections, pica and gas in babies.',
        },
      ],
    },
  ],
  source: 'Topics from Antara Hospital’s published biography and services (S01, S02). No vaccination schedule, ICU, allergy testing or emergency service is offered on this site.',
};

export const approach = {
  label: 'Approach',
  title: ['Care that includes', 'the family'],
  intro:
    'Children are not small adults; their needs change at every stage of growth. A visit is also a conversation with the parents: what is happening, what to watch for, and what comes next.',
  principles: [
    { name: 'Early attention', text: 'Looking into concerns early, and saying clearly when further tests are needed.' },
    { name: 'Prevention', text: 'Vaccination, good nutrition and healthy routines, before illness starts.' },
    { name: 'Clinical judgement', text: 'Careful examination, and decisions shaped by long experience.' },
    { name: 'Family education', text: 'Explaining the problem and the next steps in plain language.' },
    { name: 'Continuity', text: 'Following a child from infancy through the school years.' },
  ],
  source: 'Principles carried over from the prototype. Its two quotations are not attributed to Dr. Patil anywhere.',
};

export const leadership = {
  label: 'Leadership',
  title: ['Service to', 'the profession'],
  intro:
    'Besides his practice, Dr. Patil has served the Indian Academy of Pediatrics and its Maharashtra branch in elected and committee roles, and has led Nashik’s hospital owners’ association.',
  years: [
    {
      year: '2026',
      roles: [{ role: 'Executive Board Member', org: 'Indian Academy of Pediatrics — Maharashtra', source: 'S07, S09, S20' }],
    },
    {
      year: '2025',
      roles: [{ role: 'Member, West Zone', org: 'IAP Grievances Redressal Cell', source: 'S12' }],
    },
    {
      year: '2024',
      roles: [
        { role: 'West Zone Coordinator', org: 'IAP NTEP Committee', source: 'S11. Committee name as published.' },
        { role: 'Chairman', org: 'MAHAIAP Constitution Reform Committee', source: 'S13 p. 19' },
        { role: 'President', org: 'Hospital Owners Association, Nashik', source: 'S23, S24 (May 2024 coverage; Express Healthcare styles it "Hospital Owner Association of Nashik"). Registered name per S28c. Year-bound; not a 2026 title.' },
      ],
    },
    {
      year: '2023',
      roles: [
        { role: 'President', org: 'MAHAIAP', source: 'S08, S14' },
        { role: 'Member', org: 'IAP Finance Committee', source: 'S10' },
      ],
    },
    {
      year: '2022',
      roles: [
        { role: 'Executive Board Member', org: 'Central IAP — Maharashtra', source: 'S15 pp. 2, 44; S17' },
        { role: 'Organising Chairman', org: 'MAHAPEDICON 2022, Nashik', source: 'S15 pp. 3, 40, 42' },
      ],
    },
  ],
  earlierTitle: 'Earlier roles',
  earlier: [
    { text: 'Founder, Nelson Hospital, Nashik', source: 'S17 biography designation; no founding date used.' },
    { text: 'Past President, IAP Nashik Branch', source: 'S17' },
    { text: 'Past State Secretary, MAHAIAP', source: 'S17. Years not attributed.' },
    { text: 'Past Vice President, IMA', source: 'S17. Branch/level not established, so not stated.' },
  ],
  membership: { text: 'Member, IAP National Respiratory Chapter', detail: 'R-01002', source: 'S18' },
  teachingTitle: 'Teaching and talks',
  // Newest first, like the roles beside it.
  teaching: [
    {
      date: '17 January 2026',
      title: 'Programme speaker, PEDICON 2026',
      text: 'CME session “Managing Over-Involved or Anxious Parents: A Conversation Strategy”.',
      link: { label: 'Scientific programme (PDF)', href: 'https://www.pedicon2026.com/images/PEDICON_2026_SCIENTIFIC_PROGRAM_poppins_page_numbers.pdf' },
      source: 'S26 p. 26. Listed in the programme; delivery not separately evidenced.',
    },
    {
      date: '31 May 2024',
      title: 'Panellist, GenNext Hospital Summit, Nashik',
      text: 'Panel on digital technology in hospitals, reported by Express Healthcare.',
      link: { label: 'Read the report', href: 'https://www.expresshealthcare.in/healthcare-videos/gennext-hospital-summit/panel-discussion-digital-acceleration-in-hospitals-opportunities-challenges-and-impact/443910/' },
      source: 'S23, S24',
    },
    {
      date: '20 August 2023',
      title: 'Chief guest, MAHA IYCFCON–POSHAN 2023',
      text: 'Conference on infant and young child feeding, organised by the Department of Pediatrics, Dr. D. Y. Patil Vidyapeeth, Pune.',
      link: { label: 'Read the newsletter (PDF)', href: 'https://dpu.edu.in/documents/other/newsletter-july-to-dec-2023.pdf' },
      source: 'S22 p. 77',
    },
    {
      date: '2022',
      title: 'Speaker, drug-resistant TB course',
      text: 'Medical Learning Hub course on drug-resistant tuberculosis in children: diagnosis and the treatment algorithm.',
      link: { label: 'View the course', href: 'https://medicallearninghub.com/course/treatment-of-paediatric-drug-resistant-tuberculosis-with-complex-case-presentation?lang=en' },
      source: 'S21',
    },
    {
      date: '2015–17',
      title: 'Professor of Paediatrics',
      text: 'Dr. Vasantrao Pawar Medical College, Hospital & Research Centre, Nashik.',
      source: 'S16',
    },
  ],
};

export const recognition = {
  label: 'Recognition',
  title: ['Fellowship and', 'recognition'],
  kicker: 'Indian Academy of Pediatrics',
  award: 'Fellowship of the Indian Academy of Pediatrics',
  short: 'FIAP',
  year: '2023',
  text: 'Awarded to Dr. Ramakant D. Patil of Nashik in 2023. Fellowship no. F/2023/P-48.',
  link: { label: 'View the IAP fellowship list', href: 'https://iapindia.org/fiap-past-members/' },
  source: 'S06; S14 corroborates. The only verified individual honour.',
};

export const community = {
  label: 'Community',
  title: ['Beyond the', 'consulting room'],
  school: {
    title: 'School health',
    paragraphs: [
      'In July 2023, as president of MAHAIAP, Dr. Patil was one of the coordinators who launched Sankalp–Sampoorna Swasthya, a school-health programme, at Navrachana Vidyalaya in Nashik. Run with fellow pediatricians and the school’s teachers, it began with Class 9 students.',
      'He has also given talks, with other pediatricians, on excessive screen use.',
    ],
    focusTitle: 'What the programme covers',
    focus: ['Healthy eating', 'Exercise', 'Responsible gadget use', 'Mental wellbeing', 'Addiction prevention'],
    link: { label: 'Loksatta report, 28 July 2023', lang: 'Marathi', href: 'https://www.loksatta.com/nashik/guidance-to-school-students-for-better-physical-and-mental-health-ysh-95-3819942/' },
    source: 'S29; S14 p. 3. The association’s state-wide student figure is not his personal count and is not published.',
  },
  road: {
    title: 'The long road',
    intro:
      'Outside the hospital, Dr. Patil cycles long distances, treks and runs. He has seen Race Across America from both sides: first in a support crew, then as a rider.',
    milestones: [
      {
        year: '2015',
        title: 'Support crew',
        text: 'In the crew behind the Mahajan brothers, who finished the race as a team of two.',
        source: 'S35. The brothers’ finish is their achievement; he is not described as a rider.',
      },
      {
        year: '2016',
        title: '643 km, Deccan Cliff Hanger',
        text: 'Finished with Dr. Rajendra Nehete in 28 hours 44 minutes, first in the over-50 category.',
        source: 'S34 (TOI, 8 Nov 2016)',
      },
      {
        year: '2017',
        title: 'Race Across America',
        text: 'Finished as part of a four-rider team, riding for Orbis India’s children’s eye-care programme in Bihar.',
        source: 'S17, S36, S37. Team finish; no funds or children-treated figures stated.',
      },
    ],
  },
};

export const gallery = {
  label: 'Photographs',
  title: ['At conferences', 'and ceremonies'],
};

/* Press links, newest first. The first `visible` entries show; the older
   ones sit in a disclosure. */
export const coverage = {
  title: 'In the press',
  visible: 6,
  items: [
    { publisher: 'Express Healthcare', date: '7 June 2024', topic: 'GenNext Hospital Summit, Nashik: panel on digital technology in hospitals.', href: 'https://www.expresshealthcare.in/healthcare-videos/gennext-hospital-summit/panel-discussion-digital-acceleration-in-hospitals-opportunities-challenges-and-impact/443910/' },
    { publisher: 'Dr. D. Y. Patil Vidyapeeth', date: 'July–December 2023', topic: 'MAHA IYCFCON–POSHAN 2023, with Dr. Patil as chief guest.', href: 'https://dpu.edu.in/documents/other/newsletter-july-to-dec-2023.pdf' },
    { publisher: 'Loksatta', date: '28 July 2023', lang: 'Marathi', topic: 'Launch of the Sankalp–Sampoorna Swasthya school-health programme in Nashik.', href: 'https://www.loksatta.com/nashik/guidance-to-school-students-for-better-physical-and-mental-health-ysh-95-3819942/' },
    { publisher: 'Medical Learning Hub', date: '2022', topic: 'Course on drug-resistant tuberculosis in children, with Dr. Patil among the speakers.', href: 'https://medicallearninghub.com/course/treatment-of-paediatric-drug-resistant-tuberculosis-with-complex-case-presentation?lang=en' },
    { publisher: 'Maharashtra Times', date: 'October 2019', lang: 'Marathi', topic: 'Pediatric conference in Nashik on human milk banking; Dr. Patil among the organisers.', href: 'https://maharashtratimes.com/maharashtra/nashik/human-milk-bank-is-a-boon-for-children/articleshow/71583143.cms' },
    { publisher: 'Maharashtra Times', date: 'October 2019', lang: 'Marathi', topic: 'Workshop for nurses held with the same Nashik conference.', href: 'https://maharashtratimes.com/maharashtra/nashik/the-role-of-nurses-in-the-medical-field-is-important/articleshow/71543730.cms' },
    { publisher: 'The Indian Express', date: '21 June 2017', topic: 'Nashik doctors ride Race Across America for children’s eye care in Bihar.', href: 'https://indianexpress.com/article/india/to-ensure-eye-care-for-kids-in-bihar-team-of-doctors-takes-part-in-gruelling-bike-race-4714479/' },
    { publisher: 'Times of India', date: '8 November 2016', topic: 'Dr. Patil and Dr. Rajendra Nehete complete the 643 km Deccan Cliff Hanger.', href: 'https://timesofindia.indiatimes.com/city/nashik/four-cyclists-qualify-for-race-across-america/articleshow/55304500.cms' },
    { publisher: 'Times of India', date: 'June 2015', topic: 'The Mahajan brothers finish Race Across America; Dr. Patil was part of their crew.', href: 'https://timesofindia.indiatimes.com/city/nashik/doctor-brothers-first-indians-to-finish-raam-in-team-of-two-category/articleshow/47872328.cms' },
  ],
  // Other reports were reviewed and deliberately left out (see the local research notes).
};

export const hospital = {
  label: 'Antara Hospital',
  title: ['Antara Hospital,', 'Nashik'],
  paragraphs: [
    'Dr. Patil’s practice is at Antara Hospital in Kulkarni Colony, on Sharanpur Road. Pediatric services there include consultations, newborn care, vaccination, nutrition advice and help with common childhood problems.',
    'Dr. Sadhana Ramakant Patil, also a pediatrician, is part of the hospital’s team.',
  ],
  link: 'Visit antarahospital.com',
  source: 'S01–S03. No family relationship asserted; her credentials are not attributed to him.',
};

export const contactSection = {
  label: 'Contact',
  title: ['Book an appointment', 'on WhatsApp'],
  intro:
    'Send a message to the number below and the appointment assistant will take you through booking. You can also call the hospital.',
};

export const footer = {
  links: [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Recognition', href: '#recognition' },
    { label: 'Community', href: '#community' },
    { label: 'Antara Hospital', href: '#hospital' },
    { label: 'Contact', href: '#contact' },
  ],
  note: 'Professional information only — not medical advice.',
  credit: { prefix: 'Developed by', name: 'Turiya Infotech', href: 'https://turiyainfotech.com/' },
};

/* JSON-LD. Kept consistent with the visible content above. */
export const structuredData = {
  person: {
    name: 'Dr. Ramakant Patil',
    alternateName: ['Dr. Ramakant Dajiba Patil', 'Dr. Ramakant D. Patil'],
    jobTitle: 'Pediatrician',
    honorificPrefix: 'Dr.',
    honorificSuffix: 'MBBS, MD (Paediatrics), FIAP',
    alumniOf: 'B. J. Medical College, Pune',
    knowsAbout: ['Pediatrics', 'Childhood asthma', 'Pediatric critical care'],
  },
};
