export type Homepage = 'freeconvert' | 'freerecord';
export type Category = '공지' | '뉴스' | '이벤트' | '기타';

export type BlogNotice = {
  id: number;
  homepage: Homepage;
  category: Category;
  created_at: string;
  highlight: boolean;
  title: string;
  content: string;
  inserted_at?: string;
  updated_at?: string;
};

export type BlogNoticePayload = Omit<
  BlogNotice,
  'id' | 'inserted_at' | 'updated_at'
>;
