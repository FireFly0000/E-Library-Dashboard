// components/Pagination.tsx
import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center">
      <Button
        onClick={() => {
          if (currentPage > 1) {
            onPageChange(currentPage - 1);
          } else {
            onPageChange(totalPages);
          }
        }}
        variant="outline"
        size="sm"
      >
        <ArrowLeft />
      </Button>
      <span className="text-[var(--foreground)] mx-2.5">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={() => {
          if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
          } else {
            onPageChange(1);
          }
        }}
        variant="outline"
        size="sm"
      >
        <ArrowRight />
      </Button>
    </div>
  );
};

export default Pagination;
