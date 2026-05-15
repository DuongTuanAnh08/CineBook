export type SeatType = 'standard' | 'vip' | 'couple'
export type SeatStatus = 'available' | 'booked' | 'selected' | 'held'

export interface Seat {
  id: string
  row: string
  number: number
  type: SeatType
  status: SeatStatus
  price: number
}

export interface SeatRow {
  row: string
  seats: Seat[]
}

export interface SeatLayout {
  rows: SeatRow[]
  screen: {
    width: number
    position: 'top' | 'bottom'
  }
}

export interface BookingSession {
  id: string
  movieId: string
  movieTitle: string
  moviePoster: string
  cinemaName: string
  roomName: string
  showDate: string
  showTime: string
  selectedSeats: Seat[]
  totalPrice: number
  expiresAt: Date
}

export interface SeatPricing {
  standard: number
  vip: number
  couple: number
}
