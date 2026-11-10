import { redirect } from 'next/navigation'
import { VACANCY_PATH } from '../../lib/boostpeople/content'

export default function Home() {
  redirect(VACANCY_PATH)
}
