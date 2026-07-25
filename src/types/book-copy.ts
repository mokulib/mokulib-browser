import type { BorrowRecord } from "@/types";

export interface MyBorrow {
  is_renewed: boolean;
  due_time: string;
}

interface BookCopyBase {
  id: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'WITHDRAWN';
  my_borrow: MyBorrow | null;
}

interface BookCopyAdminAddition {
  purchase_price: number;
  purchase_date: string;
  source: string;
  entry_by: number;
  withdrawn_reason: 'LOST' | 'DAMAGED' | 'OTHER' | null
  create_time: string;
  withdrawn_time: string | null;
  current_borrow_record: BorrowRecord | null;
}

// 泛型合并
type BookCopyUser = BookCopyBase & { role: 'USER' };
type BookCopyAdmin = BookCopyBase & { role: 'ADMIN' } & BookCopyAdminAddition;

export type BookCopy = BookCopyUser | BookCopyAdmin;

export interface AddBookCopyRequest {
  book_id: number;
  purchase_price: number;
  purchase_date: string;
  source: string;
}