export interface BookReview {
  id: number;
  book_id: number;
  user_id: number;
  user_name: string;
  score: number;
  content: string;
  create_time: string;
}