export interface BorrowRecord {
  id: number;
  user_id: number;
  book_copy_id: number;
  is_renewed: boolean;
  close_status: 'OPEN' | 'CLOSED' | 'LOST' | 'DAMAGED';
  create_time: string;
  due_time: string;
  close_time: string | null;
}

export type BorrowRecordWithBookId = BorrowRecord & { book_id: number };
