export interface Giveaway {
  id: number
  title: string
  thumbnail: string
  image: string
  description: string
  instructions: string
  open_giveaway_url: string
  published_date: string
  type: string
  platforms: string
  end_date: string
  users: number
  status: string
  gamerpower_url: string
  open_giveaway: string
  worth: string
}

export interface SavedGame {
  id: number
  title: string
  thumbnail: string
  platforms: string
  end_date: string
  open_giveaway_url: string
}

export interface NotificationItem {
  id: string
  gameId: number
  title: string
  description: string
  thumbnail: string
  time: string
  read: boolean
  section: 'today' | 'yesterday'
}
