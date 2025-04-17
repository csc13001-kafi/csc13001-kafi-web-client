import NextAuth, { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        // Bạn có thể thêm các provider khác ở đây
    ],
    // Các cấu hình khác như callbacks, pages, session, v.v.
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
