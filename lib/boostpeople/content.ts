import raw from '../../content/boostpeople/business-manager.json'
import type { BpContent } from '../../types/boostpeople'

export const bpContent = raw as BpContent
export const BP_CLIENT = 'boostpeople'
export const VACANCY_PATH = `/${bpContent.vacancy.slug}`
export const THANK_YOU_PATH = `${VACANCY_PATH}/bedankt`
