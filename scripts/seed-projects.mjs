import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://liiinalrcgfuiovwvoal.supabase.co'
const supabaseKey = 'sb_publishable_gCV2tp9OtZ7WrJ-kZcMkBg_S2ZbEXvq'
const supabase = createClient(supabaseUrl, supabaseKey)

const projects = [
  {
    title: 'KrishiShahay',
    category: 'Web Dev',
    src: '/projects/krishi.jpg',
    description: 'A platform connecting farmers with resources.',
    tech_stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    code_link: 'https://github.com/itszaman7/KrishiLoop',
    demo_link: '',
    story_challenge: 'Farmers lacked direct access to market prices and weather data.',
    story_solution: 'We built a centralized dashboard aggregation system using Node.js.',
    story_outcome: 'Empowered over 500 local farmers with real-time data.'
  },
  {
    title: 'NashitaPOS',
    category: 'Web Dev',
    src: '/projects/nashita.jpg',
    description: 'Point of Sale system for pharmacies.',
    tech_stack: ['React', 'Vite', 'Firebase', 'Tailwind'],
    code_link: 'https://github.com/itszaman7/NashitaPharmaPOS',
    demo_link: 'https://nashita-pharma-pos.vercel.app',
    story_challenge: 'Manual inventory tracking was causing stock discrepancies.',
    story_solution: 'Implemented a real-time inventory sync using Firebase listeners.',
    story_outcome: 'Reduced stock errors by 40% in the first month.'
  },
  {
    title: 'PQDeals',
    category: 'E-commerce',
    src: '/projects/pq.jpg',
    description: 'PQ joint Venture for B2B Multi Vendor Ecommerce.',
    tech_stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Stripe'],
    code_link: '', // Client project
    demo_link: '', // Client project
    story_challenge: 'Handling multi-vendor payouts and complex tax logic.',
    story_solution: 'Integrated Stripe Connect for automated vendor payouts.',
    story_outcome: 'Successfully onboarded 50+ vendors in the beta phase.'
  },
  {
    title: 'ModelAct',
    category: 'AI / ML',
    src: '/projects/modelact.jpg',
    description: 'AI-driven modeling agency platform.',
    tech_stack: ['Python', 'TensorFlow', 'React', 'FastAPI'],
    code_link: '', // Client project
    demo_link: '', // Client project
    story_challenge: 'Matching models to gigs manually was slow and biased.',
    story_solution: 'Developed a matching algorithm based on feature vectors.',
    story_outcome: 'Improved match relevance by 30%.'
  },
  {
    title: 'OasisPlanner',
    category: 'Web Dev',
    src: '/projects/oasis.jpg',
    description: 'Event planning and management tool (Video Editing & Data Analysis).',
    tech_stack: ['Vue.js', 'Nuxt', 'Supabase'],
    code_link: 'https://github.com/Phanthom-Mekat/oasis-planner',
    demo_link: '',
    story_challenge: 'Coordinating large events with multiple stakeholders.',
    story_solution: 'Contributed to data analysis modules and produced promotional video content.',
    story_outcome: 'Used to plan 3 major university events.'
  },
  {
    title: 'OptiHealth',
    category: 'Health Tech',
    src: '/projects/opti.jpg',
    description: 'Health optimization and tracking app.',
    tech_stack: ['React Native', 'TypeScript', 'GraphQL'],
    code_link: 'https://github.com/itszaman7/OptiHealth',
    demo_link: '',
    story_challenge: 'Patients struggled to adhere to post-op recovery plans.',
    story_solution: 'Gamified the recovery process with daily streaks and rewards.',
    story_outcome: 'Increased patient adherence by 25%.'
  }
]

async function seed() {
  console.log('Seeding projects...')
  for (const project of projects) {
    const { data: existing } = await supabase
      .from('projects')
      .select('id')
      .eq('title', project.title)
      .single()

    if (!existing) {
      const { error } = await supabase.from('projects').insert(project)
      if (error) console.error(`Error inserting ${project.title}:`, error)
      else console.log(`Inserted ${project.title}`)
    } else {
      console.log(`Skipped ${project.title} (already exists)`)
    }
  }
}

seed()
