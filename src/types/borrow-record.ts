export interface BorrowRecord {
  id: number;
  user_id: number;
  book_copy_id: number;
  is_renewed: boolean;
  status: 'BORROWING' | 'RETURNED' | 'LOST' | 'DAMAGED';
  create_time: string;
  due_time: string;
  end_time: string | null;
}

export type BorrowRecordWithBookId = BorrowRecord & { book_id: number };
