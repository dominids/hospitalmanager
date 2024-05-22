import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/', // Redirect here if not authenticated
  },
});

export const config = { 
  matcher: ["/dashboard"],
};