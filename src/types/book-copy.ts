import type { BorrowRecord } from "@/types";

export type BookCopyUser = {
  id: number;
  role: 'USER';
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'WITHDRAWN';
  current_borrow_record: BorrowRecord | null;
};

type BookCopyAdminBase = {
  id: number;
  role: 'ADMIN';
  purchase_price: number;
  purchase_date: string;
  source: string;
  entry_by: number;
  create_time: string;
};

type BookCopyAdminAvailable = BookCopyAdminBase & {
  status: 'AVAILABLE';
  current_borrow_record: null;
  withdrawn_reason: null;
  withdrawn_time: null;
};

type BookCopyAdminUnavailable = BookCopyAdminBase & {
  status: 'UNAVAILABLE';
  current_borrow_record: BorrowRecord;
  withdrawn_reason: null;
  withdrawn_time: null;
};

type BookCopyAdminWithdrawn = BookCopyAdminBase & {
  status: 'WITHDRAWN';
  current_borrow_record: null;
  withdrawn_reason: 'LOST' | 'DAMAGED' | 'OTHER';
  withdrawn_time: string;
};

export type BookCopyAdmin = BookCopyAdminAvailable | BookCopyAdminUnavailable | BookCopyAdminWithdrawn;

export type BookCopy = BookCopyUser | BookCopyAdmin;

export interface FullBookCopy {
  id: number;
  book_id: number;
  purchase_price: number;
  purchase_date: string;
  source: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'WITHDRAWN';
  entry_by: number;
  withdrawn_reason: 'LOST' | 'DAMAGED' | 'OTHER' | null;
  create_time: string;
  withdrawn_time: string | null;
}

export interface AddBookCopyRequest {
  book_id: number;
  purchase_price: number;
  purchase_date: string;
  source: string;
}