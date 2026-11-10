import { readMirrorPart } from '../../../lib/mirror-pages'
import { BP_CLIENT, bpContent } from '../../../lib/boostpeople/content'
import VacancyMirror from '../../../components/boostpeople/VacancyMirror'

export const dynamic = 'force-static'

export default function BusinessManagerPage() {
  const html = readMirrorPart(BP_CLIENT, bpContent.vacancy.slug)
  return <VacancyMirror html={html} content={bpContent} />
}
