import { localizedString, localizedText } from './localized-string'
import { project } from './project'
import { material } from './material'
import { service } from './service'
import { teamMember } from './team-member'
import { review } from './review'
import { blogPost } from './blog-post'
import { siteSettings } from './site-settings'

export const schemaTypes = [
  localizedString,
  localizedText,
  project,
  material,
  service,
  teamMember,
  review,
  blogPost,
  siteSettings,
]
