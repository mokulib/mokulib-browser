interface BookCopyBase {
  id: number;
  is_borrowed_by_me: boolean;
}

interface BookCopyAdminAddition {
  purchase_price: number;
  purchase_date: string;
  source: string;
  entry_by: number;
  entry_by_name: string;
  create_time: string;
}

interface BookCopyAvailable {
  status: 'AVAILABLE';
}

interface BookCopyUnavailableUser {
  status: 'UNAVAILABLE';
  due_time: string;
  is_renewed: boolean;
}

interface BookCopyUnavailableAdmin {
  status: 'UNAVAILABLE';
  borrow_by: number;
  borrow_by_name: string;
  borrow_time: string;
  due_time: string;
  is_renewed: boolean;
}

interface BookCopyWithdrawn {
  status: 'WITHDRAWN';
  remove_status: 'LOST' | 'DAMAGED' | 'OTHER';
  remove_time: string;
}

// 泛型合并
type BookCopyUser = BookCopyBase & { role: 'USER' } & (BookCopyAvailable | BookCopyUnavailableUser | BookCopyWithdrawn);
type BookCopyAdmin = BookCopyBase & { role: 'ADMIN' } & (BookCopyAvailable | BookCopyUnavailableAdmin | BookCopyWithdrawn) & BookCopyAdminAddition;

export type BookCopy = BookCopyUser | BookCopyAdmin;