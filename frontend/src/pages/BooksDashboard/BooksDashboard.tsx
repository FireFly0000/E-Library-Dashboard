import React from "react";
import "./BooksDashboard.css";
import AllBooksPaging from "./BooksDashboardComponents/AllBooksPaging";
import "react-slidedown/lib/slidedown.css";
import { useAppSelector } from "@/hooks/hooks";
import UploadBookSection from "./BooksDashboardComponents/UploadBookSection";
import Modal from "@/components/Modal";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const BooksDashboard: React.FC = () => {
  const isLogin = useAppSelector((state) => state.authSlice.isLogin);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <main className="books-dashboard-root-container">
      {/* Upload book section starts here */}
      <div className="py-4 w-[90vw] max-w-[1400px]">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setIsUploadOpen(true)}
        >
          Upload a book
        </Button>

        {isLogin ? (
          <Modal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            title="Upload a book"
            className="w-[80vw] max-w-[450px]"
          >
            <UploadBookSection closeModal={() => setIsUploadOpen(false)} />
          </Modal>
        ) : (
          <Modal
            isOpen={isUploadOpen}
            onClose={() => setIsUploadOpen(false)}
            title="Please login to share book"
          />
        )}
      </div>
      {/* Upload book section ends here */}

      <AllBooksPaging />
    </main>
  );
};

export default BooksDashboard;
