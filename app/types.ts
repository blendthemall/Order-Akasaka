import { IconType } from 'react-icons';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: 'drink' | 'food';
  description: string;
  icon?: IconType;
  color?: string;
  imagePath?: string;
}

export interface Order {
  id: string;
  seatNumber: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
    withMilk?: boolean;
  }[];
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

export type SeatNumber = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' |
                        'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' |
                        'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'; 