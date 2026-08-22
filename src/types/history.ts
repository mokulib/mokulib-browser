export interface History {
  id: number;
  book_copy_id: number;
  book_id: number;
  borrow_time: string;
  return_time: string;
  close_status: 'CLOSED' | 'LOST' | 'DAMAGED';
  is_renewed: string;
  due_time: string;
}