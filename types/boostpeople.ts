export interface BpStep {
  id: string
  title: string
  intro: string
}

export interface BpContent {
  vacancy: { slug: string; title: string; location: string; facts: string[] }
  privacyUrl: string
  recruiter: { name: string; firstName: string }
  form: {
    title: string
    steps: BpStep[]
    experienceOptions: string[]
    sectorOptions: string[]
    availabilityOptions: string[]
    motivationMax: number
    submitLabel: string
    nextLabel: string
    backLabel: string
  }
  thankYou: {
    title: string
    lead: string
    steps: { title: string; body: string }[]
    backLabel: string
  }
}
