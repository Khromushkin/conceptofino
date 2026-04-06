import { reviews } from '@/data/reviews'
import type { Review } from '@/types'

export async function getReviews(): Promise<Review[]> {
  return reviews
}
