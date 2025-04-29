
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-clubhub-gray-light">
        <div className="text-center px-6">
          <h1 className="text-9xl font-bold text-clubhub-blue">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button className="bg-clubhub-blue hover:bg-clubhub-blue-light">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
