import type { BorrowRecord } from "@/types";

interface BookCopyBase {
  id: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'WITHDRAWN';
  current_borrow_record: BorrowRecord | null;
}

interface BookCopyAdminAddition {
  purchase_price: number;
  purchase_date: string;
  source: string;
  entry_by: number;
  withdrawn_reason: 'LOST' | 'DAMAGED' | 'OTHER' | null
  create_time: string;
  withdrawn_time: string | null;
}

// 泛型合并
export type BookCopyUser = BookCopyBase & { role: 'USER' };
export type BookCopyAdmin = BookCopyBase & { role: 'ADMIN' } & BookCopyAdminAddition;

export type BookCopy = BookCopyUser | BookCopyAdmin;

export interface AddBookCopyRequest {
  book_id: number;
  purchase_price: number;
  purchase_date: string;
  source: string;
}